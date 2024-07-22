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
export class Message {
  @PrimaryKey({ type: "uuid" })
  id = v4();

  @Property()
  user_id!: string;

  @Property({ length: 1024 })
  text!: string;

  @Property()
  status: string;

  @Property({ onCreate: () => new Date() })
  created_at!: Date;

  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
  updated_at!: Date;

  @ManyToMany(() => User, (user) => user.messages)
  users = new Collection<User>(this);

  constructor(user_id: string, text: string, status: string) {
    this.user_id = user_id;
    this.text = text;
    this.status = status;
  }
}
