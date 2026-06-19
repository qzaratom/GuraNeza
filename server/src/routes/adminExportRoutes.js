const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const jwt = require("jsonwebtoken");
const ExcelJS = require("exceljs");

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

// Export Users
router.get("/users", requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.username, u.email, u.phone_number, u.location, u.role, u.is_verified, 
        u.subscription_type, u.created_at, s.plan_name
       FROM users u LEFT JOIN subscriptions s ON u.subscription_id = s.id
       ORDER BY u.created_at DESC`
    );

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Users");

    worksheet.columns = [
      { header: "Username", key: "username", width: 20 },
      { header: "Email", key: "email", width: 30 },
      { header: "Phone", key: "phone_number", width: 15 },
      { header: "Location", key: "location", width: 20 },
      { header: "Role", key: "role", width: 10 },
      { header: "Verified", key: "is_verified", width: 10 },
      { header: "Plan", key: "plan_name", width: 15 },
      { header: "Joined", key: "created_at", width: 20 },
    ];

    worksheet.getRow(1).font = { bold: true };
    result.rows.forEach(row => worksheet.addRow(row));

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=users.xlsx");
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Export error:", error);
    res.status(500).json({ success: false, message: "Export failed" });
  }
});

// Export Products
router.get("/products", requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.name, p.description, p.price, p.category, p.stock_quantity, 
        p.negotiable, p.verified, p.views, p.status, p.created_at, u.username as seller
       FROM products p LEFT JOIN users u ON p.owner_id = u.id
       WHERE p.is_deleted = FALSE ORDER BY p.created_at DESC`
    );

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Products");

    worksheet.columns = [
      { header: "Name", key: "name", width: 25 },
      { header: "Description", key: "description", width: 40 },
      { header: "Price (RWF)", key: "price", width: 15 },
      { header: "Category", key: "category", width: 20 },
      { header: "Stock", key: "stock_quantity", width: 8 },
      { header: "Negotiable", key: "negotiable", width: 10 },
      { header: "Verified", key: "verified", width: 10 },
      { header: "Views", key: "views", width: 8 },
      { header: "Status", key: "status", width: 10 },
      { header: "Seller", key: "seller", width: 20 },
      { header: "Created", key: "created_at", width: 20 },
    ];

    worksheet.getRow(1).font = { bold: true };
    result.rows.forEach(row => worksheet.addRow(row));

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=products.xlsx");
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Export error:", error);
    res.status(500).json({ success: false, message: "Export failed" });
  }
});

// Export Shops
router.get("/shops", requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.shop_name, s.description, s.category, s.location, s.phone, s.email, 
        s.is_verified, s.created_at, u.username as owner
       FROM shops s LEFT JOIN users u ON s.owner_id = u.id ORDER BY s.created_at DESC`
    );

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Shops");

    worksheet.columns = [
      { header: "Shop Name", key: "shop_name", width: 25 },
      { header: "Description", key: "description", width: 40 },
      { header: "Category", key: "category", width: 20 },
      { header: "Location", key: "location", width: 20 },
      { header: "Phone", key: "phone", width: 15 },
      { header: "Email", key: "email", width: 30 },
      { header: "Verified", key: "is_verified", width: 10 },
      { header: "Owner", key: "owner", width: 20 },
      { header: "Created", key: "created_at", width: 20 },
    ];

    worksheet.getRow(1).font = { bold: true };
    result.rows.forEach(row => worksheet.addRow(row));

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=shops.xlsx");
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Export error:", error);
    res.status(500).json({ success: false, message: "Export failed" });
  }
});

module.exports = router;