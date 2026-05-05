import { Router, type IRouter } from "express";
import { eq, ilike, or, desc, and } from "drizzle-orm";
import { db, servicesTable } from "@workspace/db";
import {
  ListServicesQueryParams,
  ListServicesResponse,
  CreateServiceBody,
  GetServiceParams,
  GetServiceResponse,
  UpdateServiceParams,
  UpdateServiceBody,
  UpdateServiceResponse,
  DeleteServiceParams,
  DeleteServiceResponse,
  ListTrendingServicesResponse,
} from "@workspace/api-zod";
import { requireAdmin } from "../lib/auth";

const router: IRouter = Router();

function formatService(row: typeof servicesTable.$inferSelect) {
  return {
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
  };
}

router.get("/services", async (req, res): Promise<void> => {
  const params = ListServicesQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const { includeSoldOut = true, search } = params.data;

  const conditions = [];
  if (!includeSoldOut) {
    conditions.push(eq(servicesTable.soldOut, false));
  }
  if (search && search.trim() !== "") {
    const like = `%${search.trim()}%`;
    conditions.push(
      or(
        ilike(servicesTable.name, like),
        ilike(servicesTable.description, like),
        ilike(servicesTable.category, like),
      )!,
    );
  }

  const rows = await db
    .select()
    .from(servicesTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(servicesTable.trending), desc(servicesTable.createdAt));

  res.json(ListServicesResponse.parse(rows.map(formatService)));
});

router.get("/services/trending", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(servicesTable)
    .where(eq(servicesTable.trending, true))
    .orderBy(desc(servicesTable.createdAt));
  res.json(ListTrendingServicesResponse.parse(rows.map(formatService)));
});

router.get("/services/:id", async (req, res): Promise<void> => {
  const params = GetServiceParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [row] = await db
    .select()
    .from(servicesTable)
    .where(eq(servicesTable.id, params.data.id));
  if (!row) {
    res.status(404).json({ error: "Service not found" });
    return;
  }
  res.json(GetServiceResponse.parse(formatService(row)));
});

router.post(
  "/services",
  requireAdmin,
  async (req, res): Promise<void> => {
    const parsed = CreateServiceBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const [row] = await db
      .insert(servicesTable)
      .values({
        name: parsed.data.name,
        description: parsed.data.description,
        category: parsed.data.category,
        price: parsed.data.price.toString(),
        soldOut: parsed.data.soldOut ?? false,
        trending: parsed.data.trending ?? false,
        imageUrl: parsed.data.imageUrl ?? null,
        quantity: (parsed.data.quantity ?? 10).toString(),
      })
      .returning();
    res.status(201).json(GetServiceResponse.parse(formatService(row)));
  },
);

router.patch(
  "/services/:id",
  requireAdmin,
  async (req, res): Promise<void> => {
    const params = UpdateServiceParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }
    const parsed = UpdateServiceBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const updates: Partial<typeof servicesTable.$inferInsert> = {};
    if (parsed.data.name !== undefined) updates.name = parsed.data.name;
    if (parsed.data.description !== undefined)
      updates.description = parsed.data.description;
    if (parsed.data.category !== undefined)
      updates.category = parsed.data.category;
    if (parsed.data.price !== undefined)
      updates.price = parsed.data.price.toString();
    if (parsed.data.soldOut !== undefined)
      updates.soldOut = parsed.data.soldOut;
    if (parsed.data.trending !== undefined)
      updates.trending = parsed.data.trending;
    if (parsed.data.imageUrl !== undefined)
      updates.imageUrl = parsed.data.imageUrl;
    if (parsed.data.quantity !== undefined)
      updates.quantity = parsed.data.quantity.toString();

    const [row] = await db
      .update(servicesTable)
      .set(updates)
      .where(eq(servicesTable.id, params.data.id))
      .returning();
    if (!row) {
      res.status(404).json({ error: "Service not found" });
      return;
    }
    res.json(UpdateServiceResponse.parse(formatService(row)));
  },
);

router.delete(
  "/services/:id",
  requireAdmin,
  async (req, res): Promise<void> => {
    const params = DeleteServiceParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }
    const [row] = await db
      .delete(servicesTable)
      .where(eq(servicesTable.id, params.data.id))
      .returning();
    if (!row) {
      res.status(404).json({ error: "Service not found" });
      return;
    }
    res.json(DeleteServiceResponse.parse({ ok: true }));
  },
);

export default router;
