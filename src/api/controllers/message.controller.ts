import { NextFunction, Request, Response } from "express";
import getUserIdFromToken from "../../utils/getUserIdFromToken";
import messageService from "../services/message.service";
import { StatusCode } from "../../constants/global/global.constants";
import { getAllMessageByChatroomIdDtoType } from "../../types/message.type";

async function createMessage(req: Request, res: Response, next: NextFunction) {
  const user_id = await getUserIdFromToken(req, res);
  const createMessageReqBody = req.body;
  try {
    const response = await messageService.createMessage({
      createMessageReqBody,
      user_id,
    });
    res.status(StatusCode.OK).send(response);
  } catch (err) {
    return next(err);
  }
}

async function getAllMessageByChatroomId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const getAllMessageByChatroomIdDto =
    req.body as getAllMessageByChatroomIdDtoType;
  try {
    const response = await messageService.getAllMessageByChatroomId(
      getAllMessageByChatroomIdDto
    );
    res.status(StatusCode.OK).send(response);
  } catch (err) {
    return next(err);
  }
}

export default {
  createMessage,
  getAllMessageByChatroomId,
};
