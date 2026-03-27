// Backend/Route/galleryRoute.js
const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

// ✅ IMPORTANT: Your folder in screenshot is "Gallery" (capital G)
// If your real folder name is different, change only this line.
const uploadsGalleryDir = path.join(__dirname, "..", "uploads", "Gallery");

// Image and video extensions
const IMAGE_EXT = /\.(jpe?g|png|gif|webp|bmp)$/i;
const VIDEO_EXT = /\.(mp4|webm|ogg|mov|avi|mkv)$/i;

// GET /api/gallery — list all photos and videos from uploads/Gallery folder
router.get("/", (req, res) => {
  try {
    // If folder not exists, create it and return empty
    if (!fs.existsSync(uploadsGalleryDir)) {
      fs.mkdirSync(uploadsGalleryDir, { recursive: true });
      return res.json({ files: [] });
    }

    const files = fs.readdirSync(uploadsGalleryDir);

    const media = files
      .filter((name) => IMAGE_EXT.test(name) || VIDEO_EXT.test(name))
      .map((filename) => {
        const isVideo = VIDEO_EXT.test(filename);
        return {
          name: filename,
          type: isVideo ? "video" : "image",
          // ✅ This URL works because app.js serves: app.use("/uploads", express.static(...))
          url: `/uploads/Gallery/${encodeURIComponent(filename)}`,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name)); // A-Z (you can change if you want)

    res.json({ files: media });
  } catch (err) {
    res.status(500).json({ message: err.message, files: [] });
  }
});

module.exports = router;
