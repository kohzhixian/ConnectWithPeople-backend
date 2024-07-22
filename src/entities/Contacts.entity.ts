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

  @Property({ onCreate: () => new Date() })
  created_at!: Date;

  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
  updated_at!: Date;

  @ManyToMany(() => User, (user) => user.contacts, { owner: true })
  users = new Collection<User>(this);

  constructor(name: string, phone_num: number) {
    this.name = name;
    this.phone_num = phone_num;
  }
}
