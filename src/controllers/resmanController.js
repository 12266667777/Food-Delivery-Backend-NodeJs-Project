const RestaurantManagement = require("../models/manaagementanagement");

exports.registerRestaurant = async (req, res) => {
    try {
        const data = req.body;
        const restaurant = await RestaurantManagement.registerRestaurant(data);
        res.json({ success: true, restaurant });
    } catch (error) {
        console.error("Error registering restaurant:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.addMenuItem = async (req, res) => {
    try {
        const data = req.body;
        const menuItem = await RestaurantManagement.addMenuItem(data);
        res.json({ success: true, menuItem });
    } catch (error) {
        console.error("Error adding menu item:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.updateMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        await RestaurantManagement.updateMenuItem(id, req.body);
        res.json({ success: true, message: "Menu item updated" });
    } catch (error) {
        console.error("Error updating menu item:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.updateRestaurantStatus = async (req, res) => {
    try {
        const { restaurantId, status } = req.body;
        await RestaurantManagement.updateRestaurantStatus(restaurantId, status);
        res.json({ success: true, message: "Restaurant status updated" });
    } catch (error) {
        console.error("Error updating status:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.getRestaurantOrders = async (req, res) => {
    try {
        const restaurantId = req.user.id; // from restaurant auth
        const orders = await RestaurantManagement.getRestaurantOrders(restaurantId);
        res.json({ success: true, orders });
    } catch (error) {
        console.error("Error fetching orders:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        await RestaurantManagement.updateOrderStatus(orderId, status);
        res.json({ success: true, message: "Order status updated" });
    } catch (error) {
        console.error("Error updating order status:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
