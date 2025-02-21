import { Request, Response } from "express";

export async function webhook(req: Request, res: Response) {
  const body = req.body;

  console.log({ body });

  res.status(202).json({ message: "success" });
}
