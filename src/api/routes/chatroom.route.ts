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

router.get("/check-if-chatroom-exist", chatroomController.checkIfChatroomExist);

router.get("/get-users-in-chatroom", chatroomController.getUsersInChatroom);

export default router;
