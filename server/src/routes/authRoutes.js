const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const {
  googleLogin,
  register,
  login,
  checkAuth,
  logout,
  updateProfile,
  deleteAccount,
} = require("../controllers/authController");

router.post("/google", googleLogin);
router.post("/register", register);
router.post("/login", login);
router.get("/me", checkAuth);
router.post("/logout", logout);
router.put("/profile", updateProfile);
router.delete("/account", deleteAccount);

// Get user profile by ID
router.get("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT u.id, u.username, u.email, u.bio, u.location, u.profile_picture, u.phone_number,
        u.is_verified, u.created_at, u.role,
        s.plan_name, s.verified_seller_badge, s.verified_product_badge, s.premium_badge, s.shop_badge,
        (SELECT COUNT(*) FROM products WHERE owner_id = u.id AND is_deleted = FALSE) as total_products,
        (SELECT COALESCE(SUM(views), 0) FROM products WHERE owner_id = u.id AND is_deleted = FALSE) as total_views,
        (SELECT COUNT(*) FROM product_likes pl JOIN products p ON pl.product_id = p.id WHERE p.owner_id = u.id) as total_likes
       FROM users u
       LEFT JOIN subscriptions s ON u.subscription_id = s.id
       WHERE u.id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    res.json({ success: true, user: result.rows[0] });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch user" });
  }
});

// Get user's products
router.get("/user/:id/products", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT p.*,
        COALESCE(
          (SELECT json_agg(pi.image_url ORDER BY pi.position)
           FROM product_images pi
           WHERE pi.product_id = p.id),
          '[]'::json
        ) as image_urls
       FROM products p
       WHERE p.owner_id = $1 AND p.is_deleted = FALSE
       ORDER BY p.created_at DESC
       LIMIT 20`,
      [id]
    );
    res.json({ success: true, products: result.rows });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch products" });
  }
});

module.exports = router;