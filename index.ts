import databaseLoader from "./src/loaders/database.loader";
import expressLoader from "./src/loaders/express.loader";
import routesLoader from "./src/loaders/route.loader";

async function startServer() {
  require("dotenv").config({ path: ".env.dev" });
  const port = process.env.PORT;
  try {
    await databaseLoader();
    const app = expressLoader();
    routesLoader(app);
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
