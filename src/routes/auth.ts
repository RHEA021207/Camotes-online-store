import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db, adminsTable } from "@workspace/db";
import {
  AdminLoginBody,
  AdminLoginResponse,
  AdminLogoutResponse,
  AdminMeResponse,
  AdminChangePasswordBody,
  AdminChangePasswordResponse,
  CreateAdminBody,
  ListAdminsResponse,
} from "@workspace/api-zod";
import { requireAdmin } from "../lib/auth";

const router: IRouter = Router();

router.post("/auth/login", async (req, res): Promise<void> => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [admin] = await db
    .select()
    .from(adminsTable)
    .where(eq(adminsTable.username, parsed.data.username));

  if (!admin) {
    res.status(401).json({ error: "Invalid username or password" });
    return;
  }

  const ok = await bcrypt.compare(parsed.data.password, admin.passwordHash);
  if (!ok) {
    res.status(401).json({ error: "Invalid username or password" });
    return;
  }

  req.session.adminId = admin.id;
  req.session.adminUsername = admin.username;

  res.json(
    AdminLoginResponse.parse({
      authenticated: true,
      admin: {
        id: admin.id,
        username: admin.username,
        createdAt: admin.createdAt,
      },
    }),
  );
});

router.post("/auth/logout", (req, res): void => {
  req.session.destroy(() => {
    res.json(AdminLogoutResponse.parse({ ok: true }));
  });
});

router.get("/auth/me", async (req, res): Promise<void> => {
  if (!req.session.adminId) {
    res.json(AdminMeResponse.parse({ authenticated: false, admin: null }));
    return;
  }
  const [admin] = await db
    .select()
    .from(adminsTable)
    .where(eq(adminsTable.id, req.session.adminId));

  if (!admin) {
    req.session.destroy(() => {});
    res.json(AdminMeResponse.parse({ authenticated: false, admin: null }));
    return;
  }

  res.json(
    AdminMeResponse.parse({
      authenticated: true,
      admin: {
        id: admin.id,
        username: admin.username,
        createdAt: admin.createdAt,
      },
    }),
  );
});

router.post(
  "/auth/change-password",
  requireAdmin,
  async (req, res): Promise<void> => {
    const parsed = AdminChangePasswordBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }

    const adminId = req.session.adminId!;
    const [admin] = await db
      .select()
      .from(adminsTable)
      .where(eq(adminsTable.id, adminId));

    if (!admin) {
      res.status(404).json({ error: "Admin not found" });
      return;
    }

    const ok = await bcrypt.compare(
      parsed.data.currentPassword,
      admin.passwordHash,
    );
    if (!ok) {
      res.status(401).json({ error: "Current password is incorrect" });
      return;
    }

    const newHash = await bcrypt.hash(parsed.data.newPassword, 10);
    await db
      .update(adminsTable)
      .set({ passwordHash: newHash })
      .where(eq(adminsTable.id, adminId));

    res.json(AdminChangePasswordResponse.parse({ ok: true }));
  },
);

router.get("/auth/admins", requireAdmin, async (_req, res): Promise<void> => {
  const admins = await db.select().from(adminsTable).orderBy(adminsTable.id);
  res.json(
    ListAdminsResponse.parse(
      admins.map((a) => ({
        id: a.id,
        username: a.username,
        createdAt: a.createdAt,
      })),
    ),
  );
});

router.post("/auth/admins", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateAdminBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const existing = await db
    .select()
    .from(adminsTable)
    .where(eq(adminsTable.username, parsed.data.username));

  if (existing.length > 0) {
    res.status(409).json({ error: "Username already exists" });
    return;
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  const [admin] = await db
    .insert(adminsTable)
    .values({
      username: parsed.data.username,
      passwordHash,
    })
    .returning();

  res.status(201).json({
    id: admin.id,
    username: admin.username,
    createdAt: admin.createdAt,
  });
});

export default router;
