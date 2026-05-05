import { Router, type IRouter } from "express";
import { eq, ilike, or, desc, and, asc } from "drizzle-orm";
import {
  db,
  customersTable,
  ordersTable,
  paymentsTable,
} from "@workspace/db";
import {
  ListCustomersQueryParams,
  ListCustomersResponse,
  CreateCustomerBody,
  GetCustomerParams,
  GetCustomerResponse,
  UpdateCustomerParams,
  UpdateCustomerBody,
  UpdateCustomerResponse,
  GetCustomerTimelineParams,
  GetCustomerTimelineResponse,
  PortalLookupQueryParams,
  PortalLookupResponse,
  GetCustomerByCodeParams,
  GetCustomerByCodeResponse,
} from "@workspace/api-zod";
import { requireAdmin } from "../lib/auth";
import { buildOrderRows } from "../lib/orderHelpers";
import { Customer } from "../domain";

const router: IRouter = Router();

async function withStats(
  customers: (typeof customersTable.$inferSelect)[],
): Promise<unknown[]> {
  if (customers.length === 0) return [];
  const ids = customers.map((c) => c.id);
  const orders = await db
    .select()
    .from(ordersTable)
    .where(or(...ids.map((id) => eq(ordersTable.customerId, id)))!);
  const orderRows = await buildOrderRows(orders.map((o) => o.id));

  const byCustomer = new Map<
    number,
    {
      total: number;
      outstanding: number;
      unpaid: number;
      nextDue: Date | null;
    }
  >();

  for (const c of customers) {
    byCustomer.set(c.id, {
      total: 0,
      outstanding: 0,
      unpaid: 0,
      nextDue: null,
    });
  }

  for (const o of orderRows) {
    const stats = byCustomer.get(o.customerId);
    if (!stats) continue;
    stats.total += 1;
    if (o.status !== "cancelled" && o.status !== "cart") {
      stats.outstanding += o.balance;
      if (o.balance > 0 && o.status !== "paid") {
        stats.unpaid += 1;
        if (o.dueDate) {
          if (!stats.nextDue || o.dueDate < stats.nextDue) {
            stats.nextDue = o.dueDate;
          }
        }
      }
    }
  }

  return customers.map((c) => {
    const stats = byCustomer.get(c.id)!;
    const customerObj = new Customer({
      id: c.id,
      name: c.name,
      phone: c.phone,
      email: c.email,
      notes: c.notes,
    });
    return {
      id: c.id,
      code: customerObj.code,
      name: c.name,
      phone: c.phone,
      email: c.email,
      notes: c.notes,
      createdAt: c.createdAt,
      totalOrders: stats.total,
      outstandingBalance: Number(stats.outstanding.toFixed(2)),
      unpaidOrders: stats.unpaid,
      nextDueDate: stats.nextDue,
    };
  });
}

router.get("/customers", requireAdmin, async (req, res): Promise<void> => {
  const params = ListCustomersQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const { search } = params.data;

  let where;
  if (search && search.trim() !== "") {
    const like = `%${search.trim()}%`;
    where = or(
      ilike(customersTable.name, like),
      ilike(customersTable.phone, like),
      ilike(customersTable.email, like),
    );
  }

  const rows = await db
    .select()
    .from(customersTable)
    .where(where)
    .orderBy(asc(customersTable.name));

  const result = await withStats(rows);
  res.json(ListCustomersResponse.parse(result));
});

router.get(
  "/customers/by-code/:code",
  requireAdmin,
  async (req, res): Promise<void> => {
    const params = GetCustomerByCodeParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }
    const id = Customer.idFromCode(params.data.code);
    if (id === null) {
      res
        .status(404)
        .json({ error: "Invalid customer code. Use format COS-101." });
      return;
    }
    const [row] = await db
      .select()
      .from(customersTable)
      .where(eq(customersTable.id, id));
    if (!row) {
      res.status(404).json({ error: "Customer not found" });
      return;
    }
    const [withStatsRow] = await withStats([row]);
    res.json(GetCustomerByCodeResponse.parse(withStatsRow));
  },
);

