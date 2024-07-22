import { Router } from "express";
import messageController from "../controllers/message.controller";

const router = Router();

router.post("/createMessage", messageController.createMessage);

export default router;
