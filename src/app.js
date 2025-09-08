const express = require("express");
const bodyParser = require("body-parser");
const database = require("./config/database");

const authRoutes = require("./routes/authRoutes");
const addressRoutes = require("./routes/addressRoutes")
const restaurantRoutes=require("./routes/restaurantRoutes")
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes=require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const searchRoutes = require("./routes/searchRoute");
const restaurantManagementRoutes = require("./routes/resmanRoutes");



const app = express();

// Middleware
app.use(bodyParser.json());

// Connect DB and init schema if needed
(async () => {
    await database.connect();
})();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/addresses", addressRoutes)
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders",orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/restaurant", restaurantManagementRoutes);

app.get("/", (req, res) => {
    res.send("Food Delivery Backend is running 🚀");
});

app.listen(3000, () => {
  console.log("Server running on port 3000")
})

module.exports = app;
