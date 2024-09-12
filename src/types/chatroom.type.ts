export interface createChatroomDtoType {
  chatroom_name: string;
  chatroom_icon: string;
  users: string[];
}

export interface formattedChatroomMessageType {
  text: string;
  status: string;
  updated_at: string;
  username: string;
}

export interface chatroomDetailsType {
  [chatroomId: string]: formattedChatroomMessageType[];
}
