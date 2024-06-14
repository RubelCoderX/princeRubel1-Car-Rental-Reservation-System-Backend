import express from "express";
import validateRequest from "../../middleware/validateRequest";
import { UserValidation } from "../User/user.validation";
import { AuthController } from "./auth.controller";
import { AuthValidation } from "./auth.validation";

const router = express.Router();

router.post(
  "/singup",
  validateRequest(UserValidation.userValidationSchema),
  AuthController.signUp
);
router.post(
  "/singin",
  validateRequest(AuthValidation.singInValidationSchema),
  AuthController.signIn
);

export const AuthRouter = router;
