const express = require("express");
const router = express.Router();
const CartController = require("../controllers/cartController");
const authMiddleware = require("../middleware/auth");

// Add item to cart
router.post("/add", authMiddleware, CartController.addToCart);

// Get user's cart
router.get("/", authMiddleware, CartController.getCart);

// Update item quantity
router.put("/update/:itemId", authMiddleware, CartController.updateQuantity);

// Remove item from cart
router.delete("/remove/:itemId", authMiddleware, CartController.removeItem);

// Clear cart
router.delete("/clear", authMiddleware, CartController.clearCart);

module.exports = router;
