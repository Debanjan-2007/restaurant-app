import { Router, type IRouter } from "express";
import { db, ordersTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";

const router: IRouter = Router();

router.get("/orders", async (req, res) => {
  try {
    const session = (req as any).session;
    if (!session?.adminRestaurantId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { restaurantId = "little-village", status } = req.query as Record<string, string>;
    let orders;
    if (status) {
      orders = await db.select().from(ordersTable)
        .where(and(eq(ordersTable.restaurantId, restaurantId), eq(ordersTable.status, status)));
    } else {
      orders = await db.select().from(ordersTable)
        .where(eq(ordersTable.restaurantId, restaurantId));
    }
    res.json(orders.map(o => ({ ...o, totalAmount: parseFloat(o.totalAmount) })));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

router.post("/orders", async (req, res) => {
  try {
    const { restaurantId = "little-village", customerName, customerPhone, customerAddress, items, totalAmount } = req.body;
    if (!customerName || !customerPhone || !customerAddress || !items || totalAmount === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const [order] = await db.insert(ordersTable).values({
      restaurantId,
      customerName,
      customerPhone,
      customerAddress,
      items: typeof items === "string" ? items : JSON.stringify(items),
      totalAmount: String(totalAmount),
      status: "pending",
    }).returning();
    res.status(201).json({ ...order, totalAmount: parseFloat(order.totalAmount) });
  } catch (err) {
    res.status(500).json({ error: "Failed to create order" });
  }
});

router.put("/orders/:id", async (req, res) => {
  try {
    const session = (req as any).session;
    if (!session?.adminRestaurantId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const id = parseInt(req.params.id);
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: "status required" });
    const [order] = await db.update(ordersTable).set({ status }).where(eq(ordersTable.id, id)).returning();
    if (!order) return res.status(404).json({ error: "Not found" });
    res.json({ ...order, totalAmount: parseFloat(order.totalAmount) });
  } catch (err) {
    res.status(500).json({ error: "Failed to update order" });
  }
});

export default router;
