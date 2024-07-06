import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/mysql";
import { v4 } from "uuid";
import { User } from "./User.entity";

@Entity()
export class Token {
  @PrimaryKey({ type: "uuid" })
  id = v4();

  @Property()
  token: string;

  @Property()
  created_at: number;

  @Property()
  expires_at: number;

  @ManyToOne(() => User)
  User!: User;

  constructor(
    token: string,
    created_at: number,
    expires_at: number,
    user: User
  ) {
    this.token = token;
    this.created_at = created_at;
    this.expires_at = expires_at;
    this.User = user;
  }
}
