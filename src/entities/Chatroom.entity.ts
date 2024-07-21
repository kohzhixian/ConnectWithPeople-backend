import {
  Collection,
  Entity,
  ManyToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import { v4 } from "uuid";
import { User } from "./User.entity";

@Entity()
export class Chatroom {
  @PrimaryKey({ type: "uuid" })
  id = v4();

  @Property()
  chatroom_name!: string;

  @Property()
  chatroom_icon!: string;

  @Property({ onCreate: () => new Date() })
  created_at!: Date;

  @Property({ onUpdate: () => new Date() })
  updated_at!: Date;

  @ManyToMany(() => User, (user) => user.chatrooms)
  users = new Collection<User>(this);

  constructor(chatroom_name: string, chatroom_icon: string) {
    this.chatroom_name = chatroom_name;
    this.chatroom_icon = chatroom_icon;
  }
}
