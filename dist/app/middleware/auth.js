"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const AppError_1 = __importDefault(require("../error/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const Auth = (...requiredRole) => {
    return (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const authHeader = req.headers.authorization;
        // check if the token send client
        if (!authHeader) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "You are not Authorized!!");
        }
        const token = authHeader.split("Bearer ")[1];
        // check if the token is valid
        jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret, function (err, decoded) {
            if (err) {
                throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "You are not Authorized!!two");
            }
            const user = decoded;
            if (requiredRole && !requiredRole.includes(user.role)) {
                res.status(http_status_1.default.UNAUTHORIZED).json({
                    success: false,
                    statusCode: http_status_1.default.UNAUTHORIZED,
                    message: "You have no access to this route",
                });
                return;
            }
            //decoded
            req.user = user;
            next();
        });
    }));
};
exports.default = Auth;
