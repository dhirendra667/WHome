const errorMiddleware = (err, _req, res, _next) => {
  // Log for debugging
  console.error("🔥 Error caught by middleware:", err);

  // Default values
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong";

  // Handle AppError (custom error class)
  if (err.name === "AppError") {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Handle JWT Errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token. Please log in again.";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Your token has expired. Please log in again.";
  }

  // Handle Multer Errors
  if (err.name === "MulterError") {
    statusCode = 400;
    if (err.code === "LIMIT_FILE_SIZE") {
      message = "File too large. Max allowed size is 50MB.";
    } else {
      message = `File upload error: ${err.message}`;
    }
  }

  // Handle generic file upload errors
  if (err.message && err.message.startsWith("Unsupported file type!")) {
    statusCode = 400;
  }

  //  Handle validation or other DB-related errors (optional)
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors).map(e => e.message).join(", ");
  }

  // Final response
  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

export default errorMiddleware;
