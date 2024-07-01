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
exports.AuthService = void 0;
const AppError_1 = __importDefault(require("../../error/AppError"));
const user_model_1 = require("../User/user.model");
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const createSignUp = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the user already exists
    const existingUser = yield user_model_1.User.findOne({ email: userData.email });
    if (existingUser) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User already Exists!!");
    }
    const newUser = new user_model_1.User(userData);
    const result = yield newUser.save();
    return result;
});
const createSignIn = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.isUserExitsByEmail(payload.email);
    // checking if the user not found
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not Found");
    }
    // chcek password matched
    if (!(yield user_model_1.User.isPasswordMatched(payload === null || payload === void 0 ? void 0 : payload.password, user.password))) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Password do not matched!!");
    }
    // create token send to the client
    const jwtPaylod = {
        userEmail: user.email,
        role: user.role,
    };
    const accessToken = jsonwebtoken_1.default.sign(jwtPaylod, config_1.default.jwt_access_secret, {
        expiresIn: "10d",
    });
    return {
        user,
        accessToken: accessToken,
    };
});
exports.AuthService = {
    createSignUp,
    createSignIn,
};
