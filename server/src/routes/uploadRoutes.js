const express = require("express");
const router = express.Router();
const cloudinary = require("../config/cloudinary");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }
  },
});

// Upload single image
router.post("/single", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image uploaded" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "guraneza/shops",
    });

    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, message: "Image upload failed" });
  }
});

// Upload multiple images
router.post("/multiple", upload.array("images", 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "No images uploaded" });
    }

    const uploadPromises = req.files.map((file) =>
      cloudinary.uploader.upload(file.path, {
        folder: "guraneza/products",
      })
    );

    const results = await Promise.all(uploadPromises);

    req.files.forEach((file) => {
      try { fs.unlinkSync(file.path); } catch (e) {}
    });

    const images = results.map((result) => ({
      url: result.secure_url,
      publicId: result.public_id,
    }));

    res.json({ success: true, images });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, message: "Image upload failed" });
  }
});

module.exports = router;