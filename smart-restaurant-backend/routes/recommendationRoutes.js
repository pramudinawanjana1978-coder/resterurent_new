const express = require("express");
const router = express.Router();
const { getFaceBasedRecommendations } = require("../controllers/recommendationController");

// POST /api/recommendations/detect
router.post("/detect", getFaceBasedRecommendations);

module.exports = router;