import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryKey,
  Property,
} from "@mikro-orm/mysql";
import { v4 } from "uuid";
import { User } from "./User.entity";
import { Chatroom } from "./Chatroom.entity";

@Entity()
export class Message {
  @PrimaryKey({ type: "uuid" })
  id = v4();

  @Property({ length: 1024 })
  text!: string;

  @Property()
  status: string;

  @Property({ onCreate: () => new Date() })
  created_at!: Date;

  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
  updated_at!: Date;

  @ManyToOne(() => Chatroom)
  chatroom!: Chatroom;

  @ManyToOne(() => User)
  user!: User;

  constructor(text: string, status: string) {
    this.text = text;
    this.status = status;
  }
}
