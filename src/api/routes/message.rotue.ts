import { Router } from "express";
import messageController from "../controllers/message.controller";

const router = Router();

router.post("/createMessage", messageController.createMessage);
router.get(
  "/getAllMessageByChatroomId",
  messageController.getAllMessageByChatroomId
);

export default router;
