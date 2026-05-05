import { Router, type IRouter } from "express";
import { eq, sql, desc, lt, ne, and, count, gte, lte } from "drizzle-orm";
import {
  db,
  ordersTable,
  paymentsTable,
  customersTable,
  servicesTable,
} from "@workspace/db";
import {
  GetDashboardSummaryResponse,
  GetRecentActivityResponse,
  GetOverdueOrdersResponse,
  GetTopServicesResponse,
  GetDailyReportQueryParams,
  GetDailyReportResponse,
  GetDueTodayResponse,
  GetLowStockQueryParams,
  GetLowStockResponse,
  CalculatePaymentBody,
  CalculatePaymentResponse,
  ListServicesResponse,
} from "@workspace/api-zod";
import { requireAdmin } from "../lib/auth";
import { buildOrderRows } from "../lib/orderHelpers";
import { LOW_STOCK_THRESHOLD } from "../domain";

const router: IRouter = Router();

router.get(
  "/dashboard/summary",
  requireAdmin,
  async (_req, res): Promise<void> => {
    const [{ totalCustomers }] = await db
      .select({ totalCustomers: count() })
      .from(customersTable);

    const [{ totalServices }] = await db
      .select({ totalServices: count() })
      .from(servicesTable);

    const allOrders = await db.select().from(ordersTable);
    const orderRows = await buildOrderRows(allOrders.map((o) => o.id));

    let activeOrders = 0;
    let overdueOrders = 0;
    let paidOrders = 0;
    let totalOutstanding = 0;
    const now = new Date();
    for (const o of orderRows) {
      if (o.status === "active" || o.status === "pending") {
        if (o.balance > 0) activeOrders += 1;
        totalOutstanding += o.balance;
        if (o.dueDate && o.dueDate < now && o.balance > 0) {
          overdueOrders += 1;
        }
      } else if (o.status === "paid") {
        paidOrders += 1;
      }
    }

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthPays = await db
      .select({
        sum: sql<string>`COALESCE(SUM(${paymentsTable.amount}), 0)`,
      })
      .from(paymentsTable)
      .where(sql`${paymentsTable.paidAt} >= ${startOfMonth.toISOString()}`);
    const collectedThisMonth = Number(monthPays[0]?.sum ?? 0);

    res.json(
      GetDashboardSummaryResponse.parse({
        totalCustomers,
        totalServices,
        activeOrders,
        overdueOrders,
        totalOutstanding: Number(totalOutstanding.toFixed(2)),
        collectedThisMonth: Number(collectedThisMonth.toFixed(2)),
        paidOrders,
      }),
    );
  },
);

router.get(
  "/dashboard/recent-activity",
  requireAdmin,
  async (_req, res): Promise<void> => {
    const recentPayments = await db
      .select({
        id: paymentsTable.id,
        amount: paymentsTable.amount,
        paidAt: paymentsTable.paidAt,
        orderId: paymentsTable.orderId,
        customerName: customersTable.name,
        serviceName: ordersTable.serviceName,
      })
      .from(paymentsTable)
      .leftJoin(ordersTable, eq(paymentsTable.orderId, ordersTable.id))
      .leftJoin(customersTable, eq(ordersTable.customerId, customersTable.id))
      .orderBy(desc(paymentsTable.paidAt))
      .limit(10);

    const recentOrders = await db
      .select({
        id: ordersTable.id,
        createdAt: ordersTable.createdAt,
        serviceName: ordersTable.serviceName,
        unitPrice: ordersTable.unitPrice,
        quantity: ordersTable.quantity,
        customerName: customersTable.name,
      })
      .from(ordersTable)
      .leftJoin(customersTable, eq(ordersTable.customerId, customersTable.id))
      .orderBy(desc(ordersTable.createdAt))
      .limit(10);

    const items = [
      ...recentPayments.map((p) => ({
        id: `pay-${p.id}`,
        kind: "payment" as const,
        timestamp: p.paidAt,
        customerName: p.customerName ?? "Unknown",
        description: `Paid for ${p.serviceName ?? "an item"}`,
        amount: Number(p.amount),
      })),
      ...recentOrders.map((o) => ({
        id: `ord-${o.id}`,
        kind: "order" as const,
        timestamp: o.createdAt,
        customerName: o.customerName ?? "Unknown",
        description: `New order: ${o.serviceName}`,
        amount: Number(o.unitPrice) * o.quantity,
      })),
    ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    res.json(GetRecentActivityResponse.parse(items.slice(0, 15)));
  },
);

router.get(
  "/dashboard/overdue",
  requireAdmin,
  async (_req, res): Promise<void> => {
    const now = new Date();
    const candidates = await db
      .select()
      .from(ordersTable)
      .where(
        and(
          lt(ordersTable.dueDate, now),
          ne(ordersTable.status, "paid"),
          ne(ordersTable.status, "cancelled"),
          ne(ordersTable.status, "cart"),
        ),
      );
    const orderRows = await buildOrderRows(candidates.map((o) => o.id));
    const overdue = orderRows
      .filter((o) => o.balance > 0)
      .sort((a, b) => {
        const ad = a.dueDate ? a.dueDate.getTime() : 0;
        const bd = b.dueDate ? b.dueDate.getTime() : 0;
        return ad - bd;
      });
    res.json(GetOverdueOrdersResponse.parse(overdue));
  },
);

router.get(
  "/dashboard/top-services",
  requireAdmin,
  async (_req, res): Promise<void> => {
    const rows = await db
      .select({
        serviceId: ordersTable.serviceId,
        serviceName: ordersTable.serviceName,
        orderCount: count(),
        totalRevenue: sql<string>`COALESCE(SUM(${ordersTable.unitPrice} * ${ordersTable.quantity}), 0)`,
      })
      .from(ordersTable)
      .groupBy(ordersTable.serviceId, ordersTable.serviceName)
      .orderBy(desc(count()))
      .limit(10);

    res.json(
      GetTopServicesResponse.parse(
        rows.map((r) => ({
          serviceId: r.serviceId,
          serviceName: r.serviceName,
          orderCount: r.orderCount,
          totalRevenue: Number(r.totalRevenue),
        })),
      ),
    );
  },
);

router.get(
  "/dashboard/daily-report",
  requireAdmin,
  async (req, res): Promise<void> => {
    const params = GetDailyReportQueryParams.safeParse(req.query);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }
    const dateString =
      params.data.date ?? new Date().toISOString().slice(0, 10);
    const start = new Date(`${dateString}T00:00:00.000Z`);
    const end = new Date(`${dateString}T23:59:59.999Z`);

    const rows = await db
      .select({
        paymentId: paymentsTable.id,
        orderId: paymentsTable.orderId,
        amount: paymentsTable.amount,
        paidAt: paymentsTable.paidAt,
        note: paymentsTable.note,
        customerId: ordersTable.customerId,
        customerName: customersTable.name,
        serviceName: ordersTable.serviceName,
      })
      .from(paymentsTable)
      .leftJoin(ordersTable, eq(paymentsTable.orderId, ordersTable.id))
      .leftJoin(customersTable, eq(ordersTable.customerId, customersTable.id))
      .where(
        and(
          gte(paymentsTable.paidAt, start),
          lte(paymentsTable.paidAt, end),
        ),
      )
      .orderBy(desc(paymentsTable.paidAt));

    const totalCollected = rows.reduce((sum, r) => sum + Number(r.amount), 0);
    const uniqueCustomers = new Set(
      rows.map((r) => r.customerId).filter((id): id is number => id !== null),
    ).size;

    res.json(
      GetDailyReportResponse.parse({
        date: dateString,
        totalCollected: Number(totalCollected.toFixed(2)),
        paymentCount: rows.length,
        uniqueCustomers,
        payments: rows.map((r) => ({
          paymentId: r.paymentId,
          orderId: r.orderId,
          customerName: r.customerName ?? "Unknown",
          serviceName: r.serviceName ?? "Unknown",
          amount: Number(r.amount),
          paidAt: r.paidAt,
          note: r.note,
        })),
      }),
    );
  },
);

