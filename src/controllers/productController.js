const { db } = require("../db/index");
const { products } = require("../db/schema");
const { orders } = require("../db/schema");
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
        console.error("Error log:", error);
        res.status(500).json({error: "Internal Server Error"});
    }
};

const putProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const idNum = parseInt(id);
        const { name, description, price } = req.body;
        const priceNum = parseFloat(price);
        if (!name || !description || priceNum == null || isNaN(priceNum)) {
            const error = new Error("All fields are required!");
            error.statusCode = 400;
            throw error;
        }
        if (priceNum <= 0) {
            const error = new Error("Price must be greater than 0!");
            error.statusCode = 400;
            throw error;
        }
        const existingProduct = await db
            .select()
            .from(products)
            .where(eq(products.id, id));
        if (existingProduct.length === 0) {
            const error = new Error("Product not found!");
            error.statusCode = 404;
            throw error;
        }
        const updatedProduct = await db
            .update(products)
            .set({ name, description, price: priceNum })
            .where(eq(products.id, idNum))
            .returning();
        const relatedOrders = await db
            .select()
            .from(orders)
            .where(eq(orders.productId, idNum));
        for (const order of relatedOrders) {
            const newTotalPrice = priceNum * order.quantity;
            await db
                .update(orders)
                .set({ totalPrice: newTotalPrice.toFixed(2) })
                .where(eq(orders.id, order.id));
        }
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const idNum = parseInt(id);
        const existingProduct = await db
            .select()
            .from(products)
            .where(eq(products.id, idNum));
        if (existingProduct.length === 0) {
            const error = new Error("Product not found!");
            error.statusCode = 404;
            throw error;
        }
        await db.delete(products).where(eq(products.id, idNum));
        res.status(204).json({message: "Successfully deleted"});
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
};

module.exports = {getProducts, createProduct, putProduct, deleteProduct};