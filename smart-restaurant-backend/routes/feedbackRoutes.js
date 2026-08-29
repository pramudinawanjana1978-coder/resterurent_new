const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");

// ➕ Save feedback
router.post("/", async (req, res) => {
  try {
    const payload = { ...req.body };
    if (typeof payload.stars === "number" && typeof payload.rating !== "number") {
      payload.rating = payload.stars;
    }
    if (typeof payload.rating === "number" && typeof payload.stars !== "number") {
      payload.stars = payload.rating;
    }
    const feedback = new Feedback(payload);
    await feedback.save();
    res.json(feedback);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 📥 Get all feedback
router.get("/", async (req, res) => {
  try {
    const data = await Feedback.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;