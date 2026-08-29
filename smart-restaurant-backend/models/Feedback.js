const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  dishId: String,
  dishName: String,
  rating: Number,
  stars: Number,
  aspects: Object,
  tags: [String],
  comment: String,
  name: String,
  recommend: Boolean,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Feedback", feedbackSchema);