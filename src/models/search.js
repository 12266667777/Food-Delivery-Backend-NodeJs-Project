const db = require("../config/database");

class Search {
    // Search restaurants & dishes
    static async globalSearch({ query, lat, lng }) {
        const restaurants = await db.query(
            `SELECT id, name, cuisine, address, rating, latitude, longitude
             FROM restaurants
             WHERE name LIKE ? OR cuisine LIKE ?`,
            [`%${query}%`, `%${query}%`]
        );

        const dishes = await db.query(
            `SELECT m.id AS itemId, m.name, m.price,
                    r.name AS restaurantName,
                    r.rating
             FROM menu_items m
             JOIN restaurants r ON m.restaurant_id = r.id
             WHERE m.name LIKE ?`,
            [`%${query}%`]
        );

        return { restaurants, dishes };
    }
}

module.exports = Search;
