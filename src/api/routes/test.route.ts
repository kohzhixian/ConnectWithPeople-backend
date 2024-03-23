import { Router } from "express";
import test from "../controllers/test.controller";
const router = Router();

router.get("/test", test);

export default router;
