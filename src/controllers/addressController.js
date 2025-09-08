const Address = require("../models/address");

class AddressController {
    // POST /api/addresses
    static async addAddress(req, res) {
        try {
            const userId = req.user.id; // from auth middleware
            const address = await Address.create(userId, req.body);

            res.status(201).json({
                success: true,
                message: "Address added successfully",
                address
            });
        } catch (error) {
            console.error("Add Address Error:", error);
            res.status(500).json({ success: false, message: "Failed to add address" });
        }
    }

    // GET /api/addresses
    static async getAddresses(req, res) {
        try {
            const userId = req.user.id;
            const addresses = await Address.findByUserId(userId);

            res.json({
                success: true,
                addresses
            });
        } catch (error) {
            console.error("Get Addresses Error:", error);
            res.status(500).json({ success: false, message: "Failed to fetch addresses" });
        }
    }

    // PUT /api/addresses/:id/set-default
    static async setDefaultAddress(req, res) {
        try {
            const userId = req.user.id;
            const addressId = req.params.id;

            const address = await Address.findById(addressId);
            if (!address || address.user_id !== userId) {
                return res.status(404).json({ success: false, message: "Address not found" });
            }

            await Address.setDefault(userId, addressId);

            res.json({
                success: true,
                message: "Default address updated"
            });
        } catch (error) {
            console.error("Set Default Address Error:", error);
            res.status(500).json({ success: false, message: "Failed to set default address" });
        }
    }

    // DELETE /api/addresses/:id
    static async deleteAddress(req, res) {
        try {
            const userId = req.user.id;
            const addressId = req.params.id;

            const deleted = await Address.delete(addressId, userId);
            if (!deleted) {
                return res.status(404).json({ success: false, message: "Address not found" });
            }

            res.json({
                success: true,
                message: "Address deleted successfully"
            });
        } catch (error) {
            console.error("Delete Address Error:", error);
            res.status(500).json({ success: false, message: "Failed to delete address" });
        }
    }
}

module.exports = AddressController;
