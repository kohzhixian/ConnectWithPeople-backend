import { Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property } from "@mikro-orm/mysql";
import { v4 } from "uuid";
import { User } from "./User.entity";
import { Message } from "./Message.entity";

@Entity()
export class Contacts {
    @PrimaryKey({type: 'uuid'})
    id = v4();

    @Property()
    name: string;

    @Property()
    phone_num: number;

    @ManyToOne(() => User)
    User!: User

    @OneToMany(() => Message, message => message.Contacts)
    messages = new Collection<Message>(this)


    constructor(name: string, phone_num:number){
        this.name = name;
        this.phone_num = phone_num
    }

}