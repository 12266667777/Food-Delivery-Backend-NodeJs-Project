const express = require("express");
const router = express.Router();
const searchController = require("../controllers/seachController");

// Global search
router.get("/", searchController.globalSearch);

module.exports = router;
