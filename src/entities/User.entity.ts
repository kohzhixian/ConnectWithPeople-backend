import {
  Collection,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryKey,
  Property,
  Unique,
} from "@mikro-orm/mysql";
import { v4 } from "uuid";
import { Contacts } from "./Contacts.entity";
import { Message } from "./Message.entity";
import { Token } from "./Token.entity";
import { Chatroom } from "./Chatroom.entity";

@Entity()
export class User {
  @PrimaryKey({ type: "uuid" })
  id = v4();

  @Property()
  @Unique()
  name!: string;

  @Property()
  @Unique()
  phone_num!: number;

  @Property()
  username!: string;

  @Property()
  password!: string;

  @Property({ onCreate: () => new Date() })
  created_at!: Date;

  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
  updated_at!: Date;

  @ManyToMany(() => Contacts, (contact) => contact.users)
  contacts = new Collection<Contacts>(this);

  @OneToMany(() => Token, (token) => token.User)
  tokens = new Collection<Token>(this);

  @ManyToMany(() => Chatroom, (chatroom) => chatroom.users, { owner: true })
  chatrooms = new Collection<Chatroom>(this);

  @OneToMany(() => Message, (message) => message.user)
  messages = new Collection<Message>(this);

  constructor(
    name: string,
    phone_number: number,
    username: string,
    password: string
  ) {
    this.name = name;
    this.phone_num = phone_number;
    this.username = username;
    this.password = password;
  }
}
