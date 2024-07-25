import { Router } from "express";
import chatroomController from "../controllers/chatroom.controller";

const router = Router();

router.post("/createChatroom", chatroomController.createChatroom);

export default router;
