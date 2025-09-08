const db = require("../config/database");

class RestaurantManagement {
    static async registerRestaurant({ name, cuisine, description, address, latitude, longitude, min_order_amount, delivery_fee, avg_prep_time }) {
        const result = await db.run(
            `INSERT INTO restaurants (name, cuisine, description, address, latitude, longitude, min_order_amount, delivery_fee, avg_prep_time, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'open')`,
            [name, cuisine, description, address, latitude, longitude, min_order_amount, delivery_fee, avg_prep_time]
        );
        return { id: result.lastID, name };
    }

    static async addMenuItem({ category_id, restaurant_id, name, description, price, isVeg, isAvailable }) {
        const result = await db.run(
            `INSERT INTO menu_items (category_id, restaurant_id, name, description, price, isVeg, isAvailable)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [category_id, restaurant_id, name, description, price, isVeg ? 1 : 0, isAvailable ? 1 : 0]
        );
        return { id: result.lastID, name };
    }

    static async updateMenuItem(itemId, fields) {
        const updates = Object.keys(fields).map(k => `${k} = ?`).join(", ");
        const values = Object.values(fields);
        values.push(itemId);

        await db.run(`UPDATE menu_items SET ${updates} WHERE id = ?`, values);
        return true;
    }

    static async updateRestaurantStatus(restaurantId, status) {
        await db.run(`UPDATE restaurants SET status = ? WHERE id = ?`, [status, restaurantId]);
        return true;
    }

    static async getRestaurantOrders(restaurantId) {
        return db.query(
            `SELECT o.id, o.status, o.total_amount, o.created_at,
                    u.name AS customerName
             FROM orders o
             JOIN users u ON o.user_id = u.id
             WHERE o.restaurant_id = ? ORDER BY o.created_at DESC`,
            [restaurantId]
        );
    }

    static async updateOrderStatus(orderId, status) {
        await db.run(`UPDATE orders SET status = ? WHERE id = ?`, [status, orderId]);
        return true;
    }
}

module.exports = RestaurantManagement;
