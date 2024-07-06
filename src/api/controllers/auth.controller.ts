import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { registerDto } from "../../types/auth.type";
import authService from "../services/auth.service";
import { loginDto } from "../../types/auth.type";

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

async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const loginDto: loginDto = req.body;
    const tokenData = await authService.login(loginDto);
    res.status(200).send({ tokenData: tokenData });
  } catch (err) {
    return next(err);
  }
}

export default {
  register,
  login,
};
