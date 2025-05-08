const { db } = require("./index.js");
const { products, orders } = require("./schema.js");
async function seed() {
    try {
        console.log("🌱 Mulai proses seeding...");

        // Insert ke tabel products
        const insertedProducts = await db.insert(products).values([
                {
                    name: "Mechanical Keyboard",
                    description: "RGB backlit keyboard with blue switches",
                    price: "89.99",
                },
                {
                    name: "Gaming Mouse",
                    description: "High DPI mouse for competitive gaming",
                    price: "59.99",
                },
            ])
            .returning();

        console.log("✅ Products berhasil dimasukkan:", insertedProducts);

        // Insert ke tabel orders (gunakan ID dari insertedProducts)
        await db.insert(orders).values([
            {
                productId: insertedProducts[0].id,
                quantity: 2,
                totalPrice: "179.98",
            },
            {
                productId: insertedProducts[1].id,
                quantity: 1,
                totalPrice: "59.99",
            },
        ]);

        console.log("✅ Orders berhasil dimasukkan");
        process.exit(0);
    } catch (err) {
        console.error("❌ Gagal seeding:", err.message);
        process.exit(1);
    }
}

seed();
