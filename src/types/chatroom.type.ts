export interface createChatroomDtoType {
  chatroom_name: string;
  chatroom_icon: string;
  users: string[];
}

export interface formattedChatroomMessageType {
  text: string;
  status: string;
  updated_at: string;
  created_at: string;
  username: string;
  messageId: string;
  userId: string;
}

export interface chatroomDetailsType {
  [chatroomName: string]: formattedChatroomMessageType[];
}
