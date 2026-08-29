/**
 * faceService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Wraps @vladmandic/face-api for:
 *   1. Loading models (done once at server start)
 *   2. Decoding a base64 image into a canvas
 *   3. Detecting a single face + extracting expression + 128-D descriptor
 *   4. Comparing a descriptor against the Customer collection in MongoDB
 * ─────────────────────────────────────────────────────────────────────────────
 */
const faceapi = require('face-api.js');
const path      = require("path");
const { Canvas, Image, ImageData, createCanvas, loadImage } = require("canvas");

const Customer = require('../models/customerModel');
const logger    = require("../config/logger");

// ── Patch canvas globals so face-api can run in Node.js ───────────────────────
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

// ── Model directory ───────────────────────────────────────────────────────────
// Download models from: https://github.com/vladmandic/face-api/tree/master/model
const MODEL_DIR = path.join(__dirname, "../../models");

// ── Singleton flag ────────────────────────────────────────────────────────────
let modelsLoaded = false;

// ─────────────────────────────────────────────────────────────────────────────
// 1. Load models
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Load the three face-api models we need.
 * Call this once during server startup.
 */
const loadModels = async () => {
  if (modelsLoaded) return;
  logger.info("Loading face-api.js models…");

  await Promise.all([
    // Tiny face detector — fast, good for single-face images
    faceapi.nets.tinyFaceDetector.loadFromDisk(MODEL_DIR),
    // Face landmark model — needed for descriptor alignment
    faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_DIR),
    // FaceNet — produces 128-float descriptor
    faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_DIR),
    // Expression classifier (7 emotions)
    faceapi.nets.faceExpressionNet.loadFromDisk(MODEL_DIR),
  ]);

  modelsLoaded = true;
  logger.info("face-api.js models loaded successfully.");
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. Base64 → canvas Image
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Convert a base64-encoded image string (data URL or raw) to a node-canvas
 * Image object that face-api can process.
 *
 * @param {string} base64 - Raw base64 or "data:image/...;base64,..." string
 * @returns {Image}
 */
const base64ToImage = async (base64) => {
  // Strip data-URL prefix if present
  const raw = base64.startsWith("data:")
    ? base64.split(",")[1]
    : base64;

  const buffer = Buffer.from(raw, "base64");
  const img    = await loadImage(buffer);
  return img;
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. Detect face — expression + descriptor
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Detect the dominant expression and 128-D descriptor from a base64 image.
 *
 * @param {string} base64Image
 * @returns {{
 *   mood: string,               // dominant expression label
 *   expressionScores: Object,   // all 7 expression probabilities
 *   descriptor: number[],       // 128-element float array
 *   detectionScore: number,     // face detection confidence (0-1)
 * }}
 * @throws {Error} if no face is detected or confidence is below threshold
 */
const detectFace = async (base64Image) => {
  if (!modelsLoaded) throw new Error("Face-api models not loaded yet.");

  const img  = await base64ToImage(base64Image);

  // Draw image onto an off-screen canvas (required by face-api in Node.js)
  const canvas = createCanvas(img.width, img.height);
  const ctx    = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  // Detect single best face with landmarks, descriptor and expressions
  const detection = await faceapi
    .detectSingleFace(
      canvas,
      new faceapi.TinyFaceDetectorOptions({
        inputSize:        320,
        scoreThreshold:   parseFloat(process.env.FACE_DETECTION_SCORE || "0.6"),
      })
    )
    .withFaceLandmarks()
    .withFaceDescriptor()
    .withFaceExpressions();

  if (!detection) {
    throw new Error("NO_FACE_DETECTED");
  }

  const detectionScore = detection.detection.score;
  logger.debug(`Face detected — confidence: ${detectionScore.toFixed(3)}`);

  // ── Extract expressions ────────────────────────────────────────────────────
  const exprObj  = detection.expressions;   // { happy: 0.9, sad: 0.01, … }
  const topMood  = Object.entries(exprObj)
    .sort((a, b) => b[1] - a[1])[0][0];     // label with highest probability

  // Map face-api labels → our internal mood names (tired = neutral/sad blend)
  const moodMap = {
    happy:     "happy",
    sad:       "sad",
    angry:     "angry",
    surprised: "surprised",
    neutral:   "neutral",
    disgusted: "angry",   // treat disgusted as angry for food recommendations
    fearful:   "sad",     // treat fear as sadness
  };
  const mood = moodMap[topMood] || "neutral";

  // ── Descriptor ────────────────────────────────────────────────────────────
  const descriptor = Array.from(detection.descriptor);  // Float32Array → []

  return {
    mood,
    expressionScores: exprObj,
    descriptor,
    detectionScore,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. Euclidean distance between two 128-D vectors
// ─────────────────────────────────────────────────────────────────────────────

const euclideanDistance = (a, b) => {
  let sum = 0;
  for (let i = 0; i < 128; i++) sum += (a[i] - b[i]) ** 2;
  return Math.sqrt(sum);
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. Match descriptor against all customers in MongoDB
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Compare an incoming descriptor against every customer in the DB.
 * Returns the closest match if within threshold, otherwise null.
 *
 * ⚡ Strategy: Load only _id + faceDescriptor for all customers, compute
 *    distances in JS, then fetch full doc for the winner.
 *    Scales to ~50 k records comfortably. For larger scale,
 *    migrate to a vector database (Pinecone, Weaviate, etc.).
 *
 * @param {number[]} descriptor - 128-element float array from current scan
 * @returns {Promise<{customer: Customer|null, distance: number}>}
 */
const matchCustomer = async (descriptor) => {
  const threshold = parseFloat(process.env.FACE_MATCH_THRESHOLD || "0.5");

  // Fetch only the fields needed for comparison
  const allCustomers = await Customer.find(
    {},
    { _id: 1, faceDescriptor: 1 }
  ).lean();

  if (allCustomers.length === 0) {
    return { customer: null, distance: Infinity };
  }

  // Find minimum-distance record
  let bestId       = null;
  let bestDistance = Infinity;

  for (const c of allCustomers) {
    const dist = euclideanDistance(descriptor, c.faceDescriptor);
    if (dist < bestDistance) {
      bestDistance = dist;
      bestId       = c._id;
    }
  }

  logger.debug(
    `Best face match distance: ${bestDistance.toFixed(4)} (threshold: ${threshold})`
  );

  if (bestDistance > threshold) {
    return { customer: null, distance: bestDistance };
  }

  // Fetch full customer document for the winner
  const customer = await Customer.findById(bestId).populate("orderedFoodIds");
  return { customer, distance: bestDistance };
};

module.exports = { loadModels, detectFace, matchCustomer, euclideanDistance };