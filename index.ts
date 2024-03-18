import { MikroORM } from "@mikro-orm/mysql";
import express, { Request, Response } from "express";
import mikroOrmConfig from "./src/config/mikro-orm.config";
const app = express();
app.use(express.json());

require('dotenv').config({path: '.env.dev'})
const port = process.env.PORT;

(async () => {
  const orm = await MikroORM.init(mikroOrmConfig)
  const generator = orm.getSchemaGenerator();

  // await generator.dropSchema();
  // await generator.createSchema();

  await orm.close(true);
})();


app.listen(port, () => {
  console.log(`
  ====================================
  🚀 Server running on port ${port}!🚀
  ====================================
  `)
})
