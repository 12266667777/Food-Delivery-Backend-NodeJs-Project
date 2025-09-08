const db = require("../config/database");

class Cart {
    // Add item to cart
    static async addItem({ user_id, restaurant_id, item_id, quantity, specialInstructions }) {
        // Check if item already exists in cart
        const existing = await db.get(
            `SELECT * FROM cart WHERE user_id = ? AND item_id = ?`,
            [user_id, item_id]
        );

        if (existing) {
            // Update quantity if already in cart
            return db.run(
                `UPDATE cart 
                 SET quantity = quantity + ?, specialInstructions = ? 
                 WHERE id = ?`,
                [quantity, specialInstructions || existing.specialInstructions, existing.id]
            );
        }

        return db.run(
            `INSERT INTO cart (user_id, restaurant_id, item_id, quantity, specialInstructions)
             VALUES (?, ?, ?, ?, ?)`,
            [user_id, restaurant_id, item_id, quantity, specialInstructions]
        );
    }

    // Get all cart items for a user
    static async getUserCart(user_id) {
        return db.query(
            `SELECT c.id, c.quantity, c.specialInstructions,
                    m.name as itemName, m.price, m.isVeg, 
                    r.name as restaurantName, r.id as restaurantId
             FROM cart c
             JOIN menu_items m ON c.item_id = m.id
             JOIN restaurants r ON c.restaurant_id = r.id
             WHERE c.user_id = ?`,
            [user_id]
        );
    }

    // Update item quantity
    static async updateQuantity(cartId, quantity) {
        return db.run(
            `UPDATE cart SET quantity = ? WHERE id = ?`,
            [quantity, cartId]
        );
    }

    // Remove item from cart
    static async removeItem(cartId) {
        return db.run(
            `DELETE FROM cart WHERE id = ?`,
            [cartId]
        );
    }

    // Clear all items for a user
    static async clearCart(user_id) {
        return db.run(
            `DELETE FROM cart WHERE user_id = ?`,
            [user_id]
        );
    }
}

module.exports = Cart;
