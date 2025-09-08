const db = require("../config/database");

// Create a new review for a restaurant
exports.createReview = async (reviewData) => {
    const { orderId, restaurantId, restaurantRating, foodRating, deliveryRating, comment } = reviewData;

    const result = await db.run(
        `INSERT INTO reviews 
         (order_id, restaurant_id, restaurantRating, foodRating, deliveryRating, comment) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [orderId, restaurantId, restaurantRating, foodRating, deliveryRating, comment]
    );

    return { id: result.lastID, ...reviewData };
};

// Get reviews for a restaurant
exports.getReviewsByRestaurant = async (restaurantId) => {
    return await db.all(
        `SELECT * FROM reviews WHERE restaurant_id = ? ORDER BY created_at DESC`,
        [restaurantId]
    );
};

// Get review by order (to ensure one review per order)
exports.getReviewByOrderId = async (orderId) => {
    return await db.get(`SELECT * FROM reviews WHERE order_id = ?`, [orderId]);
};
