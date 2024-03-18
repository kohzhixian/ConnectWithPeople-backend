import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/mysql";
import { v4 } from "uuid";
import { User } from "./User.entity";

@Entity()
export class Token {
    @PrimaryKey({type: 'uuid'})
    id = v4();


    @Property()
    token: string;

    @Property()
    created_at: Date;

    @Property()
    expires_at: Date;

    @ManyToOne(() => User)
    User!: User


    constructor( token: string, created_at: Date, expires_at: Date){
        this.token = token;
        this.created_at = created_at;
        this.expires_at = expires_at
    }
}