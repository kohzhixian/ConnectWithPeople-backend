import { NextFunction } from "express";
import { User } from "../../entities/User.entity";
import databaseLoader from "../../loaders/database.loader";
import { HttpError } from "../../middleware/httpError.middleware";
import { registerDto } from "../../types/auth.type";
import isValidSGNum from "../../utils/authHelpers";

async function register(registerDto: registerDto) {
  const orm = await databaseLoader();
  try {
    const currentDate = new Date();
    const newUser = new User(
      registerDto.name,
      registerDto.phone_number,
      registerDto.username,
      registerDto.password,
      currentDate
    );

    //creates a new instance of EntityManager to ensure changes made in 1 req does not affect another
    const em = orm.em.fork();

    //check for existing user
    const existingUser = await em.findOne(User, {
      username: registerDto.username,
    });

    if (existingUser) {
      throw new HttpError(409, "User already exists");
    }

    //used to mark an entity for insertion or update
    em.persist(newUser);
    await em.flush();
  } catch (err) {
    if (err instanceof HttpError) {
      throw err;
    }
    throw new HttpError(
      500,
      "Failed to register due to server error. Please try again"
    );
  } finally {
    //close database connection
    await orm.close();
  }
}

async function login(req: Request, res: Response, next: NextFunction) {}

export default {
  register,
  login,
};