router.get(
  "/dashboard/due-today",
  requireAdmin,
  async (_req, res): Promise<void> => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const end = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999,
    );

    const candidates = await db
      .select()
      .from(ordersTable)
      .where(
        and(
          gte(ordersTable.dueDate, start),
          lte(ordersTable.dueDate, end),
          ne(ordersTable.status, "paid"),
          ne(ordersTable.status, "cancelled"),
          ne(ordersTable.status, "cart"),
        ),
      );

    const orderRows = await buildOrderRows(candidates.map((o) => o.id));
    const dueToday = orderRows.filter((o) => o.balance > 0);
    res.json(GetDueTodayResponse.parse(dueToday));
  },
);

router.get(
  "/dashboard/low-stock",
  requireAdmin,
  async (req, res): Promise<void> => {
    const params = GetLowStockQueryParams.safeParse(req.query);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }
    const threshold = params.data.threshold ?? LOW_STOCK_THRESHOLD;

    const rows = await db.select().from(servicesTable);
    const lowStock = rows
      .filter((r) => Number(r.quantity ?? 0) < threshold)
      .map((row) => ({
        id: row.id,
        name: row.name,
        description: row.description,
        category: row.category,
        price: Number(row.price),
        soldOut: row.soldOut,
        trending: row.trending,
        imageUrl: row.imageUrl,
        quantity: Number(row.quantity ?? 0),
        createdAt: row.createdAt,
      }));

    res.json(GetLowStockResponse.parse(lowStock));
    void ListServicesResponse;
  },
);

router.post(
  "/tools/payment-calculator",
  requireAdmin,
  async (req, res): Promise<void> => {
    const parsed = CalculatePaymentBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const { principal, months } = parsed.data;
    const annualRatePercent = parsed.data.annualRatePercent ?? 12;

    // Simple interest: I = P * r * t, where t = months/12
    const totalInterest = principal * (annualRatePercent / 100) * (months / 12);
    const totalPayable = principal + totalInterest;
    const monthlyPayment = totalPayable / months;

    const schedule: { month: number; payment: number; remainingBalance: number }[] = [];
    let remaining = totalPayable;
    for (let m = 1; m <= months; m += 1) {
      remaining = Math.max(0, remaining - monthlyPayment);
      schedule.push({
        month: m,
        payment: Number(monthlyPayment.toFixed(2)),
        remainingBalance: Number(remaining.toFixed(2)),
      });
    }

    res.json(
      CalculatePaymentResponse.parse({
        principal: Number(principal.toFixed(2)),
        months,
        annualRatePercent,
        totalInterest: Number(totalInterest.toFixed(2)),
        totalPayable: Number(totalPayable.toFixed(2)),
        monthlyPayment: Number(monthlyPayment.toFixed(2)),
        schedule,
      }),
    );
  },
);

export default router;
