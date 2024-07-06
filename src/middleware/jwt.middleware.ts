import { NextFunction, Request, Response } from "express";
import { HttpError } from "./httpError.middleware";
import jwt from "jsonwebtoken";

require("dotenv").config({ path: ".env.dev" });
export default async function jwtMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return next(new HttpError(401, "No token found."));
  }
  try {
    const userObj = jwt.verify(token, String(process.env.JWT_TOKEN_SECRET));
    next();
  } catch (err) {
    const error = new HttpError(403, "Invalid token");
    return next(error);
  }
}
