import { body } from "express-validator";
import isValidSGNum from "../utils/authHelpers";

export const registerInputsValidation = [
  body("username")
    .trim()
    .custom((value) => {
      if (!value || value.length === 0) {
        throw new Error("username cannot be empty");
      }
      if (value.length < 8) {
        throw new Error("username must be at least 8 characters");
      }

      // prevent invalid value from being returned
      return true;
    }),

  body("name").trim().not().isEmpty().withMessage("name cannot be empty"),
  body("phone_number").custom((value) => {
    if (!isValidSGNum(value)) {
      throw new Error("Invalid phone number");
    }
    return true;
  }),

  body("password")
    .trim()
    .custom((value) => {
      if (!value || value.length === 0) {
        throw new Error("password cannot be empty");
      }
      if (value.length < 8) {
        throw new Error("password must be at least 8 characters");
      }

      return true;
    }),
];
