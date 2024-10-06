import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../../constants/global/global.constants";
import getUserIdFromToken from "../../utils/getUserIdFromToken";
import messageService from "../services/message.service";

async function createMessage(req: Request, res: Response, next: NextFunction) {
  const user_id = await getUserIdFromToken(req, res);
  const createMessageReqBody = req.body;

  try {
    const messageId = await messageService.createMessage({
      createMessageReqBody,
      user_id,
    });
    res
      .status(StatusCode.OK)
      .send({ message: "message sent", messageId: messageId });
  } catch (err) {
    return next(err);
  }
}

async function getAllMessageLinkedToUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user_id = await getUserIdFromToken(req, res);
  try {
    const response = await messageService.getAllMessageLinkedToUser(user_id);
    res.status(StatusCode.OK).send(response);
  } catch (err) {
    return next(err);
  }
}

async function getLatestMsgForAllChatroomLinkedToUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user_id = await getUserIdFromToken(req, res);
  try {
    const allMessages = await messageService.getAllMessageLinkedToUser(user_id);
    const response =
      await messageService.getLatestMsgForAllChatroomLinkedToUser(allMessages);
    res.status(StatusCode.OK).send(response);
  } catch (err) {
    return next(err);
  }
}

export default {
  createMessage,
  getAllMessageLinkedToUser,
  getLatestMsgForAllChatroomLinkedToUser,
};
