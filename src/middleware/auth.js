/**
 * Middleware to verify bearer token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      error: "No authorization header",
    });
  }

  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer") {
    return res.status(401).json({
      success: false,
      error: "Invalid authorization type",
    });
  }

  if (token !== process.env.INTERNAL_SECRET) {
    return res.status(401).json({
      success: false,
      error: "Invalid token",
    });
  }

  next();
}
