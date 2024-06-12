import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResonse";
import { AuthService } from "./auth.service";
import { date } from "zod";

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

export const AuthController = {
  signUp,
};
