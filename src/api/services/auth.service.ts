import { EntityManager, MikroORM } from "@mikro-orm/mysql";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { StatusCode } from "../../constants/global/global.constants";
import { Token } from "../../entities/Token.entity";
import { User } from "../../entities/User.entity";
import databaseLoader from "../../loaders/database.loader";
import { HttpError } from "../../middleware/httpError.middleware";
import { loginDto, tokenDataType } from "../../types/auth.type";
import { registerDto } from "./../../types/auth.type";

require("dotenv").config({ path: ".env.dev" });
async function register(registerDto: registerDto) {
  const orm: MikroORM = await databaseLoader();
  //creates a new instance of EntityManager to ensure changes made in 1 req does not affect another
  const em: EntityManager = orm.em.fork();
  try {
    const encryptedPassword = await bcrypt.hash(
      registerDto.password,
      Number(process.env.ENCRYPTION_SALT_ROUNDS)
    );
    const newUser = new User(
      registerDto.name,
      registerDto.phone_number,
      registerDto.username,
      encryptedPassword
    );

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

async function login(loginDto: loginDto) {
  // Check if user exists
  const orm: MikroORM = await databaseLoader();
  const em: EntityManager = orm.em.fork();

  const existingUser = await em.findOne(User, {
    username: loginDto.username,
  });

  if (!existingUser) {
    throw new HttpError(401, "User not found.");
  }

  // check if password matches
  const isUserValid = await bcrypt.compare(
    loginDto.password,
    existingUser.password
  );

  if (!isUserValid) {
    throw new HttpError(401, "User not found.");
  }

  let tokenData: tokenDataType = {
    userId: existingUser.id,
    username: existingUser.username,
    name: existingUser.name,
    phone_number: existingUser.phone_num,
  };

  let signedToken;
  try {
    signedToken = jwt.sign(tokenData, String(process.env.JWT_TOKEN_SECRET), {
      expiresIn: "1800s",
    });
  } catch (err) {
    throw new HttpError(500, "Token creation failed.");
  }

  const newTokenData = {
    ...tokenData,
    token: signedToken,
  };

  let signedRefreshToken;
  try {
    signedRefreshToken = jwt.sign(
      tokenData,
      String(process.env.JWT_REFRESH_TOKEN_SECRET),
      { expiresIn: "7d" }
    );
  } catch (err) {
    throw new HttpError(500, "Refresh token creation failed.");
  }

  let decodedRefreshToken;
  try {
    decodedRefreshToken = jwt.verify(
      signedRefreshToken,
      String(process.env.JWT_REFRESH_TOKEN_SECRET)
    ) as JwtPayload;
  } catch (err) {
    throw new HttpError(500, "Failed to verify token");
  }

  const newRefreshToken = new Token(
    signedRefreshToken,
    decodedRefreshToken.iat ? decodedRefreshToken.iat : 0,
    decodedRefreshToken.exp ? decodedRefreshToken.exp : 0,
    existingUser
  );

  try {
    em.persist(newRefreshToken);
    await em.flush();
  } catch (err) {
    console.error(err);
    throw new HttpError(
      500,
      "Failed to create refresh token due to internal error"
    );
  } finally {
    orm.close();
  }

  return newTokenData;
}

async function refreshToken(userId: string) {
  const orm: MikroORM = await databaseLoader();
  const em: EntityManager = orm.em.fork();

  const existingRefreshToken = await em.find(Token, {
    User: userId,
    isDeleted: false,
  });

  if (existingRefreshToken.length === 0) {
    throw new HttpError(StatusCode.UNAUTHORIZED, "No token found.");
  }

  // have to change this next time to cater for multiple refresh token
  const decodedRefreshToken = jwt.verify(
    existingRefreshToken[0].token,
    String(process.env.JWT_REFRESH_TOKEN_SECRET)
  ) as JwtPayload;

  if (typeof decodedRefreshToken !== "object" || !decodedRefreshToken.userId) {
    throw new HttpError(StatusCode.UNAUTHORIZED, "Invalid token");
  }

  let newTokenData: tokenDataType = {
    userId: decodedRefreshToken.userId,
    username: decodedRefreshToken.username,
    name: decodedRefreshToken.name,
    phone_number: decodedRefreshToken.phone_number,
  };
  const newAccessToken = jwt.sign(
    newTokenData,
    String(process.env.JWT_TOKEN_SECRET),
    {
      expiresIn: "1800s",
    }
  );

  return newAccessToken;
}

async function logout(userId: string) {
  const orm: MikroORM = await databaseLoader();
  const em: EntityManager = orm.em.fork();

  const existingToken = await em.findOne(Token, {
    User: userId,
    isDeleted: false,
  });

  if (existingToken) {
    existingToken.isDeleted = true;
    await em.persistAndFlush(existingToken);
  }

  return "logout successful";
}

export default {
  register,
  login,
  refreshToken,
  logout,
};
