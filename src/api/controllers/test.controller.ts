import { NextFunction, Request, Response } from "express";

export default function test(req: Request, res: Response, next: NextFunction) {
  try {
    res.send({ message: "testing" });
  } catch (err) {
    next(err);
  }
}
