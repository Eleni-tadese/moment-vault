import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import pool from "../config/db.js";

const router = express.Router();
router.get("/", (req, res) => {
  res.json({ message: "Memories route working" });
});
const upload = multer({ dest: "uploads/" }); // temp storage


// Upload memory
router.post("/", upload.single("media"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { title, description, date, place, reason, tags, user_id } = req.body;

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "auto",
      folder: "momentvault",
    });

    const query = `
      INSERT INTO memories (title, description, date, place, reason, media_url, media_type, tags, user_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *;
    `;

    const values = [
      title,
      description || "",
      date,
      place || "",
      reason || "",
      result.secure_url,
      result.resource_type,
      tags ? tags.split(",") : [],
      user_id,
    ];

    const dbRes = await pool.query(query, values);
    res.json(dbRes.rows[0]);
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({
      error: "Memory upload failed",
      details: error.message,
    });
  }
});

export default router;
