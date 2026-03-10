import axios from "axios";
import { env } from "../utils/env.js";

export async function runOllama(prompt) {
  const url = `${env.OLLAMA_BASE_URL.replace(/\/+$/, "")}/api/generate`;
  const res = await axios.post(
    url,
    {
      model: env.OLLAMA_MODEL,
      prompt,
      stream: false,
      options: {
        temperature: 0.2
      }
    },
    {
      timeout: env.OLLAMA_TIMEOUT_MS,
      headers: { "Content-Type": "application/json" }
    }
  );

  const text = (res?.data?.response || "").trim();
  return text;
}

