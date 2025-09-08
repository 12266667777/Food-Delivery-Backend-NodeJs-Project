const express = require("express");
const router = express.Router();
const controller = require("../controllers/resmanController");
const authMiddleware = require("../middleware/auth");

// Restaurant registration
router.post("/register", controller.registerRestaurant);

// Menu management
router.post("/menu/items", authMiddleware, controller.addMenuItem);
router.put("/menu/items/:id", authMiddleware, controller.updateMenuItem);

// Restaurant status
router.put("/status", authMiddleware, controller.updateRestaurantStatus);

// Restaurant orders
router.get("/orders", authMiddleware, controller.getRestaurantOrders);
router.put("/orders/:orderId/status", authMiddleware, controller.updateOrderStatus);

module.exports = router;
