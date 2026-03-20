import { db, menuItemsTable, adminUsersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import crypto from "crypto";

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "little-village-salt").digest("hex");
}

async function seed() {
  console.log("Seeding database...");

  const existing = await db.select().from(adminUsersTable).where(eq(adminUsersTable.email, "admin@littlevillage.com"));
  if (existing.length === 0) {
    await db.insert(adminUsersTable).values({
      restaurantId: "little-village",
      email: "admin@littlevillage.com",
      passwordHash: hashPassword("admin123"),
    });
    console.log("Admin created: admin@littlevillage.com / admin123");
  } else {
    console.log("Admin already exists");
  }

  const existingMenu = await db.select().from(menuItemsTable).where(eq(menuItemsTable.restaurantId, "little-village"));
  if (existingMenu.length === 0) {
    const menuItems = [
      { name: "Chicken 65", description: "Crispy deep-fried chicken with spicy masala coating", price: "180", category: "Starters", isFeatured: true },
      { name: "Veg Manchurian", description: "Crispy vegetable balls in tangy manchurian sauce", price: "130", category: "Starters", isFeatured: false },
      { name: "Prawn Fry", description: "Fresh prawns marinated and fried with coastal spices", price: "280", category: "Starters", isFeatured: true },
      { name: "Gobi 65", description: "Crispy cauliflower fritters with spiced batter", price: "120", category: "Starters", isFeatured: false },
      { name: "Paneer Butter Masala", description: "Soft paneer in rich creamy tomato butter gravy", price: "220", category: "Main Course", isFeatured: true },
      { name: "Chicken Curry", description: "Traditional Andhra-style spicy chicken curry", price: "250", category: "Main Course", isFeatured: true },
      { name: "Mutton Curry", description: "Slow-cooked mutton in aromatic spice blend", price: "320", category: "Main Course", isFeatured: false },
      { name: "Dal Tadka", description: "Yellow lentils tempered with garlic and cumin", price: "120", category: "Main Course", isFeatured: false },
      { name: "Roti", description: "Soft whole wheat flatbread", price: "15", category: "Breads", isFeatured: false },
      { name: "Butter Naan", description: "Leavened bread baked in tandoor with butter", price: "40", category: "Breads", isFeatured: false },
      { name: "Parotta", description: "Flaky layered flatbread, a South Indian favourite", price: "25", category: "Breads", isFeatured: false },
      { name: "Chicken Biryani", description: "Fragrant basmati rice with tender chicken pieces and saffron", price: "280", category: "Rice & Biryani", isFeatured: true },
      { name: "Veg Biryani", description: "Aromatic rice with mixed vegetables and whole spices", price: "180", category: "Rice & Biryani", isFeatured: false },
      { name: "Mutton Biryani", description: "Classic dum biryani with succulent mutton pieces", price: "350", category: "Rice & Biryani", isFeatured: false },
      { name: "Gulab Jamun", description: "Soft milk solid dumplings soaked in rose-flavored syrup", price: "80", category: "Desserts", isFeatured: false },
      { name: "Kheer", description: "Creamy rice pudding with cardamom and nuts", price: "70", category: "Desserts", isFeatured: false },
      { name: "Sweet Lassi", description: "Chilled yogurt drink sweetened with sugar", price: "60", category: "Beverages", isFeatured: false },
      { name: "Masala Chai", description: "Spiced Indian tea with ginger and cardamom", price: "30", category: "Beverages", isFeatured: false },
      { name: "Fresh Lime Soda", description: "Refreshing lime with soda, salted or sweet", price: "50", category: "Beverages", isFeatured: false },
    ];

    for (const item of menuItems) {
      await db.insert(menuItemsTable).values({
        restaurantId: "little-village",
        ...item,
        isAvailable: true,
      });
    }
    console.log(`Seeded ${menuItems.length} menu items`);
  } else {
    console.log(`Menu already has ${existingMenu.length} items`);
  }

  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
