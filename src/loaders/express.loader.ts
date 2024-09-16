import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import http from "http";

export default function expressLoader() {
  const app = express();
  // creates a http server that both express and socket io share
  const server = http.createServer(app);
  // initialize a new instance of socket io
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "http://127.0.0.1:5173"], // Ensure CORS is set up correctly
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

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

  io.on("connection", (socket) => {
    console.log("A user connected");
  });

  // respond to all preflight OPTIONS requests for any path with appropriate CORS headers
  app.options("*", cors());

  return { app, server };
}
