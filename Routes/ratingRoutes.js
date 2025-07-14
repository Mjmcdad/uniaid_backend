const express = require("express");
const router = express.Router();
const ratingController = require("../Controllers/ratingController");

router.post("/", ratingController.createRating);
router.get("/", ratingController.getRatings);
module.exports = router;
