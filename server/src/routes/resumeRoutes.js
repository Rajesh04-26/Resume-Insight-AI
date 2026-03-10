import { Router } from "express";
import { upload } from "../middleware/upload.js";
import { uploadResume } from "../controllers/resumeController.js";

export const resumeRouter = Router();

resumeRouter.post("/upload", upload.single("file"), uploadResume);

