import { Router } from "express";
import { registerInputsValidation } from "../../validations/authValidations";
import authController from "../controllers/auth.controller";
const router = Router();

router.post(
  "/auth/register",
  registerInputsValidation,
  authController.register
);

export default router;
