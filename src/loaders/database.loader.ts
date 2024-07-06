import { MikroORM } from "@mikro-orm/mysql";
import mikroOrmConfig from "../config/mikro-orm.config";

export default async function databaseLoader() {
  const orm = await MikroORM.init(mikroOrmConfig);
  const generator = orm.getSchemaGenerator();

  // await generator.createSchema();
  // await generator.dropSchema();
  return orm;
}
