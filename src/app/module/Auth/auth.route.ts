import express from "express";
import validateRequest from "../../middleware/validateRequest";
import { UserValidation } from "../User/user.validation";
import { AuthController } from "./auth.controller";
import { AuthValidation } from "./auth.validation";
import Auth from "../../middleware/auth";
import { USER_ROLE } from "../User/user.constant";

const router = express.Router();

router.post(
  "/signup",
  // upload.single("file"),
  // (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     req.body = JSON.parse(req.body.data);
  //     console.log(req.body);
  //     next();
  //   } catch (error) {
  //     next(error);
  //   }
  // },
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
router.put(
  "/user-update",
  Auth(USER_ROLE.admin, USER_ROLE.user),
  validateRequest(UserValidation.userUpdateValidationSchema),
  AuthController.updateUserFromDB
);
router.get("/all-user", Auth(USER_ROLE.admin), AuthController.getAllUserFromDB);
router.get(
  "/me",
  Auth(USER_ROLE.admin, USER_ROLE.user),
  AuthController.getMeFromDB
);
router.delete("/:userId", AuthController.deleteFromDB);
router.patch(
  "/update-role/:userId",
  Auth(USER_ROLE.admin),
  AuthController.makeAdmin
);

export const AuthRouter = router;
