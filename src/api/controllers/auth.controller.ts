import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { loginDto, refreshTokenDto, registerDto } from "../../types/auth.type";
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

async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const loginDto: loginDto = req.body;
    const tokenData = await authService.login(loginDto);
    res.status(200).send({ tokenData: tokenData });
  } catch (err) {
    return next(err);
  }
}

async function refreshToken(req: Request, res: Response, next: NextFunction) {
  const refreshTokenDto: refreshTokenDto = req.body;
  try {
    const response = await authService.refreshToken(refreshTokenDto.userId);
    res.status(200).json(response);
  } catch (err) {
    return next(err);
  }
}

async function logout(req: Request, res: Response, next: NextFunction) {
  const { userId } = req.body;
  try {
    const response = await authService.logout(userId);
    res.status(200).json({ message: response });
  } catch (err) {
    return next(err);
  }
}

export default {
  register,
  login,
  refreshToken,
  logout,
};
