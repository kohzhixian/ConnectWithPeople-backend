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
  username: string;
  name: string;
  phone_number: number;
}
