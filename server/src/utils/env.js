import dotenv from "dotenv";
import { z } from "zod";

// Ensure .env is loaded before we read from process.env
dotenv.config();

const schema = z.object({
  PORT: z.coerce.number().default(5001),
  CLIENT_ORIGIN: z.string().default("http://localhost:5173"),
  MONGODB_URI: z
    .string()
    .default("mongodb://127.0.0.1:27017/ai-resume-analyzer"),

  GEMINI_API_KEY: z.string().optional(),
  GEMINI_MODEL: z.string().default("gemini-2.5-flash"),
  GEMINI_TIMEOUT_MS: z.coerce.number().default(20000),

  OLLAMA_BASE_URL: z.string().default("http://127.0.0.1:11434"),
  OLLAMA_MODEL: z.string().default("llama3.1"),
  OLLAMA_TIMEOUT_MS: z.coerce.number().default(25000),
});

export const env = schema.parse(process.env);

