const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const authMiddleware = require("../middleware/auth");

// Add restaurant review
router.post("/restaurant", authMiddleware, reviewController.addReview);

// Get reviews for a restaurant
router.get("/restaurant/:restaurantId", reviewController.getRestaurantReviews);

module.exports = router;
