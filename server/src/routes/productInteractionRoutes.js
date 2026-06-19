const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const jwt = require("jsonwebtoken");

// Increment view count
router.post("/:id/view", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(
      "UPDATE products SET views = COALESCE(views, 0) + 1 WHERE id = $1",
      [id]
    );
    res.json({ success: true });
  } catch (error) {
    console.error("View error:", error);
    res.status(500).json({ success: false, message: "Failed" });
  }
});

// Like a product
router.post("/:id/like", async (req, res) => {
  try {
    const token = req.cookies.guraneza_token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Please sign in to like" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = req.params;

    // Check if already liked
    const existing = await pool.query(
      "SELECT * FROM product_likes WHERE user_id = $1 AND product_id = $2",
      [decoded.id, id]
    );

    if (existing.rows.length > 0) {
      // Unlike
      await pool.query(
        "DELETE FROM product_likes WHERE user_id = $1 AND product_id = $2",
        [decoded.id, id]
      );
      res.json({ success: true, liked: false, message: "Unliked" });
    } else {
      // Like
      await pool.query(
        "INSERT INTO product_likes (user_id, product_id) VALUES ($1, $2)",
        [decoded.id, id]
      );
      res.json({ success: true, liked: true, message: "Liked!" });
    }
  } catch (error) {
    console.error("Like error:", error);
    res.status(500).json({ success: false, message: "Failed" });
  }
});

// Get like count for a product
router.get("/:id/likes", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT COUNT(*) FROM product_likes WHERE product_id = $1",
      [id]
    );

    // Check if current user liked it
    let userLiked = false;
    const token = req.cookies.guraneza_token;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const likeCheck = await pool.query(
          "SELECT * FROM product_likes WHERE user_id = $1 AND product_id = $2",
          [decoded.id, id]
        );
        userLiked = likeCheck.rows.length > 0;
      } catch (e) {}
    }

    res.json({
      success: true,
      likes: parseInt(result.rows[0].count),
      userLiked
    });
  } catch (error) {
    console.error("Likes error:", error);
    res.status(500).json({ success: false, message: "Failed" });
  }
});

// Get user's total views across all their products
router.get("/user/:userId/total-views", async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      "SELECT COALESCE(SUM(views), 0) as total_views, COUNT(*) as total_products FROM products WHERE owner_id = $1 AND is_deleted = FALSE",
      [userId]
    );
    res.json({ success: true, ...result.rows[0] });
  } catch (error) {
    console.error("Total views error:", error);
    res.status(500).json({ success: false, message: "Failed" });
  }
});

module.exports = router;