const Review = require("../models/review");
const Order = require("../models/order");

exports.addReview = async (req, res) => {
    try {
        const userId = req.user.id; // from auth middleware
        const { orderId, restaurantRating, foodRating, deliveryRating, comment } = req.body;

        // Check order
        const order = await Order.getOrderById(orderId);
        if (!order || order.user_id !== userId) {
            return res.status(403).json({ success: false, message: "Invalid order" });
        }

        // Prevent duplicate reviews
        const existingReview = await Review.getReviewByOrderId(orderId);
        if (existingReview) {
            return res.status(400).json({ success: false, message: "Review already submitted for this order" });
        }

        const review = await Review.createReview({
            orderId,
            restaurantId: order.restaurant_id,
            restaurantRating,
            foodRating,
            deliveryRating,
            comment
        });

        res.json({
            success: true,
            message: "Review added successfully",
            review
        });
    } catch (error) {
        console.error("Error adding review:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.getRestaurantReviews = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        const reviews = await Review.getReviewsByRestaurant(restaurantId);

        res.json({
            success: true,
            count: reviews.length,
            reviews
        });
    } catch (error) {
        console.error("Error fetching reviews:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
