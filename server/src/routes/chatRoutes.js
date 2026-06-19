const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const jwt = require("jsonwebtoken");

// Get all conversations for the logged-in user
router.get("/conversations", async (req, res) => {
  try {
    const token = req.cookies.guraneza_token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = await pool.query(
      `SELECT 
        c.*,
        u1.username as user1_name,
        u1.profile_picture as user1_picture,
        u1.email as user1_email,
        u1.location as user1_location,
        u1.created_at as user1_created_at,
        u2.username as user2_name,
        u2.profile_picture as user2_picture,
        u2.email as user2_email,
        u2.location as user2_location,
        u2.created_at as user2_created_at,
        (SELECT message FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message,
        (SELECT created_at FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message_time,
        (SELECT COUNT(*) FROM messages WHERE conversation_id = c.id AND sender_id != $1 AND is_read = false) as unread_count
      FROM conversations c
      LEFT JOIN users u1 ON c.user1_id = u1.id
      LEFT JOIN users u2 ON c.user2_id = u2.id
      WHERE c.user1_id = $1 OR c.user2_id = $1
      ORDER BY last_message_time DESC NULLS LAST`,
      [decoded.id]
    );

    // Get total unread count
    const totalUnread = result.rows.reduce((sum, conv) => sum + parseInt(conv.unread_count || 0), 0);

    res.json({ success: true, conversations: result.rows, totalUnread });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch conversations" });
  }
});

// Get total unread count
router.get("/unread", async (req, res) => {
  try {
    const token = req.cookies.guraneza_token;
    if (!token) {
      return res.json({ success: true, unreadCount: 0 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = await pool.query(
      `SELECT COUNT(*) FROM messages m
       JOIN conversations c ON m.conversation_id = c.id
       WHERE (c.user1_id = $1 OR c.user2_id = $1)
       AND m.sender_id != $1
       AND m.is_read = false`,
      [decoded.id]
    );

    res.json({ success: true, unreadCount: parseInt(result.rows[0].count) });
  } catch (error) {
    console.error("Chat error:", error);
    res.json({ success: true, unreadCount: 0 });
  }
});

// Start or get a conversation
router.post("/conversations", async (req, res) => {
  try {
    const token = req.cookies.guraneza_token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { otherUserId } = req.body;

    if (decoded.id === otherUserId) {
      return res.status(400).json({ success: false, message: "Cannot chat with yourself" });
    }

    const existing = await pool.query(
      `SELECT * FROM conversations 
       WHERE (user1_id = $1 AND user2_id = $2) 
          OR (user1_id = $2 AND user2_id = $1)`,
      [decoded.id, otherUserId]
    );

    if (existing.rows.length > 0) {
      return res.json({ success: true, conversation: existing.rows[0] });
    }

    const result = await pool.query(
      `INSERT INTO conversations (user1_id, user2_id) VALUES ($1, $2) RETURNING *`,
      [decoded.id, otherUserId]
    );

    res.json({ success: true, conversation: result.rows[0] });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ success: false, message: "Failed to create conversation" });
  }
});

// Delete a conversation
router.delete("/conversations/:id", async (req, res) => {
  try {
    const token = req.cookies.guraneza_token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = req.params;

    // Verify user is part of conversation
    const conv = await pool.query(
      "SELECT * FROM conversations WHERE id = $1 AND (user1_id = $2 OR user2_id = $2)",
      [id, decoded.id]
    );

    if (conv.rows.length === 0) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    // Delete messages first
    await pool.query("DELETE FROM messages WHERE conversation_id = $1", [id]);
    // Delete conversation
    await pool.query("DELETE FROM conversations WHERE id = $1", [id]);

    res.json({ success: true, message: "Conversation deleted" });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ success: false, message: "Failed to delete conversation" });
  }
});

// Get messages for a conversation
router.get("/conversations/:id/messages", async (req, res) => {
  try {
    const token = req.cookies.guraneza_token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = req.params;

    const conv = await pool.query(
      "SELECT * FROM conversations WHERE id = $1 AND (user1_id = $2 OR user2_id = $2)",
      [id, decoded.id]
    );

    if (conv.rows.length === 0) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    // Mark messages as read
    await pool.query(
      "UPDATE messages SET is_read = true WHERE conversation_id = $1 AND sender_id != $2 AND is_read = false",
      [id, decoded.id]
    );

    const result = await pool.query(
      `SELECT m.*, u.username as sender_name, u.profile_picture as sender_picture
       FROM messages m
       LEFT JOIN users u ON m.sender_id = u.id
       WHERE m.conversation_id = $1
       ORDER BY m.created_at ASC`,
      [id]
    );

    res.json({ success: true, messages: result.rows });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch messages" });
  }
});

// Send a message
router.post("/messages", async (req, res) => {
  try {
    const token = req.cookies.guraneza_token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { conversation_id, message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: "Message cannot be empty" });
    }

    const conv = await pool.query(
      "SELECT * FROM conversations WHERE id = $1 AND (user1_id = $2 OR user2_id = $2)",
      [conversation_id, decoded.id]
    );

    if (conv.rows.length === 0) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const result = await pool.query(
      `INSERT INTO messages (conversation_id, sender_id, message) VALUES ($1, $2, $3) RETURNING *`,
      [conversation_id, decoded.id, message.trim()]
    );

    const sender = await pool.query(
      "SELECT username, profile_picture FROM users WHERE id = $1",
      [decoded.id]
    );

    res.json({
      success: true,
      message: {
        ...result.rows[0],
        sender_name: sender.rows[0].username,
        sender_picture: sender.rows[0].profile_picture,
      }
    });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ success: false, message: "Failed to send message" });
  }
});

module.exports = router;