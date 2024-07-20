export interface AddContactReqBodyType {
  phone_num: number;
}

export interface AddContactDtoType {
  addContactReqBody: AddContactReqBodyType;
  userId: string;
}

export interface getContactByUserIdResponseType {
  contact_name: string;
  contact_phone_num: number;
}
