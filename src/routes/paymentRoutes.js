const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const authMiddleware = require("../middleware/auth");

// Process payment
router.post("/process", authMiddleware, paymentController.processPayment);

module.exports = router;
