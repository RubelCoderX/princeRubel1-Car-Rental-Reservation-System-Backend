import AppError from "../../error/AppError";
import { TUser } from "../User/user.interface";
import { User } from "../User/user.model";
import httpStatus from "http-status";
import { TSignInUser } from "./auth.interface";
import jwt from "jsonwebtoken";
import config from "../../config";
import { verifyToken } from "./auth.constant";

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

const createSignIn = async (payload: TSignInUser) => {
  const user = await User.isUserExitsByEmail(payload.email);

  // checking if the user not found
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not Found");
  }

  // chcek password matched
  if (!(await User.isPasswordMatched(payload?.password, user.password))) {
    throw new AppError(httpStatus.FORBIDDEN, "Password do not matched!!");
  }
  // create token send to the client
  const jwtPaylod = {
    userEmail: user.email,
    name: user.name,
    image: user.image,
    role: user.role,
  };

  const accessToken = jwt.sign(jwtPaylod, config.jwt_access_secret as string, {
    expiresIn: "5m",
  });
  const refreshToken = jwt.sign(
    jwtPaylod,
    config.jwt_refresh_secret as string,
    {
      expiresIn: "10d",
    }
  );
  return {
    user,
    refreshToken: refreshToken,
    accessToken: accessToken,
  };
};
const refreshTokenIntoDB = async (token: string) => {
  // check if the token is valid
  const decoded = verifyToken(token, config.jwt_refresh_secret as string);

  const { userEmail } = decoded;
  const user = await User.findOne({ email: userEmail });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!!");
  }
  const jwtPayload = {
    userEmail: user.email,
    name: user.name,
    image: user.image,
    role: user.role,
  };
  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: "1m",
  });
  return {
    accessToken,
  };
};
export const AuthService = {
  createSignUp,
  createSignIn,
  refreshTokenIntoDB,
};
