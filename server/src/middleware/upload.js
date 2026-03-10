import multer from "multer";
import { env } from "../utils/env.js";

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ok =
      file.mimetype === "application/pdf" ||
      file.originalname.toLowerCase().endsWith(".pdf");
    if (!ok) return cb(new Error("Only PDF uploads are supported"), false);
    cb(null, true);
  }
});

