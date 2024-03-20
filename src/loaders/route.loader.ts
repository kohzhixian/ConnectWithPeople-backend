import { Express } from "express";
import testRoutes from "../api/routes/test.routes";

export default function routesLoader(app: Express) {
  app.use("/api", testRoutes);
}
