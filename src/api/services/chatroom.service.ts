import { EntityManager, MikroORM } from "@mikro-orm/mysql";
import dayjs from "dayjs";
import { StatusCode } from "../../constants/global/global.constants";
import { Chatroom } from "../../entities/Chatroom.entity";
import { Message } from "../../entities/Message.entity";
import { User } from "../../entities/User.entity";
import databaseLoader from "../../loaders/database.loader";
import { HttpError } from "../../middleware/httpError.middleware";
import {
  chatroomDetailsType,
  chatroomUsersDataType,
  createChatroomDtoType,
  formattedChatroomMessageType,
} from "../../types/chatroom.type";
import to from "../../utils/promiseHelpers";

async function createChatroom(createChatroomDto: createChatroomDtoType) {
  const orm: MikroORM = await databaseLoader();
  const em: EntityManager = orm.em.fork();

  const userPhoneNum = createChatroomDto.userPhoneNum;

  // fetch all users in chatroom
  const usersInChatroom = await em.find(User, {
    phone_num: { $in: userPhoneNum },
  });

  // checks if added user exists
  if (usersInChatroom.length !== userPhoneNum.length) {
    throw new HttpError(StatusCode.NOT_FOUND, "An added user does not exist");
  }

  if (!usersInChatroom) {
    throw new HttpError(StatusCode.NOT_FOUND, "No users found.");
  }

  const newChatroom = new Chatroom(
    createChatroomDto.chatroom_name,
    createChatroomDto.chatroom_icon
  );

  for (const user of usersInChatroom) {
    newChatroom.users.add(user);
  }

  const [err, res] = await to(em.persistAndFlush(newChatroom));

  if (err) {
    throw new HttpError(
      StatusCode.INTERNAL_SERVER_ERROR,
      "Something went wrong while creating chat room"
    );
  }
  await orm.close();
  return newChatroom.id;
}

async function getAllChatroomByUserId(userId: string) {
  const orm: MikroORM = await databaseLoader();
  const em: EntityManager = orm.em.fork();

  const existingUser = await em.findOne(User, {
    id: userId,
  });

  if (!existingUser) {
    throw new HttpError(StatusCode.NOT_FOUND, "User not found");
  }

  const allChatroom = await em.find(Chatroom, {
    users: existingUser,
  });

  await orm.close();
  return allChatroom;
}

const sortMessageByDate = (data: formattedChatroomMessageType[]) => {
  data.sort((a: any, b: any) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();

    return dateA - dateB;
  });
};

async function getChatroomDetailsById(chatroomId: string) {
  const orm: MikroORM = await databaseLoader();
  const em: EntityManager = orm.em.fork();

  const existingChatroom = await em.findOne(Chatroom, {
    id: chatroomId,
  });

  if (!existingChatroom) {
    throw new HttpError(StatusCode.NOT_FOUND, "Chatroom not found.");
  }

  const chatroomMessages = await em.find(Message, {
    chatroom: existingChatroom,
  });

  await em.populate(chatroomMessages, ["user"]);

  const formattedChatroomMessages: formattedChatroomMessageType[] =
    chatroomMessages.map((data) => {
      const userObj = data.user;
      return {
        text: data.text,
        status: data.status,
        updated_at: dayjs(data.updated_at).toISOString(),
        created_at: dayjs(data.created_at).toISOString(),
        username: userObj.username,
        messageId: data.id,
        userId: userObj.id,
        phoneNumber: userObj.phone_num,
      };
    });
  // sort message by date
  sortMessageByDate(formattedChatroomMessages);

  const chatroomDetails: chatroomDetailsType = {
    [existingChatroom.chatroom_name]: formattedChatroomMessages,
  };

  await orm.close();

  return chatroomDetails;
}

async function checkIfChatroomExist(userId: string) {
  const orm: MikroORM = await databaseLoader();
  const em: EntityManager = orm.em.fork();
  const existingChatrooms = await getAllChatroomByUserId(userId);
  if (!existingChatrooms) {
    throw new HttpError(StatusCode.NOT_FOUND, "No chatroom found.");
  }

  // const allUsersLinkedToChatroom = await
}

async function getUsersInChatroom(chatroomId: string) {
  const orm: MikroORM = await databaseLoader();
  const em: EntityManager = orm.em.fork();

  const existingChatroom = await em.findOne(
    Chatroom,
    {
      id: chatroomId,
    },
    { populate: ["users"] }
  );

  const users = existingChatroom?.users.getItems();

  let formattedUserData: chatroomUsersDataType[] = [];

  if (users && users.length !== 0) {
    users.forEach((data) => {
      const userObj: chatroomUsersDataType = {
        name: data.name,
        phoneNum: data.phone_num,
        userId: data.id,
        username: data.username,
      };

      formattedUserData.push(userObj);
    });
  }

  return formattedUserData;
}

export default {
  createChatroom,
  getAllChatroomByUserId,
  getChatroomDetailsById,
  checkIfChatroomExist,
  getUsersInChatroom,
};
