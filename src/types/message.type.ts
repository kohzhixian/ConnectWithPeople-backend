interface createMessageReqBodyType {
  text: string;
  chatroom_id: string;
}

export interface createMessageDtoType {
  user_id: string;
  createMessageReqBody: createMessageReqBodyType;
}

export interface getAllMessageByChatroomIdDtoType {
  chatroom_id: string;
}
