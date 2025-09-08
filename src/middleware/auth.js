const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }

        const token = authHeader.split(" ")[1]; // Expecting "Bearer <token>"
        if (!token) {
            return res.status(401).json({ success: false, message: "Invalid token format" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecretkey");

        req.user = {
            id: decoded.id,
            email: decoded.email,
            name: decoded.name
        };

        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error);
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
};

module.exports = authMiddleware;
