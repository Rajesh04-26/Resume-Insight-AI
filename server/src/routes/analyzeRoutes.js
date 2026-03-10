import { Router } from "express";
import { analyzeResume } from "../controllers/analyzeController.js";

export const analyzeRouter = Router();

analyzeRouter.post("/", analyzeResume);

