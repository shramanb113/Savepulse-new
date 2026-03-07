import { Request, Response } from "express";

/**
 * GET /user/data
 * Protected by authenticateUser middleware — req.user is guaranteed.
 */
export default async function getUserData(req: Request, res: Response) {
  return res.json({
    userId: req.user!.userId,
  });
}