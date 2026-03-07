import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.JWT_SECRET!;

/**
 * Middleware: Authenticate a User.
 * Reads JWT from `Authorization: Bearer <token>` header or `token` cookie.
 * On success, attaches `req.user = { userId, email }`.
 */
export function authenticateUser(req: Request, res: Response, next: NextFunction) {
  const token = extractUserToken(req);

  if (!token) {
    return res.status(401).json({ message: "Authentication required. Please log in." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    req.user = { userId: decoded.userId, email: decoded.email };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token. Please log in again." });
  }
}

/**
 * Middleware: Authenticate a Hospital.
 * Reads JWT from `hospital_token` cookie.
 * On success, attaches `req.hospital = { hospitalId, name }`.
 */
export function authenticateHospital(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.hospital_token;

  if (!token) {
    return res.status(401).json({ message: "Authentication required. Please log in as a hospital." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { hospitalId: number; name: string };
    req.hospital = { hospitalId: decoded.hospitalId, name: decoded.name };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token. Please log in again." });
  }
}

/** Extract user token from Authorization header or cookie */
function extractUserToken(req: Request): string | null {
  // 1. Try Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }

  // 2. Try cookie
  if (req.cookies?.token) {
    return req.cookies.token;
  }

  return null;
}
