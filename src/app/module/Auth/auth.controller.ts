import httpStatus from "http-status";
import config from "../../config";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResonse";
import { AuthService } from "./auth.service";

const signUp = catchAsync(async (req, res) => {
  const userData = req.body;

  const result = await AuthService.createSignUp(userData);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "User registered successfully",
    data: result,
  });
});

const signIn = catchAsync(async (req, res) => {
  const { user, accessToken, refreshToken } = await AuthService.createSignIn(
    req.body
  );

  res.cookie("refreshToken", refreshToken, {
    secure: config.NODE_ENV === "production" ? true : false,
    httpOnly: true,
  });

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User logged in successfully",
    data: user,
    token: accessToken,
  });
});

const refreshTokenFromDB = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await AuthService.refreshTokenIntoDB(refreshToken);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Token refreshed successfully",
    data: result,
  });
});

const getAllUserFromDB = catchAsync(async (req, res) => {
  const result = await AuthService.getAllUserInDB();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User is retrived successfully",
    data: result,
  });
});
const updateUserFromDB = catchAsync(async (req, res) => {
  const { userEmail } = req.user;

  const result = await AuthService.updateUserIntoDB(userEmail, req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User updated successfully",
    data: result,
  });
});
const getMeFromDB = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await AuthService.getMeIntoDB(userId);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User retrived successfully",
    data: result,
  });
});
const deleteFromDB = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await AuthService.delelteUserIntoDB(userId);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User deleted successfully",
    data: result,
  });
});

const makeAdmin = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await AuthService.toggleAdminRoleInDB(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User role updated successfully!",
    data: result,
  });
});
export const AuthController = {
  signUp,
  signIn,
  refreshTokenFromDB,
  updateUserFromDB,
  getAllUserFromDB,
  getMeFromDB,
  deleteFromDB,
  makeAdmin,
};
