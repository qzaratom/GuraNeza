const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const jwt = require("jsonwebtoken");

// Get all shops
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.*, u.username as owner_name, u.profile_picture as owner_picture,
        (SELECT COUNT(*) FROM products WHERE shop_id = s.id AND is_deleted = FALSE) as product_count
       FROM shops s
       LEFT JOIN users u ON s.owner_id = u.id
       ORDER BY s.created_at DESC`
    );
    res.json({ success: true, shops: result.rows });
  } catch (error) {
    console.error("Shops error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch shops" });
  }
});

// Get user's shop
router.get("/my-shop", async (req, res) => {
  try {
    const token = req.cookies.guraneza_token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = await pool.query(
      `SELECT s.*, u.username as owner_name, u.email as owner_email
       FROM shops s
       LEFT JOIN users u ON s.owner_id = u.id
       WHERE s.owner_id = $1`,
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return res.json({ success: true, shop: null });
    }

    // Get shop products
    const productsResult = await pool.query(
      `SELECT p.*,
        COALESCE(
          (SELECT json_agg(pi.image_url ORDER BY pi.position)
           FROM product_images pi
           WHERE pi.product_id = p.id),
          '[]'::json
        ) as image_urls
       FROM products p
       WHERE p.shop_id = $1 AND p.is_deleted = FALSE
       ORDER BY p.created_at DESC`,
      [result.rows[0].id]
    );

    res.json({ 
      success: true, 
      shop: result.rows[0],
      products: productsResult.rows
    });
  } catch (error) {
    console.error("My shop error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch shop" });
  }
});

// Get single shop by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT s.*, u.username as owner_name, u.profile_picture as owner_picture, u.email as owner_email
       FROM shops s
       LEFT JOIN users u ON s.owner_id = u.id
       WHERE s.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Shop not found" });
    }

    // Get shop products
    const productsResult = await pool.query(
      `SELECT p.*,
        COALESCE(
          (SELECT json_agg(pi.image_url ORDER BY pi.position)
           FROM product_images pi
           WHERE pi.product_id = p.id),
          '[]'::json
        ) as image_urls
       FROM products p
       WHERE p.shop_id = $1 AND p.is_deleted = FALSE
       ORDER BY p.created_at DESC`,
      [id]
    );

    res.json({ 
      success: true, 
      shop: result.rows[0],
      products: productsResult.rows
    });
  } catch (error) {
    console.error("Shop error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch shop" });
  }
});

// Create shop
router.post("/", async (req, res) => {
  try {
    const token = req.cookies.guraneza_token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user already has a shop
    const existing = await pool.query("SELECT * FROM shops WHERE owner_id = $1", [decoded.id]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, message: "You already have a shop. One shop per account." });
    }

    const { shop_name, description, category, location, phone, email, poster_image } = req.body;

    const result = await pool.query(
      `INSERT INTO shops (owner_id, shop_name, description, category, location, phone, email, poster_image)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [decoded.id, shop_name, description, category, location, phone, email, poster_image]
    );

    res.status(201).json({ success: true, shop: result.rows[0], message: "Shop created!" });
  } catch (error) {
    console.error("Create shop error:", error);
    res.status(500).json({ success: false, message: "Failed to create shop" });
  }
});

// Update shop
router.put("/:id", async (req, res) => {
  try {
    const token = req.cookies.guraneza_token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = req.params;
    const { shop_name, description, category, location, phone, email, poster_image } = req.body;

    // Check ownership
    const shopCheck = await pool.query("SELECT * FROM shops WHERE id = $1 AND owner_id = $2", [id, decoded.id]);
    if (shopCheck.rows.length === 0) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const result = await pool.query(
      `UPDATE shops SET shop_name = $1, description = $2, category = $3, location = $4, phone = $5, email = $6, poster_image = COALESCE($7, poster_image)
       WHERE id = $8 AND owner_id = $9
       RETURNING *`,
      [shop_name, description, category, location, phone, email, poster_image, id, decoded.id]
    );

    res.json({ success: true, shop: result.rows[0], message: "Shop updated!" });
  } catch (error) {
    console.error("Update shop error:", error);
    res.status(500).json({ success: false, message: "Failed to update shop" });
  }
});

module.exports = router;