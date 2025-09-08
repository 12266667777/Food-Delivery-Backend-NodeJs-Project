// src/models/user.js
const db = require('../config/database');

class User {
    constructor({ id, name, email, password, phone, default_address_id }) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.default_address_id = default_address_id;
    }

    // Create a new user
    static async create({ name, email, password, phone }) {
        const sql = `
            INSERT INTO users (name, email, password, phone)
            VALUES (?, ?, ?, ?)
        `;
        const result = await db.run(sql, [name, email, password, phone]);
        return new User({
            id: result.lastID,
            name,
            email,
            password,
            phone,
            default_address_id: null
        });
    }

    // Find user by email
    static async findByEmail(email) {
        const sql = `SELECT * FROM users WHERE email = ?`;
        const row = await db.get(sql, [email]);
        return row ? new User(row) : null;
    }

    // Find user by ID
    static async findById(id) {
        const sql = `SELECT * FROM users WHERE id = ?`;
        const row = await db.get(sql, [id]);
        return row ? new User(row) : null;
    }

    // Update user info (name, phone, password optional)
    static async update(id, { name, phone, password, default_address_id }) {
        const fields = [];
        const values = [];

        if (name !== undefined) {
            fields.push("name = ?");
            values.push(name);
        }
        if (phone !== undefined) {
            fields.push("phone = ?");
            values.push(phone);
        }
        if (password !== undefined) {
            fields.push("password = ?");
            values.push(password);
        }
        if (default_address_id !== undefined) {
            fields.push("default_address_id = ?");
            values.push(default_address_id);
        }

        if (fields.length === 0) return null; // nothing to update

        values.push(id);

        const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
        await db.run(sql, values);

        return await User.findById(id);
    }

    // Delete user
    static async delete(id) {
        const sql = `DELETE FROM users WHERE id = ?`;
        const result = await db.run(sql, [id]);
        return result.changes > 0;
    }

    // Get all users (for admin/debug)
    static async all() {
        const sql = `SELECT * FROM users`;
        const rows = await db.query(sql);
        return rows.map(row => new User(row));
    }
}

module.exports = User;
