import { EntityManager, MikroORM } from "@mikro-orm/core";
import databaseLoader from "../../loaders/database.loader";
import { Contacts } from "../../entities/Contacts.entity";
import { AddContactDtoType } from "../../types/contact.type";
import { HttpError } from "../../middleware/httpError.middleware";
import { StatusCode } from "../../constants/global/global.constants";
import to from "../../utils/promiseHelpers";
import { User } from "../../entities/User.entity";

async function addContact(addContactDto: AddContactDtoType) {
  const orm: MikroORM = await databaseLoader();
  //creates a new instance of EntityManager to ensure changes made in 1 req does not affect another
  const em: EntityManager = orm.em.fork();

  // check if logged in user exists
  const loggedInUser = await em.findOne(User, {
    id: addContactDto.userId,
  });

  if (!loggedInUser) {
    throw new HttpError(StatusCode.NOT_FOUND, "User not found");
  }

  // check if added user exists in User table
  const existingUser = await em.findOne(User, {
    phone_number: addContactDto.addContactReqBody.phone_num,
  });

  if (!existingUser) {
    throw new HttpError(StatusCode.NOT_FOUND, "User not found");
  }

  const existingContact = await em.findOne(Contacts, {
    phone_num: addContactDto.addContactReqBody.phone_num,
  });

  if (existingContact && loggedInUser.contacts.contains(existingContact)) {
    throw new HttpError(StatusCode.CONFLICT, "Contact already exist");
  }

  const newContact = new Contacts(
    existingUser.name,
    addContactDto.addContactReqBody.phone_num
  );

  // link the new contact to the logged in user
  loggedInUser.contacts.add(newContact);

  const [err, res] = await to(em.persistAndFlush(newContact));

  if (err) {
    throw new HttpError(
      StatusCode.INTERNAL_SERVER_ERROR,
      "An error occurred while adding contact"
    );
  }

  await orm.close();

  return "Contact added successfully";
}

async function getContactsByUserId(userId: string) {
  const orm: MikroORM = await databaseLoader();
  const em: EntityManager = orm.em.fork();

  const loggedInUser = await em.findOne(
    User,
    {
      id: userId,
    },
    { populate: ["contacts"] }
  );

  if (!loggedInUser) {
    throw new HttpError(StatusCode.NOT_FOUND, "User does not exist");
  }

  const response = loggedInUser.contacts.getItems().map((contact) => {
    return {
      contact_name: contact.name,
      contact_phone_num: contact.phone_num,
    };
  });

  return response;
}

export default {
  addContact,
  getContactsByUserId,
};
