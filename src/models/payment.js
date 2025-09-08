const db = require("../config/database");

// Create a new payment record
exports.createPayment = async (paymentData) => {
    const { orderId, method, status } = paymentData;

    const result = await db.run(
        `INSERT INTO payments (order_id, method, status) VALUES (?, ?, ?)`,
        [orderId, method, status]
    );

    return { id: result.lastID, ...paymentData };
};

// Get payment details by orderId
exports.getPaymentByOrderId = async (orderId) => {
    return await db.get(`SELECT * FROM payments WHERE order_id = ?`, [orderId]);
};
