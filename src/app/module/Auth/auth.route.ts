import express from "express";
import validateRequest from "../../middleware/validateRequest";
import { UserValidation } from "../User/user.validation";
import { AuthController } from "./auth.controller";
import { AuthValidation } from "./auth.validation";

const router = express.Router();

router.post(
  "/signup",
  validateRequest(UserValidation.userValidationSchema),
  AuthController.signUp
);
router.post(
  "/signin",
  validateRequest(AuthValidation.singInValidationSchema),
  AuthController.signIn
);
router.post(
  "/refresh-token",
  validateRequest(AuthValidation.refreshTokenValidationSchema),
  AuthController.refreshTokenFromDB
);

export const AuthRouter = router;
