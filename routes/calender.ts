import express, { NextFunction, Request, Response } from "express";
import { createCalendar, getCalendars } from "../controllers/calenders";
import authMiddleware, { IReq } from "../middlewares/auth";

const router = express.Router();

router.get("/", (req, res) => wrapper(req, res, getCalendars));
router.get("/create", (req, res) => wrapper(req, res, createCalendar));

function wrapper(
  req: Request,
  res: Response,
  func: (req: IReq, res: Response) => Promise<void>
) {
  return func(req as IReq, res);
}

export function authWrapper(req: Request, res: Response, next: NextFunction) {
  return authMiddleware(req as IReq, res, next);
}

export default router;
