interface createMessageReqBodyType {
  text: string;
}

export interface createMessageDtoType {
  user_id: string;
  createMessageReqBody: createMessageReqBodyType;
}
