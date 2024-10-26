import { NextFunction, Request, Response } from "express";
import chatroomService from "../services/chatroom.service";
import { createChatroomDtoType } from "../../types/chatroom.type";
import { StatusCode } from "../../constants/global/global.constants";
import getUserIdFromToken from "../../utils/getUserIdFromToken";

async function createChatroom(req: Request, res: Response, next: NextFunction) {
  const createChatroomDto = req.body as createChatroomDtoType;
  try {
    const chatroomId = await chatroomService.createChatroom(createChatroomDto);
    res.status(StatusCode.OK).send({ chatroomId: chatroomId });
  } catch (err) {
    return next(err);
  }
}

async function getAllChatroomByUserId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = await getUserIdFromToken(req, res);
  try {
    const response = await chatroomService.getAllChatroomByUserId(userId);
    res.status(StatusCode.OK).send(response);
  } catch (err) {
    return next(err);
  }
}

async function getChatroomDetailsById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const chatroomId = String(req.query.chatroomId);
  try {
    const response = await chatroomService.getChatroomDetailsById(chatroomId);
    res.status(StatusCode.OK).send(response);
  } catch (err) {
    return next(err);
  }
}

export default {
  createChatroom,
  getAllChatroomByUserId,
  getChatroomDetailsById,
};
