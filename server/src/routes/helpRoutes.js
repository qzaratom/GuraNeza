const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const jwt = require("jsonwebtoken");

// ==================== HELP TICKETS ====================

// GET /api/help/tickets - Get all tickets for current user
router.get("/tickets", async (req, res) => {
  try {
    const token = req.cookies.guraneza_token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = await pool.query(
      `SELECT ht.*, 
        (SELECT COUNT(*) FROM help_ticket_responses htr WHERE htr.ticket_id = ht.id AND htr.is_admin = TRUE) as admin_responses_count,
        u.username as user_name,
        u.email as user_email
      FROM help_tickets ht 
      JOIN users u ON ht.user_id = u.id
      WHERE ht.user_id = $1 
      ORDER BY ht.created_at DESC`,
      [decoded.id]
    );
    res.json({ success: true, tickets: result.rows });
  } catch (err) {
    console.error("Error fetching tickets:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/help/tickets/all - Get ALL tickets (admin only)
router.get("/tickets/all", async (req, res) => {
  try {
    const token = req.cookies.guraneza_token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ success: false, message: "Admin only" });
    }

    const result = await pool.query(
      `SELECT ht.*, 
        (SELECT COUNT(*) FROM help_ticket_responses htr WHERE htr.ticket_id = ht.id) as total_responses,
        u.username as user_name,
        u.email as user_email
      FROM help_tickets ht 
      JOIN users u ON ht.user_id = u.id
      ORDER BY 
        CASE ht.status 
          WHEN 'open' THEN 1 
          WHEN 'in_progress' THEN 2 
          WHEN 'resolved' THEN 3 
          WHEN 'closed' THEN 4 
        END,
        ht.created_at DESC`
    );
    res.json({ success: true, tickets: result.rows });
  } catch (err) {
    console.error("Error fetching all tickets:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/help/tickets - Create new ticket
router.post("/tickets", async (req, res) => {
  try {
    const token = req.cookies.guraneza_token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { subject, message, category, priority } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ success: false, message: "Subject and message are required" });
    }

    const result = await pool.query(
      `INSERT INTO help_tickets (user_id, subject, message, category, priority) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [decoded.id, subject.trim(), message.trim(), category || "General", priority || "normal"]
    );

    res.json({ success: true, ticket: result.rows[0] });
  } catch (err) {
    console.error("Error creating ticket:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/help/tickets/:id - Update ticket status (admin only)
router.put("/tickets/:id", async (req, res) => {
  try {
    const token = req.cookies.guraneza_token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ success: false, message: "Admin only" });
    }

    const { status, priority } = req.body;
    const result = await pool.query(
      `UPDATE help_tickets 
       SET status = COALESCE($1, status), 
           priority = COALESCE($2, priority),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3 
       RETURNING *`,
      [status, priority, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Ticket not found" });
    }

    res.json({ success: true, ticket: result.rows[0] });
  } catch (err) {
    console.error("Error updating ticket:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==================== TICKET RESPONSES ====================

// GET /api/help/tickets/:id/responses - Get responses for a ticket
router.get("/tickets/:id/responses", async (req, res) => {
  try {
    const token = req.cookies.guraneza_token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const ticketCheck = await pool.query(
      "SELECT user_id FROM help_tickets WHERE id = $1",
      [req.params.id]
    );

    if (ticketCheck.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Ticket not found" });
    }

    if (ticketCheck.rows[0].user_id !== decoded.id && decoded.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const result = await pool.query(
      `SELECT htr.*, u.username, u.profile_picture, u.role
       FROM help_ticket_responses htr 
       JOIN users u ON htr.user_id = u.id 
       WHERE htr.ticket_id = $1 
       ORDER BY htr.created_at ASC`,
      [req.params.id]
    );

    res.json({ success: true, responses: result.rows });
  } catch (err) {
    console.error("Error fetching responses:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/help/tickets/:id/responses - Add response to ticket
router.post("/tickets/:id/responses", async (req, res) => {
  try {
    const token = req.cookies.guraneza_token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    const ticketCheck = await pool.query(
      "SELECT * FROM help_tickets WHERE id = $1",
      [req.params.id]
    );

    if (ticketCheck.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Ticket not found" });
    }

    const ticket = ticketCheck.rows[0];

    if (ticket.user_id !== decoded.id && decoded.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    if (ticket.status === "closed") {
      return res.status(400).json({ success: false, message: "Ticket is closed" });
    }

    const isAdmin = decoded.role === "admin";

    const result = await pool.query(
      `INSERT INTO help_ticket_responses (ticket_id, user_id, message, is_admin) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [req.params.id, decoded.id, message.trim(), isAdmin]
    );

    if (isAdmin && ticket.status === "open") {
      await pool.query(
        `UPDATE help_tickets SET status = 'in_progress', updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
        [req.params.id]
      );
    }

    const responseWithUser = await pool.query(
      `SELECT htr.*, u.username, u.profile_picture, u.role
       FROM help_ticket_responses htr 
       JOIN users u ON htr.user_id = u.id 
       WHERE htr.id = $1`,
      [result.rows[0].id]
    );

    res.json({ success: true, response: responseWithUser.rows[0] });
  } catch (err) {
    console.error("Error adding response:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==================== FAQs ====================

// GET /api/help/faqs - Get all active FAQs (public - no auth required)
router.get("/faqs", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM help_faqs WHERE is_active = TRUE ORDER BY sort_order ASC`
    );
    res.json({ success: true, faqs: result.rows });
  } catch (err) {
    console.error("Error fetching FAQs:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/help/faqs - Create FAQ (admin only)
router.post("/faqs", async (req, res) => {
  try {
    const token = req.cookies.guraneza_token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ success: false, message: "Admin only" });
    }

    const { question, answer, category, sort_order } = req.body;

    const result = await pool.query(
      `INSERT INTO help_faqs (question, answer, category, sort_order) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [question, answer, category, sort_order || 0]
    );

    res.json({ success: true, faq: result.rows[0] });
  } catch (err) {
    console.error("Error creating FAQ:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/help/faqs/:id - Update FAQ (admin only)
router.put("/faqs/:id", async (req, res) => {
  try {
    const token = req.cookies.guraneza_token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ success: false, message: "Admin only" });
    }

    const { question, answer, category, sort_order, is_active } = req.body;

    const result = await pool.query(
      `UPDATE help_faqs 
       SET question = COALESCE($1, question),
           answer = COALESCE($2, answer),
           category = COALESCE($3, category),
           sort_order = COALESCE($4, sort_order),
           is_active = COALESCE($5, is_active),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $6 
       RETURNING *`,
      [question, answer, category, sort_order, is_active, req.params.id]
    );

    res.json({ success: true, faq: result.rows[0] });
  } catch (err) {
    console.error("Error updating FAQ:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/help/faqs/:id - Delete FAQ (admin only)
router.delete("/faqs/:id", async (req, res) => {
  try {
    const token = req.cookies.guraneza_token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ success: false, message: "Admin only" });
    }

    await pool.query("DELETE FROM help_faqs WHERE id = $1", [req.params.id]);

    res.json({ success: true, message: "FAQ deleted" });
  } catch (err) {
    console.error("Error deleting FAQ:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;