import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
import app from "./app.js";

async function start() {
  await connectDB();

  app.listen(env.port, () => {
    console.log(`[server] InterviewAI API listening on port ${env.port} (${env.nodeEnv})`);
  });
}

start();