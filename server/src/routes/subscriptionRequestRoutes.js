const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const jwt = require("jsonwebtoken");

// Submit a subscription upgrade request
router.post("/", async (req, res) => {
  try {
    const token = req.cookies.guraneza_token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { requested_plan_id, shop_name, shop_description, shop_category, shop_location, shop_phone, shop_email } = req.body;

    // Check if user already has a pending request
    const existing = await pool.query(
      "SELECT * FROM subscription_requests WHERE user_id = $1 AND status = 'pending'",
      [decoded.id]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, message: "You already have a pending request" });
    }

    const result = await pool.query(
      `INSERT INTO subscription_requests 
       (user_id, requested_plan_id, shop_name, shop_description, shop_category, shop_location, shop_phone, shop_email)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [decoded.id, requested_plan_id, shop_name, shop_description, shop_category, shop_location, shop_phone, shop_email]
    );

    res.status(201).json({ success: true, request: result.rows[0], message: "Request submitted!" });
  } catch (error) {
    console.error("Request error:", error);
    res.status(500).json({ success: false, message: "Failed to submit request" });
  }
});

// Get user's requests
router.get("/my-requests", async (req, res) => {
  try {
    const token = req.cookies.guraneza_token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = await pool.query(
      `SELECT sr.*, s.plan_name, s.price, s.product_limit, s.verified_seller_badge, s.verified_product_badge, s.premium_badge, s.shop_badge, s.vip_badge
       FROM subscription_requests sr
       LEFT JOIN subscriptions s ON sr.requested_plan_id = s.id
       WHERE sr.user_id = $1
       ORDER BY sr.created_at DESC`,
      [decoded.id]
    );

    res.json({ success: true, requests: result.rows });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch requests" });
  }
});

module.exports = router;