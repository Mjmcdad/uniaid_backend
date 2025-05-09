const express = require("express");
const router = express.Router();
const adminController = require("../Controllers/adminController");

router.post("/login", adminController.adminLogin);
router.post("/createAdmin", adminController.createAdmin);

module.exports = router;
