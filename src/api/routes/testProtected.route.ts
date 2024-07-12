import { Router } from "express";
import testProtectedController from "../controllers/testProtected.controller";

const router = Router();

router.get("/testProtected", testProtectedController.testProtected);

export default router;
