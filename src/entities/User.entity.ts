import { Collection, Entity, OneToMany, PrimaryKey, Property } from '@mikro-orm/mysql';
import { v4 } from 'uuid';
import { Contacts } from './Contacts.entity';
import { Message } from './Message.entity';
import { Token } from './Token.entity';

@Entity()
export class User {
    @PrimaryKey({type: 'uuid'})
    id = v4();

    @Property()
    name!: string;

    @Property()
    phone_number!: number;
    
    @Property()
    username!: string;

    @Property()
    password!: string;

    @Property()
    created_at! : Date;

    @OneToMany(() => Contacts, contact => contact.User)
    contacts = new Collection<Contacts>(this)

    @OneToMany(() => Message, message => message.User)
    messages = new Collection<Message>(this)
    
    @OneToMany(() => Token, token => token.User)
    tokens = new Collection<Token>(this)

    constructor(name:string, phone_number:number, username:string, password:string){
        this.name = name;
        this.phone_number = phone_number
        this.username = username
        this.password = password
    }
}