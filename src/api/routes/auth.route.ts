import { Router } from "express";
import { registerInputsValidation } from "../../validations/authValidations";
import authController from "../controllers/auth.controller";
const router = Router();

router.post("/register", registerInputsValidation, authController.register);

router.post("/login", authController.login);

router.post("/refreshToken", authController.refreshToken);

router.patch("/logout", authController.logout);

export default router;
