const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey"; // move to .env in prod

class AuthController {
    // Register user
    static async register(req, res) {
        try {
            const { name, email, password, phone } = req.body;

            if (!name || !email || !password || !phone) {
                return res.status(400).json({ success: false, message: "All fields are required" });
            }

            // Check if user already exists
            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({ success: false, message: "Email already registered" });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create new user
            const newUser = await User.create({
                name,
                email,
                password: hashedPassword,
                phone
            });

            res.status(201).json({
                success: true,
                message: "User registered successfully",
                userId: newUser.id
            });
        } catch (error) {
            console.error("Register error:", error);
            res.status(500).json({ success: false, message: "Server error" });
        }
    }

    // Login user
    static async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ success: false, message: "Email and password required" });
            }

            const user = await User.findByEmail(email);
            if (!user) {
                return res.status(401).json({ success: false, message: "Invalid credentials" });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ success: false, message: "Invalid credentials" });
            }

            const token = jwt.sign(
                { id: user.id, email: user.email },
                JWT_SECRET,
                { expiresIn: "7d" }
            );

            res.json({
                success: true,
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            });
        } catch (error) {
            console.error("Login error:", error);
            res.status(500).json({ success: false, message: "Server error" });
        }
    }
}

module.exports = AuthController;
