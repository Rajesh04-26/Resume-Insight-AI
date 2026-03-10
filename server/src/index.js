import dotenv from "dotenv";
dotenv.config();

import http from "http";
import { connectDb } from "./utils/connectDb.js";
import { createApp } from "./app.js";
import { env } from "./utils/env.js";
import { logger } from "./utils/logger.js";

async function main() {
  await connectDb(env.MONGODB_URI);
  const app = createApp();
  const server = http.createServer(app);

  server.listen(env.PORT, () => {
    logger.info(`API listening on http://localhost:${env.PORT}`);
  });
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

