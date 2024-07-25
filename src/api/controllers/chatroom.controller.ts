import { NextFunction, Request, Response } from "express";
import chatroomService from "../services/chatroom.service";
import { createChatroomDtoType } from "../../types/chatroom.type";
import { StatusCode } from "../../constants/global/global.constants";

async function createChatroom(req: Request, res: Response, next: NextFunction) {
  const createChatroomDto = req.body as createChatroomDtoType;
  try {
    const response = await chatroomService.createChatroom(createChatroomDto);
    res.status(StatusCode.OK).send(response);
  } catch (err) {
    return next(err);
  }
}

export default {
  createChatroom,
};
