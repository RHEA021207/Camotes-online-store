import bcrypt from "bcryptjs";
import {
  db,
  adminsTable,
  servicesTable,
  customersTable,
  ordersTable,
  paymentsTable,
} from "@workspace/db";

async function main() {
  const adminCount = await db.select().from(adminsTable);
  if (adminCount.length === 0) {
    const hash = await bcrypt.hash("admin123", 10);
    await db.insert(adminsTable).values({
      username: "admin",
      passwordHash: hash,
    });
    console.log("Seeded default admin: username=admin, password=admin123");
  }

  const svcCount = await db.select().from(servicesTable);
  if (svcCount.length === 0) {
    await db.insert(servicesTable).values([
      {
        name: "Single-Origin Coffee Beans (1kg)",
        description:
          "Freshly roasted Camotes-island grown arabica. Smooth body, citrus finish.",
        category: "Coffee",
        price: "650.00",
        soldOut: false,
        trending: true,
      },
      {
        name: "Handwoven Banig Mat",
        description:
          "Traditional pandan mat woven by local artisans. Available in three colors.",
        category: "Crafts",
        price: "1200.00",
        soldOut: false,
        trending: true,
      },
      {
        name: "Sun-Dried Mango Pack",
        description: "Sweet, chewy dried mango slices, packed in 500g pouches.",
        category: "Snacks",
        price: "320.00",
        soldOut: false,
        trending: false,
      },
      {
        name: "Coconut Vinegar (500ml)",
        description: "Naturally fermented from local coconut sap.",
        category: "Pantry",
        price: "180.00",
        soldOut: false,
        trending: true,
      },
      {
        name: "Island Tour Package",
        description:
          "Full-day boat tour of Camotes Islands with lunch included.",
        category: "Experiences",
        price: "2500.00",
        soldOut: false,
        trending: false,
      },
      {
        name: "Bamboo Lantern Set",
        description: "Hand-carved bamboo lanterns, set of 3.",
        category: "Crafts",
        price: "950.00",
        soldOut: true,
        trending: false,
      },
    ]);
    console.log("Seeded services");
  }

  const custCount = await db.select().from(customersTable);
  if (custCount.length === 0) {
    const inserted = await db
      .insert(customersTable)
      .values([
        {
          name: "Maria Santos",
          phone: "0917-555-1010",
          email: "maria.santos@example.com",
          notes: "Regular customer, prefers SMS reminders.",
        },
        {
          name: "Juan Dela Cruz",
          phone: "0918-555-2020",
          email: null,
          notes: null,
        },
        {
          name: "Anna Reyes",
          phone: "0920-555-3030",
          email: "anna.r@example.com",
          notes: "Pays in installments.",
        },
        {
          name: "Pedro Mercado",
          phone: "0905-555-4040",
          email: null,
          notes: "New customer.",
        },
      ])
      .returning();

    const services = await db.select().from(servicesTable);

    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;

    const orders = await db
      .insert(ordersTable)
      .values([
        {
          customerId: inserted[0].id,
          serviceId: services[1]?.id ?? null,
          serviceName: services[1]?.name ?? "Handwoven Banig Mat",
          quantity: 1,
          unitPrice: services[1]?.price ?? "1200.00",
          status: "active",
          dueDate: new Date(now + 7 * day),
          notes: "First installment due next week",
        },
        {
          customerId: inserted[0].id,
          serviceId: services[3]?.id ?? null,
          serviceName: services[3]?.name ?? "Coconut Vinegar (500ml)",
          quantity: 2,
          unitPrice: services[3]?.price ?? "180.00",
          status: "paid",
          dueDate: new Date(now - 30 * day),
          notes: null,
        },
        {
          customerId: inserted[1].id,
          serviceId: services[4]?.id ?? null,
          serviceName: services[4]?.name ?? "Island Tour Package",
          quantity: 1,
          unitPrice: services[4]?.price ?? "2500.00",
          status: "active",
          dueDate: new Date(now - 3 * day),
          notes: "Overdue by a few days",
        },
        {
          customerId: inserted[2].id,
          serviceId: services[0]?.id ?? null,
          serviceName: services[0]?.name ?? "Single-Origin Coffee Beans (1kg)",
          quantity: 3,
          unitPrice: services[0]?.price ?? "650.00",
          status: "active",
          dueDate: new Date(now + 14 * day),
          notes: "Three-month installment plan",
        },
        {
          customerId: inserted[3].id,
          serviceId: services[2]?.id ?? null,
          serviceName: services[2]?.name ?? "Sun-Dried Mango Pack",
          quantity: 5,
          unitPrice: services[2]?.price ?? "320.00",
          status: "cart",
          dueDate: null,
          notes: "Customer browsing — not yet committed",
        },
        {
          customerId: inserted[2].id,
          serviceId: services[3]?.id ?? null,
          serviceName: services[3]?.name ?? "Coconut Vinegar (500ml)",
          quantity: 1,
          unitPrice: services[3]?.price ?? "180.00",
          status: "pending",
          dueDate: new Date(now + 30 * day),
          notes: null,
        },
      ])
      .returning();

    await db.insert(paymentsTable).values([
      {
        orderId: orders[0].id,
        amount: "400.00",
        note: "Down payment",
        paidAt: new Date(now - 14 * day),
      },
      {
        orderId: orders[1].id,
        amount: "360.00",
        note: "Paid in full",
        paidAt: new Date(now - 25 * day),
      },
      {
        orderId: orders[2].id,
        amount: "1000.00",
        note: "Partial payment",
        paidAt: new Date(now - 10 * day),
      },
      {
        orderId: orders[3].id,
        amount: "500.00",
        note: "First installment",
        paidAt: new Date(now - 5 * day),
      },
      {
        orderId: orders[3].id,
        amount: "500.00",
        note: "Second installment",
        paidAt: new Date(now - 1 * day),
      },
    ]);
    console.log("Seeded customers, orders, payments");
  }

  console.log("Seed complete");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
