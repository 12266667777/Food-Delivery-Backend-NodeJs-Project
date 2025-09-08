const Cart = require("../models/cart");
const db = require("../config/database");

class CartController {
    // Add item to cart
    static async addToCart(req, res) {
        try {
            const user_id = req.user.id;
            const { restaurantId, itemId, quantity, specialInstructions } = req.body;

            if (!restaurantId || !itemId || !quantity) {
                return res.status(400).json({ success: false, message: "Missing required fields" });
            }

            await Cart.addItem({
                user_id,
                restaurant_id: restaurantId,
                item_id: itemId,
                quantity,
                specialInstructions
            });

            // Calculate total cart value
            const cartItems = await Cart.getUserCart(user_id);
            const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
            const itemCount = cartItems.length;

            res.json({
                success: true,
                message: "Item added to cart",
                cartTotal,
                itemCount
            });
        } catch (err) {
            console.error("Add to cart error:", err);
            res.status(500).json({ success: false, message: "Server error" });
        }
    }

    // Get user's cart
    static async getCart(req, res) {
        try {
            const user_id = req.user.id;
            const cartItems = await Cart.getUserCart(user_id);

            const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

            res.json({
                success: true,
                cartTotal,
                items: cartItems
            });
        } catch (err) {
            console.error("Get cart error:", err);
            res.status(500).json({ success: false, message: "Server error" });
        }
    }

    // Update quantity
    static async updateQuantity(req, res) {
        try {
            const { itemId } = req.params;
            const { quantity } = req.body;

            if (!quantity || quantity <= 0) {
                return res.status(400).json({ success: false, message: "Invalid quantity" });
            }

            await Cart.updateQuantity(itemId, quantity);

            res.json({ success: true, message: "Cart updated successfully" });
        } catch (err) {
            console.error("Update cart error:", err);
            res.status(500).json({ success: false, message: "Server error" });
        }
    }

    // Remove item
    static async removeItem(req, res) {
        try {
            const { itemId } = req.params;

            await Cart.removeItem(itemId);

            res.json({ success: true, message: "Item removed from cart" });
        } catch (err) {
            console.error("Remove item error:", err);
            res.status(500).json({ success: false, message: "Server error" });
        }
    }

    // Clear cart
    static async clearCart(req, res) {
        try {
            const user_id = req.user.id;

            await Cart.clearCart(user_id);

            res.json({ success: true, message: "Cart cleared successfully" });
        } catch (err) {
            console.error("Clear cart error:", err);
            res.status(500).json({ success: false, message: "Server error" });
        }
    }
}

module.exports = CartController;
