import { Router } from "express";
import messageController from "../controllers/message.controller";

const router = Router();

router.post("/createMessage", messageController.createMessage);
router.get(
  "/getAllMessageByChatroomId",
  messageController.getAllMessageByChatroomId
);

router.get(
  "/getAllMessageLinkedToUser",
  messageController.getAllMessageLinkedToUser
);

router.get(
  "/getLatestMsgForAllChatroomLinkedToUser",
  messageController.getLatestMsgForAllChatroomLinkedToUser
);

export default router;
