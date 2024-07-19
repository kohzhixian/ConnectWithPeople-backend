import { Request, Response } from "express";
import { StatusCode } from "../constants/global/global.constants";
import jwt from "jsonwebtoken";
import { HttpError } from "../middleware/httpError.middleware";
import { tokenDataType } from "../types/auth.type";

export default async function getUserIdFromToken(req: Request, res: Response) {
  const token =
    req.headers["authorization"] && req.headers["authorization"].split(" ")[1];

  if (!token) {
    throw new HttpError(StatusCode.UNAUTHORIZED, "No token provided");
  }

  const decodedToken = jwt.verify(
    token,
    String(process.env.JWT_TOKEN_SECRET)
  ) as tokenDataType;

  return decodedToken.userId;
}
