const express = require("express");
const AddressController = require("../controllers/addressController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// All routes require authentication
router.post("/", authMiddleware, AddressController.addAddress);
router.get("/", authMiddleware, AddressController.getAddresses);
router.put("/:id/set-default", authMiddleware, AddressController.setDefaultAddress);
router.delete("/:id", authMiddleware, AddressController.deleteAddress);

module.exports = router;
