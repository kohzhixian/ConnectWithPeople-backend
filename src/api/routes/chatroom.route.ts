import { Router } from "express";
import chatroomController from "../controllers/chatroom.controller";

const router = Router();

router.post("/createChatroom", chatroomController.createChatroom);
router.get(
  "/getAllChatroomByUserId",
  chatroomController.getAllChatroomByUserId
);

router.get(
  "/getChatroomDetailsById",
  chatroomController.getChatroomDetailsById
);

export default router;
