import { Router, type IRouter } from "express";
import { db, adminUsersTable, ordersTable, reservationsTable, menuItemsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import crypto from "crypto";

const router: IRouter = Router();

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "little-village-salt").digest("hex");
}

router.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "email and password required" });
    }
    const [admin] = await db.select().from(adminUsersTable).where(eq(adminUsersTable.email, email));
    if (!admin) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const hashed = hashPassword(password);
    if (admin.passwordHash !== hashed) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const session = (req as any).session;
    session.adminRestaurantId = admin.restaurantId;
    session.adminEmail = admin.email;
    res.json({ success: true, restaurantId: admin.restaurantId, email: admin.email });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

router.get("/admin/me", async (req, res) => {
  const session = (req as any).session;
  if (!session?.adminRestaurantId) {
    return res.json({ authenticated: false });
  }
  res.json({ authenticated: true, restaurantId: session.adminRestaurantId, email: session.adminEmail });
});

router.post("/admin/logout", async (req, res) => {
  (req as any).session.destroy(() => {
    res.json({ success: true, message: "Logged out" });
  });
});

router.get("/stats", async (req, res) => {
  try {
    const session = (req as any).session;
    if (!session?.adminRestaurantId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const restaurantId = (req.query.restaurantId as string) || "little-village";

    const orders = await db.select().from(ordersTable).where(eq(ordersTable.restaurantId, restaurantId));
    const reservations = await db.select().from(reservationsTable).where(eq(reservationsTable.restaurantId, restaurantId));

    const today = new Date().toISOString().split("T")[0];
    const todayReservations = reservations.filter(r => r.date === today).length;
    const pendingOrders = orders.filter(o => o.status === "pending").length;
    const revenueEstimate = orders
      .filter(o => o.status === "delivered")
      .reduce((sum, o) => sum + parseFloat(o.totalAmount), 0);

    const itemCounts: Record<string, number> = {};
    for (const order of orders) {
      try {
        const items = JSON.parse(order.items);
        for (const item of items) {
          const name = item.name || item.itemName || "Unknown";
          itemCounts[name] = (itemCounts[name] || 0) + (item.quantity || 1);
        }
      } catch {}
    }
    const popularItems = Object.entries(itemCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    res.json({
      totalOrders: orders.length,
      totalReservations: reservations.length,
      pendingOrders,
      todayReservations,
      revenueEstimate,
      popularItems,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

export { hashPassword };
export default router;
