import { EntityManager, MikroORM } from "@mikro-orm/mysql";
import databaseLoader from "../../loaders/database.loader";
import { createMessageDtoType } from "../../types/message.type";
import { User } from "../../entities/User.entity";
import { HttpError } from "../../middleware/httpError.middleware";
import { StatusCode } from "../../constants/global/global.constants";
import { Message } from "../../entities/Message.entity";
import { MessageStatus } from "../../constants/message/message.constants";
import to from "../../utils/promiseHelpers";

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
    createMessageDto.user_id,
    createMessageDto.user_id,
    messageStatus
  );

  // link new message to user
  existingUser.messages.add(newMessage);

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

export default {
  createMessage,
};