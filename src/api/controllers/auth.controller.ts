import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { registerDto } from "../../types/auth.type";
import authService from "../services/auth.service";

async function register(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const registerDto: registerDto = req.body;
    await authService.register(registerDto);
    res.status(200).send({ message: "Registration successful!" });
  } catch (err) {
    return next(err);
  }
}

export default {
  register,
};
