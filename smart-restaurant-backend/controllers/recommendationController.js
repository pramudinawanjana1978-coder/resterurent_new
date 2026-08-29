const faceService = require("../services/faceService");
const Customer = require('../models/customerModel');
const logger = require("../config/logger");

const getFaceBasedRecommendations = async (req, res) => {
  try {
    const { image } = req.body; // Front-end එකෙන් එන Base64 Image එක

    if (!image) {
      return res.status(400).json({ success: false, message: "Image data is required." });
    }

    // 1. Face එක Detect කරලා Mood සහ 128-D Descriptor එක ගන්නවා
    let faceData;
    try {
      faceData = await faceService.detectFace(image);
    } catch (err) {
      if (err.message === "NO_FACE_DETECTED") {
        // මූණක් අඳුනගන්න බැරි වුණොත් සාමාන්‍යයෙන් විකුණන කෑම (Best Sellers) Suggest කරනවා
        const fallbackFoods = await recommendationService.getBestSellers(4);
        return res.json({
          success: true,
          customer: null,
          mood: "neutral",
          recommendations: fallbackFoods,
          reasoning: "Welcome! Smile at the camera to get personalized recommendations. Here are our best sellers!"
        });
      }
      throw err;
    }

    const { mood, descriptor } = faceData;

    // 2. Database එකේ මේ මූණට ගැලපෙන Customer කෙනෙක් ඉන්නවාද බලනවා
    const { customer } = await faceService.matchCustomer(descriptor);

    let recommendations;

    if (customer) {
      // 3. පරණ Customer කෙනෙක් නම් (History + Mood)
      recommendations = await recommendationService.getPersonalizedRecommendations(customer, mood);
      
      // Customerගේ visit count සහ preference updates සිදු කරනවා
      customer.addOrder([], mood); // හිස් order එකක් දාලා visit එක විතරක් update කරනවා
      await customer.save();

      return res.json({
        success: true,
        customer: { id: customer._id, name: customer.name, visitCount: customer.visitCount },
        mood,
        recommendations: recommendations.all,
        reasoning: recommendations.reasoning
      });
    } else {
      // 4. අලුත් Customer කෙනෙක් නම් අලුතින් Profile එකක් හදලා (Mood Only) Suggest කරනවා
      recommendations = await recommendationService.getMoodBasedRecommendations(mood);

      const newCustomer = new Customer({
        faceDescriptor: descriptor,
        name: `Guest_${Math.floor(1000 + Math.random() * 9000)}`,
        lastMood: mood,
        visitCount: 1
      });
      await newCustomer.save();

      return res.json({
        success: true,
        customer: { id: newCustomer._id, name: newCustomer.name, visitCount: 1 },
        mood,
        recommendations,
        reasoning: `Welcome! You look ${mood} today. We've selected these fresh dishes just for your mood!`
      });
    }

  } catch (error) {
    logger.error(`Recommendation Controller Error: ${error.message}`);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { getFaceBasedRecommendations };