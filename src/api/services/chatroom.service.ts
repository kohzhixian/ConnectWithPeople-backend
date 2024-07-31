import { EntityManager, MikroORM } from "@mikro-orm/mysql";
import databaseLoader from "../../loaders/database.loader";
import { createChatroomDtoType } from "../../types/chatroom.type";
import { User } from "../../entities/User.entity";
import { HttpError } from "../../middleware/httpError.middleware";
import { StatusCode } from "../../constants/global/global.constants";
import { Chatroom } from "../../entities/Chatroom.entity";
import to from "../../utils/promiseHelpers";

async function createChatroom(createChatroomDto: createChatroomDtoType) {
  const orm: MikroORM = await databaseLoader();
  const em: EntityManager = orm.em.fork();

  const userIds = createChatroomDto.users;

  // fetch all users in chatroom
  const usersInChatroom = await em.find(User, {
    id: { $in: createChatroomDto.users },
  });

  if (!usersInChatroom) {
    throw new HttpError(StatusCode.NOT_FOUND, "No users found.");
  }

  // create a set of existing user ids for fast lookup
  const existingUserIds = new Set(usersInChatroom.map((data) => data.id));

  const newChatroom = new Chatroom(
    createChatroomDto.chatroom_name,
    createChatroomDto.chatroom_icon
  );

  // check if provided users ids exist
  for (const id of userIds) {
    if (!existingUserIds.has(id)) {
      throw new HttpError(StatusCode.NOT_FOUND, "An added user does not exist");
    }
  }

  for (const user of usersInChatroom) {
    console.log(user);
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
  return "Chatroom created";
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

  return allChatroom;
}

export default {
  createChatroom,
  getAllChatroomByUserId,
};
