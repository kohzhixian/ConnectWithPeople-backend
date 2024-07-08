import { Router } from "express";
import { registerInputsValidation } from "../../validations/authValidations";
import authController from "../controllers/auth.controller";
const router = Router();

router.post(
  "/auth/register",
  registerInputsValidation,
  authController.register
);

router.post("/auth/login", authController.login);

router.post("/auth/refreshToken", authController.refreshToken);

router.patch("/auth/logout", authController.logout);

export default router;
