import express from "express";
import validateRequest from "../../middleware/validateRequest";
import { UserValidation } from "../User/user.validation";
import { AuthController } from "./auth.controller";

const router = express.Router();

router.post(
  "/singup",
  validateRequest(UserValidation.userValidationSchema),
  AuthController.signUp
);

export const AuthRouter = router;
