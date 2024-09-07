import { EntityManager, MikroORM } from "@mikro-orm/mysql";
import databaseLoader from "../../loaders/database.loader";
import {
  createMessageDtoType,
  getAllMessageByChatroomIdDtoType,
} from "../../types/message.type";
import { User } from "../../entities/User.entity";
import { HttpError } from "../../middleware/httpError.middleware";
import { StatusCode } from "../../constants/global/global.constants";
import { Message } from "../../entities/Message.entity";
import { MessageStatus } from "../../constants/message/message.constants";
import to from "../../utils/promiseHelpers";
import { Chatroom } from "../../entities/Chatroom.entity";

async function createMessage(createMessageDto: createMessageDtoType) {
  const orm: MikroORM = await databaseLoader();
  const em: EntityManager = orm.em.fork();
  // check if user is valid
  const existingUser = await em.findOne(User, {
    id: createMessageDto.user_id,
  });

  if (!existingUser) {
    throw new HttpError(StatusCode.NOT_FOUND, "User not found");
  }

  const messageStatus = MessageStatus.SENT;

  const newMessage = new Message(
    createMessageDto.createMessageReqBody.text,
    messageStatus
  );

  const existingChatroom = await em.findOne(Chatroom, {
    id: createMessageDto.createMessageReqBody.chatroom_id,
  });

  if (!existingChatroom) {
    throw new HttpError(StatusCode.NOT_FOUND, "Chat room not found");
  }

  newMessage.user = existingUser;
  newMessage.chatroom = existingChatroom;

  const [err, res] = await to(em.persistAndFlush(newMessage));

  if (err) {
    throw new HttpError(
      StatusCode.INTERNAL_SERVER_ERROR,
      "Something went wrong while creating message"
    );
  }

  await orm.close();

  return "message created";
}

async function getAllMessageLinkedToUser(userId: string) {
  const orm: MikroORM = await databaseLoader();
  const em: EntityManager = orm.em.fork();

  const existingUser = await em.findOne(User, {
    id: userId,
  });

  if (!existingUser) {
    throw new HttpError(StatusCode.NOT_FOUND, "User not found");
  }

  const allChatroomLinkedToUser = existingUser.chatrooms.getItems();

  console.log("all chat rooms: ", allChatroomLinkedToUser);
}

async function getAllMessageByChatroomId(chatroom_id: string) {
  const orm: MikroORM = await databaseLoader();
  const em: EntityManager = orm.em.fork();

  const existingChatroom = await em.findOne(Chatroom, {
    id: chatroom_id,
  });

  if (!existingChatroom) {
    throw new HttpError(StatusCode.NOT_FOUND, "Chatroom not found");
  }

  const allMessages = await em.find(Message, {
    chatroom: existingChatroom,
  });

  await orm.close();
  return allMessages;
}

export default {
  createMessage,
  getAllMessageLinkedToUser,
  getAllMessageByChatroomId,
};
