const pool = require("../config/db");
const jwt = require("jsonwebtoken");

const getAllProducts = async (req, res) => {
  try {
    const { owner_id, category } = req.query;
    
    let query = `
      SELECT 
        p.*,
        u.username as owner_name,
        u.location as owner_location,
        u.created_at as owner_created_at,
        u.is_verified as owner_verified,
        u.profile_picture as owner_picture,
        u.email as owner_email,
        s.shop_name,
        s.is_verified as shop_verified,
        sub.plan_name as owner_plan,
        sub.verified_seller_badge,
        sub.verified_product_badge,
        sub.premium_badge,
        sub.shop_badge,
        sub.vip_badge,
        COALESCE(
          (SELECT json_agg(pi.image_url ORDER BY pi.position)
           FROM product_images pi
           WHERE pi.product_id = p.id),
          '[]'::json
        ) as image_urls
      FROM products p
      LEFT JOIN users u ON p.owner_id = u.id
      LEFT JOIN shops s ON p.shop_id = s.id
      LEFT JOIN subscriptions sub ON u.subscription_id = sub.id
      WHERE p.is_deleted = FALSE
    `;
    
    const params = [];
    
    if (owner_id) {
      params.push(owner_id);
      query += ` AND p.owner_id = $${params.length}`;
    }
    
    if (category) {
      params.push(category);
      query += ` AND p.category = $${params.length}`;
    }
    
    query += " ORDER BY p.created_at DESC";
    
    const result = await pool.query(query, params);

    res.status(200).json({ 
      success: true, 
      products: result.rows 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products"
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT 
        p.*,
        u.username as owner_name,
        u.email as owner_email,
        u.profile_picture as owner_picture,
        u.created_at as owner_created_at,
        u.location as owner_location,
        u.phone_number as owner_phone,
        s.shop_name,
        s.is_verified as shop_verified,
        sub.plan_name as owner_plan,
        sub.verified_seller_badge,
        sub.verified_product_badge,
        sub.premium_badge,
        sub.shop_badge,
        sub.vip_badge
      FROM products p
      LEFT JOIN users u ON p.owner_id = u.id
      LEFT JOIN shops s ON p.shop_id = s.id
      LEFT JOIN subscriptions sub ON u.subscription_id = sub.id
      WHERE p.id = $1 AND p.is_deleted = FALSE`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }
    
    const imagesResult = await pool.query(
      'SELECT * FROM product_images WHERE product_id = $1 ORDER BY position',
      [id]
    );
    
    const product = {
      ...result.rows[0],
      images: imagesResult.rows
    };
    
    res.status(200).json({ 
      success: true, 
      product
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product"
    });
  }
};

const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      negotiable,
      stock_quantity,
      owner_id,
      shop_id,
      image_urls,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO products
      (name, description, price, category, negotiable, stock_quantity, owner_id, shop_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [name, description, price, category, negotiable || false, stock_quantity || 1, owner_id, shop_id || null]
    );

    if (image_urls && image_urls.length > 0) {
      const productId = result.rows[0].id;
      for (let i = 0; i < image_urls.length; i++) {
        await pool.query(
          `INSERT INTO product_images (product_id, image_url, position)
           VALUES ($1, $2, $3)`,
          [productId, image_urls[i], i + 1]
        );
      }
    }

    res.status(201).json({ 
      success: true, 
      product: result.rows[0] 
    });

  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create product"
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const token = req.cookies.guraneza_token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = req.params;
    const {
      name,
      description,
      price,
      category,
      negotiable,
      stock_quantity,
      image_urls,
    } = req.body;

    const productCheck = await pool.query(
      "SELECT * FROM products WHERE id = $1 AND owner_id = $2",
      [id, decoded.id]
    );

    if (productCheck.rows.length === 0) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const result = await pool.query(
      `UPDATE products 
       SET name = $1, description = $2, price = $3, category = $4, 
           negotiable = $5, stock_quantity = $6, updated_at = CURRENT_TIMESTAMP
       WHERE id = $7 AND owner_id = $8
       RETURNING *`,
      [name, description, price, category, negotiable, stock_quantity, id, decoded.id]
    );

    if (image_urls && image_urls.length > 0) {
      await pool.query("DELETE FROM product_images WHERE product_id = $1", [id]);
      for (let i = 0; i < image_urls.length; i++) {
        await pool.query(
          `INSERT INTO product_images (product_id, image_url, position)
           VALUES ($1, $2, $3)`,
          [id, image_urls[i], i + 1]
        );
      }
    }

    res.json({ 
      success: true, 
      product: result.rows[0],
      message: "Product updated successfully" 
    });

  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update product"
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const token = req.cookies.guraneza_token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = req.params;

    const product = await pool.query(
      "SELECT * FROM products WHERE id = $1 AND owner_id = $2",
      [id, decoded.id]
    );

    if (product.rows.length === 0) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    await pool.query(
      "UPDATE products SET is_deleted = TRUE WHERE id = $1",
      [id]
    );

    res.json({ success: true, message: "Product deleted" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ success: false, message: "Failed to delete" });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};