const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const jwt = require("jsonwebtoken");

// Middleware to check if user is admin
const requireAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.guraneza_token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

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

// Get all users
router.get("/users", requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.*, s.plan_name, s.product_limit, s.price as plan_price
       FROM users u
       LEFT JOIN subscriptions s ON u.subscription_id = s.id
       ORDER BY u.created_at DESC`
    );
    res.json({ success: true, users: result.rows });
  } catch (error) {
    console.error("Admin error:", error);
    res.status(500).json({ success: false, message: "Failed" });
  }
});

// Get all products
router.get("/products", requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, u.username, u.email
       FROM products p
       LEFT JOIN users u ON p.owner_id = u.id
       WHERE p.is_deleted = FALSE
       ORDER BY p.created_at DESC`
    );
    res.json({ success: true, products: result.rows });
  } catch (error) {
    console.error("Admin error:", error);
    res.status(500).json({ success: false, message: "Failed" });
  }
});

// Get all subscriptions
router.get("/subscriptions", requireAdmin, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM subscriptions ORDER BY price ASC");
    res.json({ success: true, subscriptions: result.rows });
  } catch (error) {
    console.error("Admin error:", error);
    res.status(500).json({ success: false, message: "Failed" });
  }
});

// Update user subscription
router.put("/users/:id/subscription", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { subscription_id } = req.body;

    await pool.query(
      "UPDATE users SET subscription_id = $1, subscription_type = (SELECT plan_name FROM subscriptions WHERE id = $1) WHERE id = $2",
      [subscription_id, id]
    );

    res.json({ success: true, message: "Subscription updated" });
  } catch (error) {
    console.error("Admin error:", error);
    res.status(500).json({ success: false, message: "Failed" });
  }
});

// Verify a product
router.put("/products/:id/verify", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "UPDATE products SET verified = true, verified_at = CURRENT_TIMESTAMP WHERE id = $1",
      [id]
    );

    res.json({ success: true, message: "Product verified" });
  } catch (error) {
    console.error("Admin error:", error);
    res.status(500).json({ success: false, message: "Failed" });
  }
});

// Get dashboard stats
router.get("/stats", requireAdmin, async (req, res) => {
  try {
    const usersCount = await pool.query("SELECT COUNT(*) FROM users");
    const productsCount = await pool.query("SELECT COUNT(*) FROM products WHERE is_deleted = FALSE");
    const shopsCount = await pool.query("SELECT COUNT(*) FROM shops");
    const reportsCount = await pool.query("SELECT COUNT(*) FROM reports WHERE status = 'pending'");

    res.json({
      success: true,
      stats: {
        users: parseInt(usersCount.rows[0].count),
        products: parseInt(productsCount.rows[0].count),
        shops: parseInt(shopsCount.rows[0].count),
        pendingReports: parseInt(reportsCount.rows[0].count),
      }
    });
  } catch (error) {
    console.error("Admin error:", error);
    res.status(500).json({ success: false, message: "Failed" });
  }
});

module.exports = router;