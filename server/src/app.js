import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { env } from "./utils/env.js";
import { apiLimiter } from "./middleware/rateLimit.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";

import { healthRouter } from "./routes/healthRoutes.js";
import { resumeRouter } from "./routes/resumeRoutes.js";
import { analyzeRouter } from "./routes/analyzeRoutes.js";
import { reportRouter } from "./routes/reportRoutes.js";

export function createApp() {
  const app = express();

  app.use(
    cors({
      // Allow any origin in dev so Vite can move ports without CORS issues
      origin: true,
      credentials: true
    })
  );
  app.use(helmet());
  app.use(morgan("dev"));
  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(apiLimiter);

  app.use("/api/health", healthRouter);
  app.use("/api/resume", resumeRouter);
  app.use("/api/analyze", analyzeRouter);
  app.use("/api/report", reportRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

