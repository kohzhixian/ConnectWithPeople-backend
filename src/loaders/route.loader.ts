import { Express } from "express";
import authRoute from "../api/routes/auth.route";
import jwtMiddleware from "../middleware/jwt.middleware";
import testRoute from "../api/routes/test.route";

export default function routesLoader(app: Express) {
  app.use("/api/v1", authRoute);
  app.use(jwtMiddleware);
  app.use("/api/v1", testRoute);
}
