import { eq, sum, inArray } from "drizzle-orm";
import {
  db,
  ordersTable,
  paymentsTable,
  customersTable,
} from "@workspace/db";

export const PENALTY_RATE = 0.02;

export interface OrderRow {
  id: number;
  customerId: number;
  customerName: string;
  serviceId: number | null;
  serviceName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  discountPercent: number;
  voucherCode: string | null;
  discountAmount: number;
  penaltyAmount: number;
  paidAmount: number;
  balance: number;
  isOverdue: boolean;
  status: string;
  dueDate: Date | null;
  notes: string | null;
  createdAt: Date;
}

const round2 = (n: number): number => Math.round(n * 100) / 100;

export async function buildOrderRows(orderIds: number[]): Promise<OrderRow[]> {
  if (orderIds.length === 0) return [];

  const orders = await db
    .select({
      order: ordersTable,
      customerName: customersTable.name,
    })
    .from(ordersTable)
    .leftJoin(customersTable, eq(ordersTable.customerId, customersTable.id))
    .where(inArray(ordersTable.id, orderIds));

  const paymentTotals = await db
    .select({
      orderId: paymentsTable.orderId,
      total: sum(paymentsTable.amount).as("total"),
    })
    .from(paymentsTable)
    .where(inArray(paymentsTable.orderId, orderIds))
    .groupBy(paymentsTable.orderId);

  const paidByOrder = new Map<number, number>();
  for (const p of paymentTotals) {
    paidByOrder.set(p.orderId, Number(p.total ?? 0));
  }

  const now = new Date();

  return orders.map(({ order, customerName }) => {
    const unitPrice = Number(order.unitPrice);
    const grossTotal = unitPrice * order.quantity;
    const discountPercent = Number(order.discountPercent ?? 0);
    const discountAmount = round2(grossTotal * (discountPercent / 100));
    const totalAmount = round2(grossTotal - discountAmount);
    const paidAmount = paidByOrder.get(order.id) ?? 0;

    const principalRemaining = Math.max(0, totalAmount - paidAmount);
    const isOverdue =
      !!order.dueDate &&
      order.dueDate.getTime() < now.getTime() &&
      principalRemaining > 0 &&
      order.status !== "paid" &&
      order.status !== "cancelled" &&
      order.status !== "cart";
    const penaltyAmount = isOverdue ? round2(principalRemaining * PENALTY_RATE) : 0;
    const balance = round2(principalRemaining + penaltyAmount);

    return {
      id: order.id,
      customerId: order.customerId,
      customerName: customerName ?? "Unknown",
      serviceId: order.serviceId,
      serviceName: order.serviceName,
      quantity: order.quantity,
      unitPrice,
      totalAmount,
      discountPercent,
      voucherCode: order.voucherCode,
      discountAmount,
      penaltyAmount,
      paidAmount,
      balance,
      isOverdue,
      status: order.status,
      dueDate: order.dueDate,
      notes: order.notes,
      createdAt: order.createdAt,
    };
  });
}

export async function buildOrderRow(orderId: number): Promise<OrderRow | null> {
  const rows = await buildOrderRows([orderId]);
  return rows[0] ?? null;
}

export const VOUCHERS: Record<string, number> = {
  CAMOTE20: 20,
};

export function lookupVoucher(code: string | null | undefined): number {
  if (!code) return 0;
  const key = code.trim().toUpperCase();
  return VOUCHERS[key] ?? 0;
}
