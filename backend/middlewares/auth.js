import jwt from "jsonwebtoken";

export const authenticateRole = (allowedRoles) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ message: "Forbidden access" });
      }
      req.user = decoded;
      next();
    } catch (error) {
      console.error("❌ Authentication error:", error);
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};
