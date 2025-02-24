import { Request, Response, NextFunction } from "express";

async function testProtected(req: Request, res: Response, next: NextFunction) {
  try {
    res.send({ message: "testing" });
  } catch (err) {
    console.error(err);
    next(err);
  }
}

export default { testProtected };
