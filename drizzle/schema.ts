import { pgTable, serial, varchar, text, numeric, foreignKey, integer, timestamp } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const products = pgTable("products", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 100 }),
	description: text(),
	price: numeric({ precision: 10, scale:  2 }),
});

export const orders = pgTable("orders", {
	id: serial().primaryKey().notNull(),
	productId: integer("product_id"),
	quantity: integer(),
	totalPrice: numeric("total_price", { precision: 10, scale:  2 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.productId],
			foreignColumns: [products.id],
			name: "orders_product_id_products_id_fk"
		}).onDelete("cascade"),
]);
