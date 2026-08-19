import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

export function notFound(req, res, next) {
  next(ApiError.notFound(`Route not found: ${req.originalUrl}`));
}

export function errorHandler(err, req, res, next) {
  let error = err;

  if (err.name === "CastError") {
    error = ApiError.badRequest("Invalid resource ID");
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    error = ApiError.conflict(`${field} already in use`);
  }

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    error = ApiError.badRequest("Validation failed", messages);
  }

  const statusCode = error.statusCode || 500;
  const message = error.isOperational ? error.message : "Something went wrong";

  res.status(statusCode).json({
    success: false,
    message,
    details: error.details || undefined,
    stack: env.nodeEnv === "development" ? err.stack : undefined,
  });
}