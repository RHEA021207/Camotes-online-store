import { Router, type IRouter } from "express";
import { eq, desc, and } from "drizzle-orm";
import {
  db,
  ordersTable,
  paymentsTable,
} from "@workspace/db";
import {
  ListOrdersQueryParams,
  ListOrdersResponse,
  CreateOrderBody,
  GetOrderParams,
  GetOrderResponse,
  UpdateOrderParams,
  UpdateOrderBody,
  UpdateOrderResponse,
  RecordPaymentParams,
  RecordPaymentBody,
} from "@workspace/api-zod";
import { requireAdmin } from "../lib/auth";
import {
  buildOrderRows,
  buildOrderRow,
  lookupVoucher,
} from "../lib/orderHelpers";

const router: IRouter = Router();

router.get("/orders", requireAdmin, async (req, res): Promise<void> => {
  const params = ListOrdersQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const conditions = [];
  if (params.data.status) {
    conditions.push(eq(ordersTable.status, params.data.status));
  }
  if (params.data.customerId) {
    conditions.push(eq(ordersTable.customerId, params.data.customerId));
  }

  const rows = await db
    .select()
    .from(ordersTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(ordersTable.createdAt));

  const orderRows = await buildOrderRows(rows.map((r) => r.id));
  res.json(ListOrdersResponse.parse(orderRows));
});

router.post("/orders", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  let discountPercent = parsed.data.discountPercent ?? 0;
  let voucherCode = parsed.data.voucherCode ?? null;
  if (voucherCode) {
    const voucherDiscount = lookupVoucher(voucherCode);
    if (voucherDiscount > 0) {
      discountPercent = Math.max(discountPercent, voucherDiscount);
    } else {
      voucherCode = null;
    }
  }

  const [row] = await db
    .insert(ordersTable)
    .values({
      customerId: parsed.data.customerId,
      serviceId: parsed.data.serviceId ?? null,
      serviceName: parsed.data.serviceName,
      quantity: parsed.data.quantity ?? 1,
      unitPrice: parsed.data.unitPrice.toString(),
      discountPercent: discountPercent.toString(),
      voucherCode: voucherCode,
      status: parsed.data.status ?? "pending",
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null,
      notes: parsed.data.notes ?? null,
    })
    .returning();

  const orderRow = await buildOrderRow(row.id);
  res.status(201).json(GetOrderResponse.parse({ ...orderRow, payments: [] }));
});

router.get("/orders/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = GetOrderParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const orderRow = await buildOrderRow(params.data.id);
  if (!orderRow) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  const pays = await db
    .select()
    .from(paymentsTable)
    .where(eq(paymentsTable.orderId, params.data.id))
    .orderBy(desc(paymentsTable.paidAt));

  res.json(
    GetOrderResponse.parse({
      ...orderRow,
      payments: pays.map((p) => ({
        id: p.id,
        orderId: p.orderId,
        amount: Number(p.amount),
        note: p.note,
        paidAt: p.paidAt,
      })),
    }),
  );
});

router.patch("/orders/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = UpdateOrderParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updates: Partial<typeof ordersTable.$inferInsert> = {};
  if (parsed.data.status !== undefined) updates.status = parsed.data.status;
  if (parsed.data.dueDate !== undefined)
    updates.dueDate = parsed.data.dueDate ? new Date(parsed.data.dueDate) : null;
  if (parsed.data.notes !== undefined) updates.notes = parsed.data.notes;
  if (parsed.data.quantity !== undefined)
    updates.quantity = parsed.data.quantity;
  if (parsed.data.unitPrice !== undefined)
    updates.unitPrice = parsed.data.unitPrice.toString();
  if (parsed.data.discountPercent !== undefined)
    updates.discountPercent = parsed.data.discountPercent.toString();
  if (parsed.data.voucherCode !== undefined)
    updates.voucherCode = parsed.data.voucherCode;

  const [row] = await db
    .update(ordersTable)
    .set(updates)
    .where(eq(ordersTable.id, params.data.id))
    .returning();
  if (!row) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  const orderRow = await buildOrderRow(row.id);
  res.json(UpdateOrderResponse.parse(orderRow));
});

router.post(
  "/orders/:id/payments",
  requireAdmin,
  async (req, res): Promise<void> => {
    const params = RecordPaymentParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }
    const parsed = RecordPaymentBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }

    const [order] = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.id, params.data.id));
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    // Apply voucher at payment time if provided and order has no discount yet
    if (parsed.data.voucherCode) {
      const voucherDiscount = lookupVoucher(parsed.data.voucherCode);
      if (voucherDiscount > 0) {
        const currentDiscount = Number(order.discountPercent ?? 0);
        if (voucherDiscount > currentDiscount) {
          await db
            .update(ordersTable)
            .set({
              discountPercent: voucherDiscount.toString(),
              voucherCode: parsed.data.voucherCode.trim().toUpperCase(),
            })
            .where(eq(ordersTable.id, params.data.id));
        }
      }
    }

    const [payment] = await db
      .insert(paymentsTable)
      .values({
        orderId: params.data.id,
        amount: parsed.data.amount.toString(),
        note: parsed.data.note ?? null,
      })
      .returning();

    // Auto mark order as "paid" if balance hits zero
    const updated = await buildOrderRow(params.data.id);
    if (updated && updated.balance === 0 && updated.status !== "cancelled") {
      await db
        .update(ordersTable)
        .set({ status: "paid" })
        .where(eq(ordersTable.id, params.data.id));
    } else if (
      updated &&
      updated.balance > 0 &&
      order.status === "pending"
    ) {
      await db
        .update(ordersTable)
        .set({ status: "active" })
        .where(eq(ordersTable.id, params.data.id));
    }

    res.status(201).json({
      id: payment.id,
      orderId: payment.orderId,
      amount: Number(payment.amount),
      note: payment.note,
      paidAt: payment.paidAt,
    });
  },
);

export default router;
