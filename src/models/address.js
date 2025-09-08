const db = require("../config/database");

class Address {
    constructor({ id, user_id, type, addressLine1, addressLine2, city, state, pincode, latitude, longitude }) {
        this.id = id;
        this.user_id = user_id;
        this.type = type;
        this.addressLine1 = addressLine1;
        this.addressLine2 = addressLine2;
        this.city = city;
        this.state = state;
        this.pincode = pincode;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    // Create new address
    static async create(userId, { type, addressLine1, addressLine2, city, state, pincode, latitude, longitude }) {
        const sql = `
            INSERT INTO addresses (user_id, type, addressLine1, addressLine2, city, state, pincode, latitude, longitude)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const result = await db.run(sql, [
            userId,
            type,
            addressLine1,
            addressLine2,
            city,
            state,
            pincode,
            latitude,
            longitude
        ]);

        return new Address({
            id: result.lastID,
            user_id: userId,
            type,
            addressLine1,
            addressLine2,
            city,
            state,
            pincode,
            latitude,
            longitude
        });
    }

    // Get all addresses for a user
    static async findByUserId(userId) {
        const sql = `SELECT * FROM addresses WHERE user_id = ?`;
        const rows = await db.query(sql, [userId]);
        return rows.map(row => new Address(row));
    }

    // Set default address for a user
    static async setDefault(userId, addressId) {
        const sql = `UPDATE users SET default_address_id = ? WHERE id = ?`;
        await db.run(sql, [addressId, userId]);
        return true;
    }

    // Find by ID
    static async findById(id) {
        const sql = `SELECT * FROM addresses WHERE id = ?`;
        const row = await db.get(sql, [id]);
        return row ? new Address(row) : null;
    }

    // Delete an address
    static async delete(id, userId) {
        const sql = `DELETE FROM addresses WHERE id = ? AND user_id = ?`;
        const result = await db.run(sql, [id, userId]);
        return result.changes > 0;
    }
}

module.exports = Address;
