import { NextFunction, Request, Response } from "express";
import databaseLoader from "./src/loaders/database.loader";
import expressLoader from "./src/loaders/express.loader";
import routesLoader from "./src/loaders/route.loader";
import { HttpError } from "./src/middleware/httpError.middleware";

async function startServer() {
  require("dotenv").config({ path: ".env.dev" });
  const port = process.env.PORT;
  try {
    await databaseLoader();
    const app = expressLoader();

    routesLoader(app);

    // format httpError into json format
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      if (err instanceof HttpError) {
        res.status(err.statusCode).json({ ErrorMessage: err.message });
      } else {
        res
          .status(500)
          .json({ ErrorMessage: err.message || "Internal Server Error" });
      }
    });
    app.listen(port, () => {
      console.log(`
      ====================================
      🚀 Server running on port ${port}!🚀
      ====================================
      `);
    });
  } catch (err) {
    console.error("Failed to start app.", err);
  }
}

startServer();
