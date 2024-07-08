export interface registerDto {
  name: string;
  phone_number: number;
  username: string;
  password: string;
}

export interface loginDto {
  username: string;
  password: string;
}

export interface tokenDataType {
  userId: string;
  username: string;
  name: string;
  phone_number: number;
}

export interface refreshTokenDto {
  userId: string;
}
