const Restaurant = require("../models/restaurant");

exports.getNearbyRestaurants = async (req, res) => {
    try {
        const { lat, lng, radius, cuisine, search, veg_only, rating } = req.query;

        if (!lat || !lng) {
            return res.status(400).json({
                success: false,
                message: "Latitude and longitude are required"
            });
        }

        const restaurants = await Restaurant.findNearby({
            lat: parseFloat(lat),
            lng: parseFloat(lng),
            radius: radius ? parseFloat(radius) : 5,
            cuisine,
            search,
            veg_only: veg_only === "true",
            rating: rating ? parseFloat(rating) : null
        });

        res.json({
            success: true,
            count: restaurants.length,
            restaurants
        });
    } catch (err) {
        console.error("Error fetching nearby restaurants:", err);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

exports.getRestaurantById = async (req, res) => {
    try {
        const { id } = req.params;
        const restaurant = await Restaurant.findById(id);

        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found"
            });
        }

        res.json({
            success: true,
            restaurant
        });
    } catch (err) {
        console.error("Error fetching restaurant details:", err);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};
