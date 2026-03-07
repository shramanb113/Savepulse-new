import jwt from "jsonwebtoken";
import { Request, Response } from "express";

export default async function getUserData(req: Request, res: Response) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) return res.status(401).json({ message: "No token" });

    const token = authHeader.split(" ")[1]; // Bearer <token>
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    // decoded contains { userId, email, iat, exp }
    return res.json({
      userId: decoded.userId,
    });
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Invalid token" });
  }
}