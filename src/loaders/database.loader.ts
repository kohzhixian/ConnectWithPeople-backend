import { MikroORM } from "@mikro-orm/mysql";
import mikroOrmConfig from "../config/mikro-orm.config";

export default async function databaseLoader(){
    const orm = await MikroORM.init(mikroOrmConfig);
    return orm;
}