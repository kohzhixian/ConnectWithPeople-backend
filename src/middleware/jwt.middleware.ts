import { NextFunction, Request, Response } from "express";
import { HttpError } from "./httpError.middleware";
import jwt from "jsonwebtoken";
import { StatusCode } from "../constants/global/global.constants";

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
    jwt.verify(token, String(process.env.JWT_TOKEN_SECRET));
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return next(new HttpError(StatusCode.UNAUTHORIZED, "Token has expired."));
    } else if (err instanceof jwt.JsonWebTokenError) {
      return next(new HttpError(StatusCode.FORBIDDEN, "Invalid token."));
    } else {
      return next(
        new HttpError(
          StatusCode.INTERNAL_SERVER_ERROR,
          "Internal server error."
        )
      );
    }
  }
}
