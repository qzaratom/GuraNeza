const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.get("/", async (req, res) => {
  try {
    const usersResult = await pool.query("SELECT COUNT(*) FROM users");
    const productsResult = await pool.query("SELECT COUNT(*) FROM products WHERE is_deleted = FALSE");
    const shopsResult = await pool.query("SELECT COUNT(*) FROM shops");

    res.json({
      success: true,
      stats: {
        users: parseInt(usersResult.rows[0].count),
        products: parseInt(productsResult.rows[0].count),
        shops: parseInt(shopsResult.rows[0].count),
      }
    });
  } catch (error) {
    console.error("Stats error:", error);
    res.json({ success: true, stats: { users: 0, products: 0, shops: 0 } });
  }
});

module.exports = router;