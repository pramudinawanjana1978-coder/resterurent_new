const express = require("express");
const cors = require("cors");
require("dotenv").config(); 

const { connect } = require("./config/db"); 
const logger = require("./config/logger"); 
const feedbackRoutes = require("./routes/feedbackRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes"); // 1. Route එක මෙතනදී Import කරගන්නවා

const app = express(); // 2. 'app' එක මුලින්ම Initialize කරගන්නවා මෙතනදී!

// Middlewares
app.use(cors()); 
app.use(express.json()); 

// Database එකට සම්බන්ධ වීම
connect(); 

// API Routes (දැන් 'app' එක හැදිලා නිසා කිසිම ප්‍රශ්නයක් වෙන්නේ නැහැ)
app.use("/api/feedback", feedbackRoutes);
app.use("/api/recommendations", recommendationRoutes); 

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server එක Port ${PORT} එකේ සාර්ථකව රන් වෙනවා...`);
});

app.post('/api/orders', async (req, res) => {
  try {
    const newOrder = req.body; // CartPage එකෙන් එවපු data payload එක
    
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: "Order save failed" });
  }
});