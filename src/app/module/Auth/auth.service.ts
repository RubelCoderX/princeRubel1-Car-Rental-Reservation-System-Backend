import AppError from "../../error/AppError";
import { TUser } from "../User/user.interface";
import { User } from "../User/user.model";
import httpStatus from "http-status";

const createSignUp = async (userData: TUser) => {
  // checking if the user already exists

  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User already Exists!!");
  }
  const newUser = new User(userData);
  const result = await newUser.save();
  return result;
};

export const AuthService = {
  createSignUp,
};
