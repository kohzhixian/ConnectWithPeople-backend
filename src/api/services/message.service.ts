import { EntityManager, MikroORM } from "@mikro-orm/mysql";
import { StatusCode } from "../../constants/global/global.constants";
import { MessageStatus } from "../../constants/message/message.constants";
import { Chatroom } from "../../entities/Chatroom.entity";
import { Message } from "../../entities/Message.entity";
import { User } from "../../entities/User.entity";
import databaseLoader from "../../loaders/database.loader";
import { HttpError } from "../../middleware/httpError.middleware";
import {
  createMessageDtoType,
  formattedMessageInterface,
} from "../../types/message.type";
import to from "../../utils/promiseHelpers";
import dayjs from "dayjs";

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

  // return messsage id as it is needed for the socket function
  return newMessage.id;
}

async function getAllMessageLinkedToUser(userId: string) {
  const orm: MikroORM = await databaseLoader();
  const em: EntityManager = orm.em.fork();

  // fetch user and chatrooms linked to user
  const existingUser = await em.findOne(User, userId, {
    populate: ["chatrooms"],
  });

  if (!existingUser) {
    throw new HttpError(StatusCode.NOT_FOUND, "User not found");
  }

  const allChatroomLinkedToUser = existingUser.chatrooms.getItems();

  const allMessages = await em.find(Message, {
    chatroom: allChatroomLinkedToUser,
  });

  await orm.close();
  return allMessages;
}

async function getLatestMsgForAllChatroomLinkedToUser(allMessages: Message[]) {
  const orm: MikroORM = await databaseLoader();
  const em: EntityManager = orm.em.fork();

  const allChatroomIds = allMessages.map((data) => data.chatroom);
  const allUniqueChatroomIds = Array.from(new Set(allChatroomIds));

  const latestMessages = await em
    .createQueryBuilder(Message, "m0")
    .select(["m0.*"]) //selects all column from msg table
    .where({ chatroom: { $in: allUniqueChatroomIds } })
    .andWhere(
      `m0.created_at = (SELECT MAX(m1.created_at) FROM message as m1 WHERE m1.chatroom_id = m0.chatroom_id)`
    )
    .orderBy({ "m0.created_at": "DESC" })
    .getResult();

  // populate the user obj
  await em.populate(latestMessages, ["user"]);

  const formattedLatestMessage: formattedMessageInterface[] =
    latestMessages.map((data) => {
      const userObj = data.user;

      return {
        chatroom_id: data?.chatroom.id,
        message: data?.text,
        sender: userObj.username,
        date: dayjs(data.created_at).toISOString(),
      };
    });
  await orm.close();
  return formattedLatestMessage;
}

export default {
  createMessage,
  getAllMessageLinkedToUser,
  getLatestMsgForAllChatroomLinkedToUser,
};
