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
export const AuthController = {
  signUp,
  signIn,
  refreshTokenFromDB,
};
