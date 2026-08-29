const mongoose = require("mongoose");

// ── Embedded sub-documents ────────────────────────────────────────────────────

const OrderItemSchema = new mongoose.Schema({
  foodId:   { type: mongoose.Schema.Types.ObjectId, ref: "Food" },
  name:     { type: String, required: true },
  category: { type: String, required: true },
  mood:     { type: String },          // mood at time of order
  price:    { type: Number },
  qty:      { type: Number, default: 1 },
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  items:       [OrderItemSchema],
  totalAmount: { type: Number, default: 0 },
  mood:        { type: String },       // overall mood when order was placed
  placedAt:    { type: Date, default: Date.now },
}, { _id: true });

// ── Main Customer schema ──────────────────────────────────────────────────────

const CustomerSchema = new mongoose.Schema({
  // Face descriptor: 128-float array from face-api.js FaceNet model
  faceDescriptor: {
    type:     [Number],
    required: true,
    validate: {
      validator: (v) => v.length === 128,
      message:   "Face descriptor must be a 128-float array.",
    },
  },

  // Optional profile (filled after recognition)
  name:      { type: String, default: "Guest" },
  tableNo:   { type: String, default: "" },

  // Mood tracking
  lastMood:      { type: String, default: "" },
  moodHistory: [{ mood: String, recordedAt: { type: Date, default: Date.now } }],

  // Full order history
  orders: [OrderSchema],

  // Quick-access: flat list of food IDs ever ordered (for fast recommendation)
  orderedFoodIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Food" }],

  // Category preference tallies  { Breakfast: 3, Dinner: 5, … }
  categoryPreferences: { type: Map, of: Number, default: {} },

  // Mood-to-category preference  { happy: { Breakfast: 2 }, … }
  moodCategoryMap: { type: Map, of: Map, default: {} },

  firstSeenAt: { type: Date, default: Date.now },
  lastSeenAt:  { type: Date, default: Date.now },
  visitCount:  { type: Number, default: 1 },
}, {
  timestamps: true,
});

// ── Indexes ───────────────────────────────────────────────────────────────────
// We cannot index the descriptor array directly in MongoDB for KNN;
// instead we load all descriptors into memory for comparison (fine up to
// ~50 k customers). For larger scale, swap in a vector DB (e.g. Pinecone).
CustomerSchema.index({ lastSeenAt: -1 });

// ── Instance methods ──────────────────────────────────────────────────────────

/**
 * Add a new order and update preference tallies.
 */
CustomerSchema.methods.addOrder = function (orderItems, mood) {
  const total = orderItems.reduce((s, i) => s + (i.price || 0) * (i.qty || 1), 0);

  this.orders.push({ items: orderItems, totalAmount: total, mood });

  // Update ordered food IDs (de-duped handled at query time)
  orderItems.forEach((item) => {
    if (item.foodId) this.orderedFoodIds.addToSet(item.foodId);

    // Category tally
    const cat = item.category || "Other";
    this.categoryPreferences.set(
      cat,
      (this.categoryPreferences.get(cat) || 0) + (item.qty || 1)
    );

    // Mood → category mapping
    if (mood) {
      if (!this.moodCategoryMap.get(mood)) {
        this.moodCategoryMap.set(mood, new Map());
      }
      const moodMap = this.moodCategoryMap.get(mood);
      moodMap.set(cat, (moodMap.get(cat) || 0) + 1);
      this.moodCategoryMap.set(mood, moodMap);
    }
  });

  // Update mood history
  if (mood) {
    this.lastMood = mood;
    this.moodHistory.push({ mood });
  }

  this.lastSeenAt = new Date();
  this.visitCount += 1;
};

/**
 * Return top N favourite categories (by order count).
 */
CustomerSchema.methods.topCategories = function (n = 3) {
  return [...this.categoryPreferences.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([cat]) => cat);
};

/**
 * Return preferred categories for a given mood.
 */
CustomerSchema.methods.categoriesForMood = function (mood) {
  const moodMap = this.moodCategoryMap.get(mood);
  if (!moodMap) return [];
  return [...moodMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([cat]) => cat);
};

module.exports = mongoose.model("Customer", CustomerSchema);