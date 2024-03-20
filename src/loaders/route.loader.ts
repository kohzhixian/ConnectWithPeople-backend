import { Express } from "express";
import authRoute from "../api/routes/auth.route";

export default function routesLoader(app: Express) {
  app.use(`/api/v1`, authRoute);
}
