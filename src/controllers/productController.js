const { db } = require("../db/index");
const { products } = require("../db/schema");
const { eq } = require("drizzle-orm");

const getProducts = async (req, res) => {
    try {
        const allProducts = await db.select().from(products);
        if (allProducts.length === 0) {
            const error = new Error("No products found!");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json(allProducts);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const createProduct = async (req, res) => {
    try {
        const { name, description, price } = req.body;
        if (!name || !description || !price || isNaN(price)) {
            const error = new Error("All fields are required!");
            error.statusCode = 400;
            throw error;
        }
        if (price <= 0) {
            const error = new Error("Price must be greater than 0!");
            error.statusCode = 400;
            throw error;
        }
        const existingProduct = await db
            .select()
            .from(products)
            .where(eq(products.name,name));
        if (existingProduct.length > 0) {
            const error = new Error("Product already exists!");
            error.statusCode = 400;
            throw error;
        }
        const newProduct = await db
            .insert(products)
            .values({ name, description, price })
            .returning();
        res.status(201).json(newProduct);
    } catch (error) {
        console.error("Error saat createProduct:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = {
	getProducts,
    createProduct,
};