import { Router, type IRouter } from "express";
import { db, reservationsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/reservations", async (req, res) => {
  try {
    const session = (req as any).session;
    if (!session?.adminRestaurantId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { restaurantId = "little-village" } = req.query as Record<string, string>;
    const reservations = await db.select().from(reservationsTable)
      .where(eq(reservationsTable.restaurantId, restaurantId));
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reservations" });
  }
});

router.post("/reservations", async (req, res) => {
  try {
    const { restaurantId = "little-village", customerName, customerPhone, date, time, guests, notes } = req.body;
    if (!customerName || !customerPhone || !date || !time || !guests) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const [reservation] = await db.insert(reservationsTable).values({
      restaurantId,
      customerName,
      customerPhone,
      date,
      time,
      guests: parseInt(guests),
      notes,
      status: "pending",
    }).returning();
    res.status(201).json(reservation);
  } catch (err) {
    res.status(500).json({ error: "Failed to create reservation" });
  }
});

router.put("/reservations/:id", async (req, res) => {
  try {
    const session = (req as any).session;
    if (!session?.adminRestaurantId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const id = parseInt(req.params.id);
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: "status required" });
    const [reservation] = await db.update(reservationsTable).set({ status }).where(eq(reservationsTable.id, id)).returning();
    if (!reservation) return res.status(404).json({ error: "Not found" });
    res.json(reservation);
  } catch (err) {
    res.status(500).json({ error: "Failed to update reservation" });
  }
});

export default router;
