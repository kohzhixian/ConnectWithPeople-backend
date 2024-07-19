import {
  Collection,
  Entity,
  ManyToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/mysql";
import { v4 } from "uuid";
import { User } from "./User.entity";

@Entity()
export class Contacts {
  @PrimaryKey({ type: "uuid" })
  id = v4();

  @Property()
  name: string;

  @Property()
  phone_num: number;

  @ManyToMany(() => User, (user) => user.contacts, { owner: true })
  users = new Collection<User>(this);

  constructor(name: string, phone_num: number) {
    this.name = name;
    this.phone_num = phone_num;
  }
}
