import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import http from "http";
import jwt from "jsonwebtoken";
import { Server, Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import { formattedChatroomMessageType } from "../types/message.type";

interface ConnectedUsersInterface {
  [phoneNum: number]: string;
}

interface SocketNewChatroomData {
  chatroom_name: string;
  chatroom_icon: string;
  userPhoneNum: number[];
}

export default function expressLoader() {
  require("dotenv").config({ path: ".env.dev" });
  const app = express();
  // creates a http server that both express and socket io share
  const server = http.createServer(app);
  // initialize a new instance of socket io

  // middleware that transforms raw string of req.body into json
  app.use(express.json());

  // middleware that will parse the cookie header on the request
  app.use(cookieParser());
  // enables Cross-Origin Resource sharing
  const allowedOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];
  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true, // Enable credentials (cookies, authorization headers, TLS client certificates)
    })
  );

  const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });

  io.use((socket: Socket, next: (err?: ExtendedError) => void) => {
    const token =
      socket.handshake.query.token || socket.handshake.headers["authorization"];

    if (token && typeof token === "string") {
      const jwtToken = token.startsWith("Bearer ")
        ? token.split(" ")[1]
        : token;

      jwt.verify(
        jwtToken,
        String(process.env.JWT_TOKEN_SECRET),
        (err, decoded) => {
          if (err) {
            console.error("JWT verification failed: ", err);
            return next(new Error("Authentication error") as ExtendedError);
          }

          (socket as any).decoded = decoded;
          next();
        }
      );
    } else {
      console.error("No valid token provided");
      return next(new Error("Authentication error") as ExtendedError);
    }
  });

  io.engine.on("connection_error", (err) => {
    console.error(err.req);
    console.error(err.code);
    console.error(err.message);
    console.error(err.context);
  });

  const connectedUsers: ConnectedUsersInterface = {};

  io.on("connection", (socket) => {
    // when a user connects, the client send its phone number
    // The phone number will then be linked to a socket id
    socket.on("register-phone", (phoneNum) => {
      connectedUsers[phoneNum] = socket.id;
    });

    socket.on(
      "send-message",
      (data: formattedChatroomMessageType, phoneNumberArr: number[]) => {
        phoneNumberArr.forEach((phoneNum) => {
          const socketId = connectedUsers[phoneNum];
          if (socketId) {
            io.to(socketId).emit("receive-message", data);
          }
        });
      }
    );
    //
    socket.on("new-chatroom", (chatroomData: SocketNewChatroomData) => {
      chatroomData.userPhoneNum.forEach((phone) => {
        // We get the socket id of the user phone number that is being passed in by the chatroom data
        const socketId = connectedUsers[phone];
        if (socketId) {
          // A new chatroom is then creaated with all the socket id taht we get using the user phone number
          io.to(socketId).emit("new-chatroom", chatroomData);
        }
      });
    });
  });

  // respond to all preflight OPTIONS requests for any path with appropriate CORS headers
  app.options("*", cors());

  return { app, server };
}
