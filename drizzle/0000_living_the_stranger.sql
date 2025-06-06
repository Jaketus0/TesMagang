CREATE TABLE "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer,
	"quantity" integer,
	"total_price" numeric(10, 2),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100),
	"description" text,
	"price" numeric(10, 2)
);
--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;