const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const jwt = require("jsonwebtoken");

// GET all notifications
router.get("/", async (req, res) => {
  try {
    const token = req.cookies.guraneza_token;
    if (!token) {
      return res.json({ success: true, notifications: [], unreadCount: 0 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = await pool.query(
      "SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50",
      [decoded.id]
    );

    const countResult = await pool.query(
      "SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND is_read = false",
      [decoded.id]
    );

    res.json({ 
      success: true, 
      notifications: result.rows,
      unreadCount: parseInt(countResult.rows[0].count)
    });
  } catch (error) {
    console.error("Notification fetch error:", error);
    res.json({ success: true, notifications: [], unreadCount: 0 });
  }
});

// Mark single as read
router.put("/:id/read", async (req, res) => {
  try {
    const token = req.cookies.guraneza_token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = req.params;

    await pool.query(
      "UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2",
      [id, decoded.id]
    );

    res.json({ success: true });
  } catch (error) {
    console.error("Notification update error:", error);
    res.status(500).json({ success: false, message: "Failed" });
  }
});

// Mark all as read
router.put("/read-all", async (req, res) => {
  try {
    const token = req.cookies.guraneza_token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await pool.query(
      "UPDATE notifications SET is_read = true WHERE user_id = $1 AND is_read = false",
      [decoded.id]
    );

    res.json({ success: true });
  } catch (error) {
    console.error("Notification update error:", error);
    res.status(500).json({ success: false, message: "Failed" });
  }
});

module.exports = router;