const express = require("express");
const router = express.Router();
const restaurantController = require("../controllers/restaurantController");

// GET /api/restaurants?lat=&lng=&radius=&cuisine=&search=&veg_only=&rating=
router.get("/", restaurantController.getNearbyRestaurants);

// GET /api/restaurants/:id
router.get("/:id", restaurantController.getRestaurantById);

module.exports = router;