router.get("/portal/lookup", async (req, res): Promise<void> => {
  const params = PortalLookupQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const { name, phone } = params.data;

  const conditions = [];
  if (name && name.trim() !== "") {
    conditions.push(ilike(customersTable.name, `%${name.trim()}%`));
  }
  if (phone && phone.trim() !== "") {
    conditions.push(ilike(customersTable.phone, `%${phone.trim()}%`));
  }

  if (conditions.length === 0) {
    res.json(PortalLookupResponse.parse([]));
    return;
  }

  const rows = await db
    .select()
    .from(customersTable)
    .where(and(...conditions))
    .orderBy(asc(customersTable.name))
    .limit(20);

  const result = await withStats(rows);
  res.json(PortalLookupResponse.parse(result));
});

router.post("/customers", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateCustomerBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [row] = await db
    .insert(customersTable)
    .values({
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email ?? null,
      notes: parsed.data.notes ?? null,
    })
    .returning();

  res.status(201).json({
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email,
    notes: row.notes,
    createdAt: row.createdAt,
  });
});

router.get("/customers/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = GetCustomerParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [row] = await db
    .select()
    .from(customersTable)
    .where(eq(customersTable.id, params.data.id));
  if (!row) {
    res.status(404).json({ error: "Customer not found" });
    return;
  }
  const [withStatsRow] = await withStats([row]);
  res.json(GetCustomerResponse.parse(withStatsRow));
});

router.patch(
  "/customers/:id",
  requireAdmin,
  async (req, res): Promise<void> => {
    const params = UpdateCustomerParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }
    const parsed = UpdateCustomerBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const updates: Partial<typeof customersTable.$inferInsert> = {};
    if (parsed.data.name !== undefined) updates.name = parsed.data.name;
    if (parsed.data.phone !== undefined) updates.phone = parsed.data.phone;
    if (parsed.data.email !== undefined) updates.email = parsed.data.email;
    if (parsed.data.notes !== undefined) updates.notes = parsed.data.notes;

    const [row] = await db
      .update(customersTable)
      .set(updates)
      .where(eq(customersTable.id, params.data.id))
      .returning();
    if (!row) {
      res.status(404).json({ error: "Customer not found" });
      return;
    }
    res.json(
      UpdateCustomerResponse.parse({
        id: row.id,
        name: row.name,
        phone: row.phone,
        email: row.email,
        notes: row.notes,
        createdAt: row.createdAt,
      }),
    );
  },
);

router.get(
  "/customers/:id/timeline",
  async (req, res): Promise<void> => {
    const params = GetCustomerTimelineParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }
    const [customer] = await db
      .select()
      .from(customersTable)
      .where(eq(customersTable.id, params.data.id));
    if (!customer) {
      res.status(404).json({ error: "Customer not found" });
      return;
    }

    const orders = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.customerId, params.data.id))
      .orderBy(desc(ordersTable.createdAt));

    const orderRows = await buildOrderRows(orders.map((o) => o.id));

    const cartOrders = orderRows.filter((o) => o.status === "cart");
    const unpaidOrders = orderRows.filter(
      (o) =>
        o.balance > 0 &&
        (o.status === "pending" || o.status === "active"),
    );
    const paidOrders = orderRows.filter(
      (o) => o.status === "paid" || (o.balance === 0 && o.status !== "cart" && o.status !== "cancelled"),
    );

    const orderIds = orderRows.map((o) => o.id);
    let recentPayments: {
      id: number;
      orderId: number;
      amount: number;
      note: string | null;
      paidAt: Date;
    }[] = [];
    if (orderIds.length > 0) {
      const pays = await db
        .select()
        .from(paymentsTable)
        .where(or(...orderIds.map((id) => eq(paymentsTable.orderId, id)))!)
        .orderBy(desc(paymentsTable.paidAt))
        .limit(20);
      recentPayments = pays.map((p) => ({
        id: p.id,
        orderId: p.orderId,
        amount: Number(p.amount),
        note: p.note,
        paidAt: p.paidAt,
      }));
    }

    const [customerWithStats] = await withStats([customer]);

    res.json(
      GetCustomerTimelineResponse.parse({
        customer: customerWithStats,
        unpaidOrders,
        cartOrders,
        paidOrders,
        recentPayments,
      }),
    );
  },
);

export default router;
