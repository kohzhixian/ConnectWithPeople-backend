import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../../constants/global/global.constants";
import { AddContactReqBodyType } from "../../types/contact.type";
import getUserIdFromToken from "../../utils/getUserIdFromToken";
import contactService from "../services/contact.service";
require("dotenv").config({ path: ".env.dev" });
async function addContact(req: Request, res: Response, next: NextFunction) {
  const userId = await getUserIdFromToken(req, res);
  try {
    const addContactReqBody = req.body as AddContactReqBodyType;
    const response = await contactService.addContact({
      addContactReqBody: addContactReqBody,
      userId: userId,
    });
    res.status(StatusCode.OK).send({ message: response });
  } catch (err) {
    return next(err);
  }
}

async function getContactsByUserId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = await getUserIdFromToken(req, res);
  try {
    const response = await contactService.getContactsByUserId(userId);
    res.status(StatusCode.OK).send(response);
  } catch (err) {
    console.error(err);
    return next(err);
  }
}

export default {
  addContact,
  getContactsByUserId,
};
