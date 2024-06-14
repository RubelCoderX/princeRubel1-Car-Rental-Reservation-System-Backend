import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../error/AppError";
import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { TUserRole } from "../module/User/user.interface";

const Auth = (requiredRole: TUserRole) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    // check if the token send client
    //
    if (!authHeader) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not Authorized!!");
    }

    const token = authHeader.split("Bearer ")[1];

    // check if the token is valid
    jwt.verify(
      token,
      config.jwt_access_secret as string,
      function (err, decoded) {
        if (err) {
          throw new AppError(
            httpStatus.UNAUTHORIZED,
            "You are not Authorized!!"
          );
        }
        const user = decoded as JwtPayload;
        if (!user.userId) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            "User ID not found in token"
          );
        }

        if (requiredRole && user.role !== requiredRole) {
          throw new AppError(
            httpStatus.FORBIDDEN,
            "You do not have access to this resource!!"
          );
        }

        //decoded
        // console.log(decoded);
        req.user = user;

        next();
      }
    );
  });
};

export default Auth;
