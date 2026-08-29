const mongoose = require("mongoose");

const FoodSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  category:    { type: String, required: true },  // Breakfast | Lunch | Dinner | Desserts | Drinks
  subcategory: { type: String, default: "" },

  price:       { type: Number, required: true },
  emoji:       { type: String, default: "🍽️" },
  description: { type: String, default: "" },
  ingredients: [String],

  rating:      { type: Number, default: 4.5, min: 0, max: 5 },
  isVegetarian:{ type: Boolean, default: false },
  isSpicy:     { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: true },

  /**
   * Moods this dish is recommended for.
   * Maps to the 6 expressions face-api detects:
   *   happy | sad | angry | surprised | neutral | disgusted | fearful
   * We extend with a custom "tired" alias for neutral+sad combo.
   */
  moodTags: {
    type:    [String],
    default: [],
    enum:    ["happy", "sad", "angry", "surprised", "neutral", "disgusted", "fearful", "tired"],
  },

  /** Priority weight — higher = shown first in recommendations */
  weight: { type: Number, default: 1 },
}, {
  timestamps: true,
});

FoodSchema.index({ category: 1, moodTags: 1 });
FoodSchema.index({ moodTags: 1, rating: -1 });
FoodSchema.index({ isAvailable: 1 });

module.exports = mongoose.model("Food", FoodSchema);