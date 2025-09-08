const db = require("../config/database");

const Order = {
    // Create new order
    async create(orderData) {
        const {
            user_id,
            restaurant_id,
            address_id,
            status,
            total_amount,
            delivery_fee,
            payment_method,
            specialInstructions
        } = orderData;

        const result = await db.run(
            `INSERT INTO orders 
            (user_id, restaurant_id, address_id, status, total_amount, delivery_fee, payment_method, specialInstructions) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [user_id, restaurant_id, address_id, status, total_amount, delivery_fee, payment_method, specialInstructions]
        );
        return result.lastID;
    },

    // Fetch order by ID
    async findById(orderId) {
        return await db.get("SELECT * FROM orders WHERE id = ?", [orderId]);
    },

    // Fetch orders by user
    async findByUser(userId) {
        return await db.all("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC", [userId]);
    },

    // Update order status
    async updateStatus(orderId, status) {
        return await db.run("UPDATE orders SET status = ? WHERE id = ?", [status, orderId]);
    }
};

module.exports = Order;
