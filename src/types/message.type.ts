interface createMessageReqBodyType {
  text: string;
  chatroom_id: string;
}

export interface createMessageDtoType {
  user_id: string;
  createMessageReqBody: createMessageReqBodyType;
}

export interface formattedMessageInterface {
  chatroom_id: string | undefined;
  message: string | undefined;
  sender: string | undefined;
  date: string | undefined;
}
