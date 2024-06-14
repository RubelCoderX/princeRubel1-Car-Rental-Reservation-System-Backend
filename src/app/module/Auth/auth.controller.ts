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
  const { user, accessToken } = await AuthService.createSignIn(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User logged in successfully",
    data: user,
    token: accessToken,
  });
});

export const AuthController = {
  signUp,
  signIn,
};
