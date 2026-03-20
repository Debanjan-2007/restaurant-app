import { Router, type IRouter } from "express";
import { db, menuItemsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";

const router: IRouter = Router();

router.get("/menu", async (req, res) => {
  try {
    const { category, restaurantId = "little-village" } = req.query as Record<string, string>;
    let items;
    if (category) {
      items = await db.select().from(menuItemsTable)
        .where(and(eq(menuItemsTable.restaurantId, restaurantId), eq(menuItemsTable.category, category)));
    } else {
      items = await db.select().from(menuItemsTable)
        .where(eq(menuItemsTable.restaurantId, restaurantId));
    }
    res.json(items.map(item => ({
      ...item,
      price: parseFloat(item.price),
    })));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch menu" });
  }
});

router.post("/menu", async (req, res) => {
  try {
    const session = (req as any).session;
    if (!session?.adminRestaurantId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { name, description, price, category, imageUrl, isAvailable = true, isFeatured = false, restaurantId = "little-village" } = req.body;
    if (!name || !price || !category) {
      return res.status(400).json({ error: "name, price, category required" });
    }
    const [item] = await db.insert(menuItemsTable).values({
      restaurantId,
      name,
      description,
      price: String(price),
      category,
      imageUrl,
      isAvailable,
      isFeatured,
    }).returning();
    res.status(201).json({ ...item, price: parseFloat(item.price) });
  } catch (err) {
    res.status(500).json({ error: "Failed to create menu item" });
  }
});

router.put("/menu/:id", async (req, res) => {
  try {
    const session = (req as any).session;
    if (!session?.adminRestaurantId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const id = parseInt(req.params.id);
    const { name, description, price, category, imageUrl, isAvailable, isFeatured } = req.body;
    const updates: Record<string, unknown> = {};
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (price !== undefined) updates.price = String(price);
    if (category !== undefined) updates.category = category;
    if (imageUrl !== undefined) updates.imageUrl = imageUrl;
    if (isAvailable !== undefined) updates.isAvailable = isAvailable;
    if (isFeatured !== undefined) updates.isFeatured = isFeatured;
    const [item] = await db.update(menuItemsTable).set(updates).where(eq(menuItemsTable.id, id)).returning();
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json({ ...item, price: parseFloat(item.price) });
  } catch (err) {
    res.status(500).json({ error: "Failed to update menu item" });
  }
});

router.delete("/menu/:id", async (req, res) => {
  try {
    const session = (req as any).session;
    if (!session?.adminRestaurantId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const id = parseInt(req.params.id);
    const [deleted] = await db.delete(menuItemsTable).where(eq(menuItemsTable.id, id)).returning();
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete menu item" });
  }
});

export default router;
