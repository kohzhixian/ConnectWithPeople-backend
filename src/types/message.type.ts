export interface createMessageReqBodyType {
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

export interface formattedChatroomMessageType {
  text: string;
  status: string;
  updated_at: string;
  username: string;
  messageId: string;
  userId: string;
}
