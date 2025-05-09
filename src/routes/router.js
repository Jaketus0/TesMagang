const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const ordersController = require("../controllers/ordersController");

router.get("/products", productController.getProducts);
router.post("/products", productController.createProduct);
router.put("/products/:id", productController.putProduct);
router.delete("/products/:id", productController.deleteProduct);
router.get("/orders", ordersController.getOrders);
router.post("/orders", ordersController.createOrder)

module.exports = router;