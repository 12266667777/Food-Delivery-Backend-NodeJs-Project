const Order = require("../models/order");
const db = require("../config/database");

// Place Order
exports.createOrder = async (req, res) => {
    try {
        const { addressId, paymentMethod, specialInstructions } = req.body;
        const userId = req.user.id;

        // Fetch cart items
        const cartItems = await db.all("SELECT * FROM cart WHERE user_id = ?", [userId]);
        if (!cartItems.length) {
            return res.status(400).json({ success: false, message: "Cart is empty" });
        }

        // Calculate total
        let totalAmount = 0;
        let restaurantId = null;
        for (let item of cartItems) {
            const menuItem = await db.get("SELECT * FROM menu_items WHERE id = ?", [item.item_id]);
            totalAmount += menuItem.price * item.quantity;
            restaurantId = item.restaurant_id;
        }

        // Create order
        const orderId = await Order.create({
            user_id: userId,
            restaurant_id: restaurantId,
            address_id: addressId,
            status: "confirmed",
            total_amount: totalAmount,
            delivery_fee: 30, // Example flat fee
            payment_method: paymentMethod,
            specialInstructions
        });

        // Clear cart
        await db.run("DELETE FROM cart WHERE user_id = ?", [userId]);

        res.json({
            success: true,
            orderId,
            totalAmount,
            estimatedDeliveryTime: "35-40 minutes",
            status: "confirmed"
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Get user orders
exports.getOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await Order.findByUser(userId);
        res.json({ success: true, orders });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        res.json({ success: true, order });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        if (order.status === "delivered") {
            return res.status(400).json({ success: false, message: "Cannot cancel delivered order" });
        }

        await Order.updateStatus(orderId, "cancelled");
        res.json({ success: true, message: "Order cancelled successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
