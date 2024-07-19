import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/mysql";
import { v4 } from "uuid";
import { User } from "./User.entity";
import { Contacts } from "./Contacts.entity";

@Entity()
export class Message {
  @PrimaryKey({ type: "uuid" })
  id = v4();

  @Property()
  sender: number;

  @Property()
  receiver: number;

  @Property()
  message: string;

  @Property()
  status: string;

  @Property()
  created_date: Date;

  @ManyToOne(() => User)
  User!: User;

  constructor(
    sender: number,
    receiver: number,
    message: string,
    status: string,
    created_date: Date
  ) {
    this.sender = sender;
    this.receiver = receiver;
    this.message = message;
    this.status = status;
    this.created_date = created_date;
  }
}
