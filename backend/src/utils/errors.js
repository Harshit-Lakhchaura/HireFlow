class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

function errorHandler(err, req, res, next) {
  if (err.code === 11000) {
    if (err.keyPattern?.job && err.keyPattern?.seeker) {
      return res.status(409).json({ message: "You already applied to this job" });
    }
    const field = Object.keys(err.keyPattern || {})[0] || "field";
    return res.status(409).json({ message: `${field} already exists` });
  }
  const status = err.statusCode || 500;
  const message = err.message || "Server error";
  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }
  res.status(status).json({ message });
}

module.exports = { ApiError, asyncHandler, errorHandler };
