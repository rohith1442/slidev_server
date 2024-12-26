import multer from "multer";
import path from "path";
import fs from "fs";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, "../../uploads");
const distDir = path.join(__dirname, "../../dist");
const backupDir = path.join(__dirname, "../../backup");


if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Middleware function to handle file uploads
export const fileUpload = async (req, res, next) => {
  try {
    // Use multer to handle file uploads
    upload.array("files", 10)(req, res, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "File upload failed", error: err });
      }
      next();
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};
