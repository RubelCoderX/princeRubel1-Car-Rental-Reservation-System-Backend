import AppError from "../../error/AppError";
import { TUser } from "../User/user.interface";
import { User } from "../User/user.model";
import httpStatus from "http-status";
import { TSignInUser } from "./auth.interface";
import jwt from "jsonwebtoken";
import config from "../../config";
import { verifyToken } from "./auth.constant";

const createSignUp = async (payload: TUser) => {
  // Checking if the user already exists
  const existingUser = await User.findOne({ email: payload.email });
  if (existingUser) {
    throw new AppError(httpStatus.CONFLICT, "User already exists!!");
  }

  // Create new user object
  const newUser = new User(payload);

  // Handling image upload
  // const imageName = `${newUser._id}${payload.name}`;
  // const path = file?.path;
  // const { secure_url } = await sendImageToCloudinary(imageName, path);
  //   newUser.image = secure_url;

  await newUser.save();

  return newUser;
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
    userId: user?._id,
    userEmail: user.email,
    name: user.name,
    image: user.image,
    role: user.role,
  };

  const accessToken = jwt.sign(jwtPaylod, config.jwt_access_secret as string, {
    expiresIn: "10m",
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
const getAllUserInDB = async () => {
  const result = await User.find();
  return result;
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
    userId: user._id,
    userEmail: user.email,
    name: user.name,
    image: user.image,
    role: user.role,
  };
  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: "10m",
  });
  return {
    accessToken,
  };
};
const updateUserIntoDB = async (userEmail: string, payload: Partial<TUser>) => {
  const user = await User.findOne({ email: userEmail });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!!");
  }

  const result = await User.findByIdAndUpdate(user?._id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};
const getMeIntoDB = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!!");
  }
  return user;
};
const delelteUserIntoDB = async (userId: string) => {
  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!!");
  }
  const result = await User.findByIdAndUpdate(
    userId,
    { isDeleted: true },
    { new: true }
  );
  return result;
};
const toggleAdminRoleInDB = async (userId: string) => {
  // Check if the user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // Toggle the user's role between 'admin' and 'user'
  const newRole = user.role === "admin" ? "user" : "admin";

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { role: newRole },
    { new: true }
  );

  return updatedUser;
};

export const AuthService = {
  createSignUp,
  createSignIn,
  refreshTokenIntoDB,
  getAllUserInDB,
  updateUserIntoDB,
  getMeIntoDB,
  delelteUserIntoDB,
  toggleAdminRoleInDB,
};
