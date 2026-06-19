const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const jwt = require("jsonwebtoken");

// Get all subscription plans
router.get("/plans", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM subscriptions ORDER BY price ASC"
    );
    res.json({ success: true, plans: result.rows });
  } catch (error) {
    console.error("Subscription error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch plans" });
  }
});

// Get current user's subscription
router.get("/my-plan", async (req, res) => {
  try {
    const token = req.cookies.guraneza_token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const result = await pool.query(
      `SELECT u.*, s.* 
       FROM users u 
       LEFT JOIN subscriptions s ON u.subscription_id = s.id 
       WHERE u.id = $1`,
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user: result.rows[0] });
  } catch (error) {
    console.error("Subscription error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch subscription" });
  }
});

// Get current user's product count
router.get("/product-count", async (req, res) => {
  try {
    const token = req.cookies.guraneza_token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const result = await pool.query(
      "SELECT COUNT(*) FROM products WHERE owner_id = $1 AND is_deleted = FALSE",
      [decoded.id]
    );

    const count = parseInt(result.rows[0].count);

    const userResult = await pool.query(
      `SELECT s.product_limit 
       FROM users u 
       LEFT JOIN subscriptions s ON u.subscription_id = s.id 
       WHERE u.id = $1`,
      [decoded.id]
    );

    const limit = userResult.rows[0]?.product_limit || 10;

    res.json({ 
      success: true, 
      count, 
      limit,
      canAdd: count < limit 
    });
  } catch (error) {
    console.error("Product count error:", error);
    res.status(500).json({ success: false, message: "Failed" });
  }
});

module.exports = router;