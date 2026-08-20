import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
// import { apiLimiter } from "./middleware/rateLimiter.middleware.js";
import { notFound, errorHandler } from "./middleware/error.middleware.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import interviewRoutes from "./routes/interview.routes.js";
import authRoutes from "./routes/auth.routes.js";
import performanceRoutes from "./routes/performance.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import settingsRoutes from "./routes/settings.routes.js";
import passwordResetRoutes from "./routes/passwordReset.routes.js"
import path from "path";

const app = express();

app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use("/api", apiLimiter);

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "InterviewAI API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/auth", passwordResetRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/performance", performanceRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/uploads", express.static(path.resolve("uploads")));

// Future route mounts go here as features are added:
// app.use("/api/interviews", interviewRoutes);
// app.use("/api/performance", performanceRoutes);
// app.use("/api/profile", profileRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;