export interface AddContactReqBodyType {
  phone_num: number;
}

export interface AddContactDtoType {
  addContactReqBody: AddContactReqBodyType;
  userId: string;
}
