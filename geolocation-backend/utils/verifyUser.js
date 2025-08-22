import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  console.log("Extracted token:", token);
  console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);

  if (!token) return next(errorHandler(401, "Unauthorized"));
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    console.log("user", user);
    console.log("JWT verification error:", err);
    console.log("Decoded user:", user);

    if (err) return next(errorHandler(403, "Invalid Token"));
    req.user = user;
    next(); //
  });
};
