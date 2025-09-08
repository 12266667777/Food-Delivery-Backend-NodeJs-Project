const db = require("../config/database");
const haversine = require("../utils/distance"); // helper to calculate distance between lat/lng

class Restaurant {
    // Find nearby restaurants with filters
    static async findNearby({ lat, lng, radius = 5, cuisine, search, veg_only, rating }) {
        let sql = `
            SELECT r.*, 
                   (SELECT AVG(rv.restaurantRating) 
                    FROM reviews rv 
                    WHERE rv.restaurant_id = r.id) AS avg_rating
            FROM restaurants r
        `;
        const params = [];
        const conditions = [];

        if (cuisine) {
            conditions.push(`r.cuisine LIKE ?`);
            params.push(`%${cuisine}%`);
        }

        if (search) {
            conditions.push(`r.name LIKE ?`);
            params.push(`%${search}%`);
        }

        if (rating) {
            conditions.push(`(
                SELECT AVG(rv.restaurantRating) 
                FROM reviews rv 
                WHERE rv.restaurant_id = r.id
            ) >= ?`);
            params.push(rating);
        }

        if (conditions.length > 0) {
            sql += ` WHERE ` + conditions.join(" AND ");
        }

        const rows = await db.query(sql, params);

        // Post-process: add distance, filter by radius
        const restaurants = rows.map(r => {
            const distance = haversine(lat, lng, r.latitude, r.longitude);
            return {
                id: r.id,
                name: r.name,
                cuisine: r.cuisine ? r.cuisine.split(",") : [],
                rating: r.avg_rating ? Number(r.avg_rating.toFixed(1)) : 0,
                avgDeliveryTime: r.avg_prep_time ? `${r.avg_prep_time} mins` : null,
                minOrder: r.min_order_amount,
                deliveryFee: r.delivery_fee,
                description: r.description,
                isOpen: Restaurant.isOpen(r.opening_hours),
                distance: `${distance.toFixed(1)} km`
            };
        }).filter(r => parseFloat(r.distance) <= radius);

        return restaurants;
    }

    // Get restaurant details + menu
    static async findById(id) {
        const restaurant = await db.get(
            `SELECT r.*, 
                    (SELECT COUNT(*) FROM reviews rv WHERE rv.restaurant_id = r.id) as totalReviews,
                    (SELECT AVG(rv.restaurantRating) FROM reviews rv WHERE rv.restaurant_id = r.id) as avg_rating
             FROM restaurants r
             WHERE r.id = ?`,
            [id]
        );

        if (!restaurant) return null;

        // Get menu grouped by category
        const menuRows = await db.query(
            `SELECT m.id, m.name, m.description, m.price, m.isVeg, m.isAvailable, m.restaurant_id,
                    c.name AS category
             FROM menu_items m
             JOIN menu_categories c ON m.category_id = c.id
             WHERE m.restaurant_id = ?`,
            [id]
        );

        const menu = {};
        menuRows.forEach(item => {
            if (!menu[item.category]) {
                menu[item.category] = [];
            }
            menu[item.category].push({
                id: item.id,
                name: item.name,
                description: item.description,
                price: item.price,
                isVeg: item.isVeg === 1,
                isAvailable: item.isAvailable === 1
            });
        });

        return {
            id: restaurant.id,
            name: restaurant.name,
            cuisine: restaurant.cuisine ? restaurant.cuisine.split(",") : [],
            rating: restaurant.avg_rating ? Number(restaurant.avg_rating.toFixed(1)) : 0,
            totalReviews: restaurant.totalReviews,
            description: restaurant.description,
            address: restaurant.address,
            operatingHours: JSON.parse(restaurant.opening_hours || "{}"),
            menu: Object.keys(menu).map(category => ({
                category,
                items: menu[category]
            }))
        };
    }

    // Helper to check if restaurant is open
    static isOpen(operatingHoursJson) {
        try {
            const hours = JSON.parse(operatingHoursJson || "{}");
            const today = new Date().toLocaleString("en-US", { weekday: "long" }).toLowerCase();
            return !!hours[today]; // simple check (expand later for actual time ranges)
        } catch {
            return false;
        }
    }
}

module.exports = Restaurant;
