import { Model } from "mongoose";
import { USER_ROLE } from "./user.constant";

export type TUser = {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  password: string;
  phone: string;
  address: string;
};

//static method
export interface UserModel extends Model<TUser> {
  isUserExitsByEmail(email: string): Promise<TUser>;
  isPasswordMatched(
    palinTextPassword: string,
    hashedTextPassword: string
  ): Promise<boolean>;
}

export type TUserRole = keyof typeof USER_ROLE;
