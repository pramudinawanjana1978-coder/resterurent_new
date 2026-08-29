/**
 * recommendationService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Generates food recommendations in two modes:
 *
 *  NEW CUSTOMER  → mood-based suggestions only
 *  RETURNING     → blends mood-based + order-history preferences
 *
 * Scoring formula (returning customer):
 *   score = (moodWeight × 3) + (categoryPreferenceWeight × 2) + (ratingBonus)
 *
 * All recommendations are pulled live from the Food collection.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const Food   = require("../models/Food");
const logger = require("../config/logger");

// ── Constants ─────────────────────────────────────────────────────────────────

const MAX_RECOMMENDATIONS  = 8;
const MOOD_ITEM_LIMIT      = 4; // pure-mood suggestions per result set
const HISTORY_ITEM_LIMIT   = 4; // history-based additions per result set

// ─────────────────────────────────────────────────────────────────────────────
// 1. Mood-only recommendations (new customer)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Return foods tagged for the given mood, sorted by rating.
 *
 * @param {string} mood
 * @param {number} limit
 * @returns {Promise<Food[]>}
 */
const getMoodBasedRecommendations = async (mood, limit = MAX_RECOMMENDATIONS) => {
  const foods = await Food.find({
    moodTags:    { $in: [mood, "neutral"] },  // neutral foods always eligible
    isAvailable: true,
  })
    .sort({ rating: -1, weight: -1 })
    .limit(limit);

  logger.debug(`Mood-based: found ${foods.length} foods for mood "${mood}"`);
  return foods;
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. History-aware recommendations (returning customer)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Blend mood preferences with the customer's historical behaviour.
 *
 * Strategy:
 *   A. Fetch foods tagged for current mood  (mood weight ×3)
 *   B. Fetch foods in customer's top categories  (history weight ×2)
 *   C. Fetch foods in categories the customer ordered during THIS mood  (+bonus)
 *   D. Score + rank + de-duplicate + return top N
 *
 * @param {import('../models/Customer')} customer - Full Mongoose doc
 * @param {string} mood
 * @returns {Promise<{
 *   moodSuggestions:    Food[],
 *   historySuggestions: Food[],
 *   all:                Food[],
 *   reasoning:          string,
 * }>}
 */
const getPersonalizedRecommendations = async (customer, mood) => {
  // ── A. Mood foods ─────────────────────────────────────────────────────────
  const moodFoods = await Food.find({
    moodTags:    { $in: [mood] },
    isAvailable: true,
  })
    .sort({ rating: -1 })
    .limit(20)
    .lean();

  // ── B. Top historical categories ──────────────────────────────────────────
  const topCategories   = customer.topCategories(3);      // e.g. ["Dinner","Lunch"]
  const moodCategories  = customer.categoriesForMood(mood); // categories during this mood

  // Merge: mood-specific history first, then overall favourites
  const preferredCats = [...new Set([...moodCategories, ...topCategories])];

  logger.debug(
    `Customer ${customer._id} — topCats: ${topCategories}, moodCats: ${moodCategories}`
  );

  const historyFoods = preferredCats.length
    ? await Food.find({
        category:    { $in: preferredCats },
        isAvailable: true,
      })
        .sort({ rating: -1, weight: -1 })
        .limit(20)
        .lean()
    : [];

  // ── C. Previously ordered foods (for "order again" section) ───────────────
  const prevOrderedIds = customer.orderedFoodIds.map((f) =>
    f._id ? f._id.toString() : f.toString()
  );

  // ── D. Score & merge ──────────────────────────────────────────────────────
  const scoreMap = new Map(); // foodId → { food, score }

  const score = (food, base) => {
    const id      = food._id.toString();
    const current = scoreMap.get(id)?.score || 0;
    const rating  = food.rating || 4.5;
    const bonus   = prevOrderedIds.includes(id) ? 1.5 : 0; // "ordered before" boost
    scoreMap.set(id, { food, score: current + base + (rating - 4) + bonus });
  };

  moodFoods.forEach    ((f) => score(f, 3));
  historyFoods.forEach ((f) => score(f, 2));

  // Sort by score descending
  const ranked = [...scoreMap.values()]
    .sort((a, b) => b.score - a.score)
    .map((v) => v.food);

  const moodSuggestions    = ranked.filter((f) =>
    f.moodTags?.includes(mood)
  ).slice(0, MOOD_ITEM_LIMIT);

  const historySuggestions = ranked.filter((f) =>
    preferredCats.includes(f.category) && !moodSuggestions.find((m) => m._id.toString() === f._id.toString())
  ).slice(0, HISTORY_ITEM_LIMIT);

  const all = [...new Map(
    [...moodSuggestions, ...historySuggestions, ...ranked]
      .map((f) => [f._id.toString(), f])
  ).values()].slice(0, MAX_RECOMMENDATIONS);

  // ── E. Human-readable reasoning ───────────────────────────────────────────
  const visitText = customer.visitCount > 1
    ? `Welcome back! This is your visit #${customer.visitCount}.`
    : "Welcome!";

  const reasoning =
    `${visitText} You seem ${mood} today. ` +
    (moodCategories.length
      ? `Last time you were ${mood}, you loved ${moodCategories[0]}.`
      : `Based on your top category (${topCategories[0] || "our menu"}), we picked these for you.`);

  logger.debug(`Personalized: returning ${all.length} items for customer ${customer._id}`);

  return { moodSuggestions, historySuggestions, all, reasoning };
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. Best-sellers fallback (used when DB has very few tagged foods)
// ─────────────────────────────────────────────────────────────────────────────

const getBestSellers = async (limit = 4) =>
  Food.find({ isAvailable: true }).sort({ rating: -1 }).limit(limit);

module.exports = {
  getMoodBasedRecommendations,
  getPersonalizedRecommendations,
  getBestSellers,
};