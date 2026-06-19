const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/products", require("./src/routes/productRoutes"));
app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/upload", require("./src/routes/uploadRoutes"));
app.use("/api/cart", require("./src/routes/cartRoutes"));
app.use("/api/notifications", require("./src/routes/notificationRoutes"));
app.use("/api/subscriptions", require("./src/routes/subscriptionRoutes"));
app.use("/api/shops", require("./src/routes/shopRoutes"));
app.use("/api/chat", require("./src/routes/chatRoutes"));
app.use("/api/admin", require("./src/routes/adminRoutes"));
app.use("/api/admin/export", require("./src/routes/adminExportRoutes"));
app.use("/api/admin/feedback", require("./src/routes/adminFeedbackRoutes"));
app.use("/api/subscription-requests", require("./src/routes/subscriptionRequestRoutes"));
app.use("/api/products/interact", require("./src/routes/productInteractionRoutes"));
app.use("/api/help", require("./src/routes/helpRoutes")); // <-- ADD THIS LINE

// ==========================================
// PUBLIC STATS ENDPOINT - NO AUTH REQUIRED
// ==========================================
app.get("/api/public/stats", async (req, res) => {
  const pool = require("./src/config/db");
  try {
    const usersResult = await pool.query("SELECT COUNT(*) FROM users");
    const productsResult = await pool.query("SELECT COUNT(*) FROM products WHERE is_deleted = FALSE");
    const shopsResult = await pool.query("SELECT COUNT(*) FROM shops");

    const stats = {
      users: parseInt(usersResult.rows[0].count),
      products: parseInt(productsResult.rows[0].count),
      shops: parseInt(shopsResult.rows[0].count),
    };

    console.log("📊 Public stats requested:", stats);

    res.json({
      success: true,
      stats: stats,
    });
  } catch (error) {
    console.error("Stats error:", error);
    res.json({
      success: true,
      stats: { users: 0, products: 0, shops: 0 },
    });
  }
});

app.get("/", async (req, res) => {
  const pool = require("./src/config/db");
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      success: true,
      databaseTime: result.rows[0].now,
      message: "GuraNeza Backend Running 🚀",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Database connection failed" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});