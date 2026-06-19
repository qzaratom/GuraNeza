const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const pool = require("../config/db");

const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    const response = await fetch(
      `https://www.googleapis.com/oauth2/v3/userinfo`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const userInfo = await response.json();
    const { sub, email, name, picture } = userInfo;

    let user = await pool.query("SELECT * FROM users WHERE google_id = $1", [sub]);

    if (user.rows.length === 0) {
      const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
      if (existingUser.rows.length > 0) {
        user = await pool.query(
          "UPDATE users SET google_id = $1, profile_picture = $2 WHERE email = $3 RETURNING *",
          [sub, picture, email]
        );
      } else {
        user = await pool.query(
          "INSERT INTO users (email, username, profile_picture, google_id, role, is_verified, subscription_type) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
          [email, name, picture, sub, "user", false, "free"]
        );
      }
    }

    const jwtToken = jwt.sign(
      { id: user.rows[0].id, email: user.rows[0].email, role: user.rows[0].role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("guraneza_token", jwtToken, {
      httpOnly: true, secure: false, sameSite: "lax", maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password_hash, ...userWithoutPassword } = user.rows[0];
    res.json({ success: true, user: userWithoutPassword });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Google Authentication Failed" });
  }
};

const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ success: false, message: "An account with this email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const username = email.split("@")[0];

    const user = await pool.query(
      "INSERT INTO users (email, username, password_hash, role, is_verified, subscription_type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [email, username, hashedPassword, "user", false, "free"]
    );

    const jwtToken = jwt.sign(
      { id: user.rows[0].id, email: user.rows[0].email, role: user.rows[0].role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("guraneza_token", jwtToken, {
      httpOnly: true, secure: false, sameSite: "lax", maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password_hash, ...userWithoutPassword } = user.rows[0];
    res.status(201).json({ success: true, user: userWithoutPassword });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Registration failed" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (user.rows.length === 0) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    if (!user.rows[0].password_hash) {
      return res.status(401).json({ success: false, message: "This account uses Google Sign-In. Please sign in with Google." });
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
    if (!validPassword) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const jwtToken = jwt.sign(
      { id: user.rows[0].id, email: user.rows[0].email, role: user.rows[0].role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("guraneza_token", jwtToken, {
      httpOnly: true, secure: false, sameSite: "lax", maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password_hash, ...userWithoutPassword } = user.rows[0];
    res.json({ success: true, user: userWithoutPassword });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Login failed" });
  }
};

const checkAuth = async (req, res) => {
  try {
    const token = req.cookies.guraneza_token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await pool.query("SELECT * FROM users WHERE id = $1", [decoded.id]);

    if (user.rows.length === 0) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    const { password_hash, ...userWithoutPassword } = user.rows[0];
    res.json({ success: true, user: userWithoutPassword });
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

const logout = async (req, res) => {
  res.cookie("guraneza_token", "", { httpOnly: true, expires: new Date(0) });
  res.json({ success: true, message: "Logged out" });
};

const updateProfile = async (req, res) => {
  try {
    const token = req.cookies.guraneza_token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { username, phone_number, location, bio } = req.body;

    const result = await pool.query(
      `UPDATE users 
       SET username = $1, phone_number = $2, location = $3, bio = $4, updated_at = CURRENT_TIMESTAMP
       WHERE id = $5 
       RETURNING id, email, username, phone_number, location, bio, profile_picture, google_id, is_verified, subscription_type, role, created_at, updated_at`,
      [username, phone_number || null, location || null, bio || null, decoded.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user: result.rows[0], message: "Profile updated successfully" });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ success: false, message: "Failed to update profile" });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const token = req.cookies.guraneza_token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await pool.query("DELETE FROM users WHERE id = $1", [decoded.id]);

    res.clearCookie("guraneza_token");
    res.json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({ success: false, message: "Failed to delete account" });
  }
};

module.exports = {
  googleLogin,
  register,
  login,
  checkAuth,
  logout,
  updateProfile,
  deleteAccount,
};