const { pgTable, serial, varchar, text, decimal, integer, timestamp } = require("drizzle-orm/pg-core");

// Table: products
const products = pgTable("products", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }),
    description: text("description"),
    price: decimal("price", { precision: 10, scale: 2 }),
});

// Table: orders
const orders = pgTable("orders", {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
        .references(() => products.id, { onDelete: "cascade" }),
    quantity: integer("quantity"),
    totalPrice: decimal("total_price", { precision: 10, scale: 2 }),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
});

module.exports = { products, orders };
