import mongoose from "mongoose";
import { logger } from "./logger.js";

export async function connectDb(uri) {
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
  logger.info("MongoDB connected");
}

