const Search = require("../models/search");

exports.globalSearch = async (req, res) => {
    try {
        const { query, lat, lng } = req.query;
        if (!query) {
            return res.status(400).json({ success: false, message: "Query parameter is required" });
        }

        const result = await Search.globalSearch({ query, lat, lng });

        res.json({ success: true, ...result });
    } catch (error) {
        console.error("Search error:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
