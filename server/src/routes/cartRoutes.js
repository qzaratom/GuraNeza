const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const jwt = require("jsonwebtoken");

// GET cart
router.get("/", async (req, res) => {
  try {
    const token = req.cookies.guraneza_token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Please sign in" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = await pool.query(
      `SELECT 
        c.id as cart_id,
        c.quantity,
        p.*,
        u.username as owner_name,
        COALESCE(
          (SELECT json_agg(pi.image_url ORDER BY pi.position)
           FROM product_images pi
           WHERE pi.product_id = p.id),
          '[]'::json
        ) as image_urls
      FROM carts c
      JOIN products p ON c.product_id = p.id
      LEFT JOIN users u ON p.owner_id = u.id
      WHERE c.user_id = $1 AND p.is_deleted = FALSE
      ORDER BY c.created_at DESC`,
      [decoded.id]
    );

    res.json({ success: true, cart: result.rows });
  } catch (error) {
    console.error("Cart fetch error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch cart" });
  }
});

// ADD to cart
router.post("/", async (req, res) => {
  try {
    const token = req.cookies.guraneza_token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Please sign in" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { product_id, quantity } = req.body;

    // Get product info
    const productResult = await pool.query(
      "SELECT name, owner_id, price FROM products WHERE id = $1",
      [product_id]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const product = productResult.rows[0];

    // Check if already in cart
    const existing = await pool.query(
      "SELECT * FROM carts WHERE user_id = $1 AND product_id = $2",
      [decoded.id, product_id]
    );

    if (existing.rows.length > 0) {
      await pool.query(
        "UPDATE carts SET quantity = quantity + $1 WHERE user_id = $2 AND product_id = $3",
        [quantity || 1, decoded.id, product_id]
      );
    } else {
      await pool.query(
        "INSERT INTO carts (user_id, product_id, quantity) VALUES ($1, $2, $3)",
        [decoded.id, product_id, quantity || 1]
      );
    }

    // CREATE NOTIFICATION FOR THE BUYER (the person who clicked Add to Cart)
    await pool.query(
      `INSERT INTO notifications (user_id, title, message, type)
       VALUES ($1, $2, $3, $4)`,
      [
        decoded.id,
        "Added to Cart 🛒",
        `You added "${product.name}" (${Number(product.price).toLocaleString()} RWF) to your cart.`,
        "cart"
      ]
    );

    res.json({ success: true, message: "Added to cart" });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ success: false, message: "Failed to add to cart" });
  }
});

// UPDATE quantity
router.put("/:cartId", async (req, res) => {
  try {
    const token = req.cookies.guraneza_token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Please sign in" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { cartId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      await pool.query("DELETE FROM carts WHERE id = $1 AND user_id = $2", [cartId, decoded.id]);
      return res.json({ success: true, message: "Removed" });
    }

    await pool.query(
      "UPDATE carts SET quantity = $1 WHERE id = $2 AND user_id = $3",
      [quantity, cartId, decoded.id]
    );

    res.json({ success: true });
  } catch (error) {
    console.error("Update cart error:", error);
    res.status(500).json({ success: false, message: "Failed" });
  }
});

// DELETE from cart
router.delete("/:cartId", async (req, res) => {
  try {
    const token = req.cookies.guraneza_token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Please sign in" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { cartId } = req.params;

    await pool.query("DELETE FROM carts WHERE id = $1 AND user_id = $2", [cartId, decoded.id]);

    res.json({ success: true });
  } catch (error) {
    console.error("Delete cart error:", error);
    res.status(500).json({ success: false, message: "Failed" });
  }
});

module.exports = router;