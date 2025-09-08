const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth");
const orderController = require("../controllers/orderController");

// Order APIs
router.post("/create", authenticateToken, orderController.createOrder);
router.get("/", authenticateToken, orderController.getOrders);
router.get("/:orderId", authenticateToken, orderController.getOrderById);
router.post("/:orderId/cancel", authenticateToken, orderController.cancelOrder);

module.exports = router;
