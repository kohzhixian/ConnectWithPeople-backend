import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import http from "http";
import jwt from "jsonwebtoken";
import { Server, Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import { formattedChatroomMessageType } from "../types/message.type";

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
            console.log("JWT verification failed: ", err);
            return next(new Error("Authentication error") as ExtendedError);
          }

          (socket as any).decoded = decoded;
          next();
        }
      );
    } else {
      console.log("No valid token provided");
      return next(new Error("Authentication error") as ExtendedError);
    }
  });

  io.engine.on("connection_error", (err) => {
    console.error(err.req);
    console.error(err.code);
    console.error(err.message);
    console.error(err.context);
  });

  io.on("connection", (socket) => {
    socket.on("join-room", (room) => {
      socket.join(room);
    });
    socket.on("send-message", (data: formattedChatroomMessageType, room) => {
      if (room === "") {
        // makes the server send the message to every socket
        socket.broadcast.emit("receive-message", data);
      } else {
        socket.to(room).emit("receive-message", data);
      }
    });
  });

  // respond to all preflight OPTIONS requests for any path with appropriate CORS headers
  app.options("*", cors());

  return { app, server };
}
