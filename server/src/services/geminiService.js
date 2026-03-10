import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../utils/env.js";
import { fetchWithTimeout } from "../utils/httpTimeout.js";

export async function runGemini(prompt) {
  if (!env.GEMINI_API_KEY) {
    const err = new Error("GEMINI_API_KEY is not configured");
    err.statusCode = 500;
    throw err;
  }

  const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: env.GEMINI_MODEL,
    generationConfig: {
      temperature: 0.2,
      topP: 0.9,
      // Keep enough budget to avoid truncated JSON
      maxOutputTokens: 3072,
      // Ask Gemini API for JSON-only output when supported
      responseMimeType: "application/json"
    }
  });

  const result = await fetchWithTimeout(
    async (signal) => {
      // Pass requestOptions as the 2nd argument (NOT inside the JSON payload).
      return await model.generateContent(
        { contents: [{ role: "user", parts: [{ text: prompt }] }] },
        signal ? { signal } : undefined
      );
    },
    env.GEMINI_TIMEOUT_MS
  );

  const text = result?.response?.text?.() || "";
  return text.trim();
}

