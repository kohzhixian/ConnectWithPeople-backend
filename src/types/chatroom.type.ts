export interface createChatroomDtoType {
  chatroom_name: string;
  chatroom_icon: string;
  userPhoneNum: number[];
}

export interface formattedChatroomMessageType {
  text: string;
  status: string;
  updated_at: string;
  created_at: string;
  username: string;
  messageId: string;
  userId: string;
  phoneNumber: number;
}

export interface chatroomDetailsType {
  [chatroomName: string]: formattedChatroomMessageType[];
}

export interface chatroomUsersDataType {
  userId: string;
  name: string;
  phoneNum: number;
  username: string;
}
