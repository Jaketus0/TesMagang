import { relations } from "drizzle-orm/relations";
import { products, orders } from "./schema";

export const ordersRelations = relations(orders, ({one}) => ({
	product: one(products, {
		fields: [orders.productId],
		references: [products.id]
	}),
}));

export const productsRelations = relations(products, ({many}) => ({
	orders: many(orders),
}));