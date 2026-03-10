import { Router } from "express";
import { getReport } from "../controllers/reportController.js";

export const reportRouter = Router();

reportRouter.get("/:id", getReport);

