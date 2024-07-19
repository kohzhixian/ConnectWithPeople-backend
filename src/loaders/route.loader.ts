import { Express } from "express";
import authRoute from "../api/routes/auth.route";
import jwtMiddleware from "../middleware/jwt.middleware";
import testProtectedRoute from "../api/routes/testProtected.route";
import contactRoute from "../api/routes/contact.route";

export default function routesLoader(app: Express) {
  app.use("/api/v1/auth", authRoute);
  app.use(jwtMiddleware);
  app.use("/api/v1", testProtectedRoute);
  app.use("/api/v1/contact", contactRoute);
}
