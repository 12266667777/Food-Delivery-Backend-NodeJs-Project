const Payment = require("../models/payment");
const Order = require("../models/order");

exports.processPayment = async (req, res) => {
    try {
        const { orderId, paymentMethod } = req.body;

        // Check if order exists
        const order = await Order.getOrderById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // For simplicity, assume all payments succeed
        const status = "completed";

        const payment = await Payment.createPayment({
            orderId,
            method: paymentMethod,
            status
        });

        res.json({
            success: true,
            message: "Payment processed successfully",
            payment
        });
    } catch (error) {
        console.error("Error processing payment:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
