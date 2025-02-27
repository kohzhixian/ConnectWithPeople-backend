import { Express } from "express";
import authRoute from "../api/routes/auth.route";
import jwtMiddleware from "../middleware/jwt.middleware";
import contactRoute from "../api/routes/contact.route";
import messageRoute from "../api/routes/message.route";
import chatroomRoute from "../api/routes/chatroom.route";

export default function routesLoader(app: Express) {
  app.use("/api/v1/auth", authRoute);
  app.use(jwtMiddleware);
  app.use("/api/v1/contact", contactRoute);
  app.use("/api/v1/message", messageRoute);
  app.use("/api/v1/chatroom", chatroomRoute);
}
