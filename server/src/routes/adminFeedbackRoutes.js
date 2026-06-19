const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const jwt = require("jsonwebtoken");

const requireAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.guraneza_token;
    if (!token) return res.status(401).json({ success: false, message: "Not authenticated" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await pool.query("SELECT role FROM users WHERE id = $1", [decoded.id]);
    if (user.rows.length === 0 || user.rows[0].role !== 'admin') {
      return res.status(403).json({ success: false, message: "Admin access required" });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

// Get all subscription requests
router.get("/subscription-requests", requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT sr.*, u.username, u.email, u.profile_picture, s.plan_name, s.price
       FROM subscription_requests sr
       LEFT JOIN users u ON sr.user_id = u.id
       LEFT JOIN subscriptions s ON sr.requested_plan_id = s.id
       ORDER BY sr.created_at DESC`
    );
    res.json({ success: true, requests: result.rows });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Failed" });
  }
});

// Approve/Reject request
router.put("/subscription-requests/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_message } = req.body;

    const request = await pool.query("SELECT * FROM subscription_requests WHERE id = $1", [id]);
    if (request.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    await pool.query(
      "UPDATE subscription_requests SET status = $1, admin_message = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3",
      [status, admin_message, id]
    );

    // If approved, update user's subscription
    if (status === 'approved') {
      await pool.query(
        "UPDATE users SET subscription_id = $1, subscription_type = (SELECT plan_name FROM subscriptions WHERE id = $1) WHERE id = $2",
        [request.rows[0].requested_plan_id, request.rows[0].user_id]
      );

      // Create shop if shop_name provided
      if (request.rows[0].shop_name) {
        const existingShop = await pool.query("SELECT * FROM shops WHERE owner_id = $1", [request.rows[0].user_id]);
        if (existingShop.rows.length === 0) {
          await pool.query(
            `INSERT INTO shops (owner_id, shop_name, description, category, location, phone, email)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [request.rows[0].user_id, request.rows[0].shop_name, request.rows[0].shop_description,
             request.rows[0].shop_category, request.rows[0].shop_location, request.rows[0].shop_phone, request.rows[0].shop_email]
          );
        }
      }

      // Send notification
      await pool.query(
        `INSERT INTO notifications (user_id, title, message, type)
         VALUES ($1, $2, $3, $4)`,
        [request.rows[0].user_id, "Subscription Approved ✅", 
         `Your subscription upgrade has been approved! ${admin_message || ''}`, "system"]
      );
    } else if (status === 'rejected') {
      // Send rejection notification
      await pool.query(
        `INSERT INTO notifications (user_id, title, message, type)
         VALUES ($1, $2, $3, $4)`,
        [request.rows[0].user_id, "Subscription Request Update", 
         `Your request was not approved. ${admin_message || ''}`, "system"]
      );
    }

    res.json({ success: true, message: "Request updated" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Failed" });
  }
});

module.exports = router;