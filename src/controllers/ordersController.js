const { db } = require("../db/index");
const { products } = require("../db/schema");
const { orders } = require("../db/schema");
const { eq } = require("drizzle-orm");

const getOrders = async (req, res) => {
    try{
        const allOrders = await db.select().from(orders);
        if (allOrders.length === 0) {
            const error = new Error("No orders found!");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json(allOrders);
    } catch (error){
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const createOrder = async (req, res) => {
    try{
        const {productId, quantity} = req.body;
        if (!productId || !quantity || isNaN(productId) || isNaN(quantity)) {
            const error = new Error("All fields are required!");
            error.statusCode = 400;
            throw error;
        }
        if (quantity <= 0) {
            const error = new Error("Quantity must be greater than 0!");
            error.statusCode = 400;
            throw error;
        }
        if (productId == null || productId == undefined) {
            const error = new Error("ProductId cannot be null or undefined!");
            error.statusCode = 400;
            throw error;
        }
        const product = await db
            .select()
            .from(products)
            .where(eq(products.id, productId))
            .limit(1);
        if (product.length === 0) {
            const error = new Error("Product not found!");
            error.statusCode = 404;
            throw error;
        }
        const productPrice = parseFloat(product[0].price);
        const totalPrice = productPrice * quantity;
        const newOrder = await db
            .insert(orders)
            .values({productId, quantity, totalPrice: totalPrice.toFixed(2)})
            .returning();
        res.status(201).json(newOrder);
    }catch{
        console.error("Error log:", error);
        res.status(500).json({error: "Internal Server Error"});
    }
}

module.exports ={getOrders, createOrder}