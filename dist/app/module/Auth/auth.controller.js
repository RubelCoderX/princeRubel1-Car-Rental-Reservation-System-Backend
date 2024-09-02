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
exports.AuthController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../config"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResonse_1 = __importDefault(require("../../utils/sendResonse"));
const auth_service_1 = require("./auth.service");
const signUp = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = req.body;
    const result = yield auth_service_1.AuthService.createSignUp(userData);
    (0, sendResonse_1.default)(res, {
        success: true,
        statusCode: 201,
        message: "User registered successfully",
        data: result,
    });
}));
const signIn = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, accessToken, refreshToken } = yield auth_service_1.AuthService.createSignIn(req.body);
    res.cookie("refreshToken", refreshToken, {
        secure: config_1.default.NODE_ENV === "production" ? true : false,
        httpOnly: true,
    });
    (0, sendResonse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "User logged in successfully",
        data: user,
        token: accessToken,
    });
}));
const refreshTokenFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.cookies;
    const result = yield auth_service_1.AuthService.refreshTokenIntoDB(refreshToken);
    (0, sendResonse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Token refreshed successfully",
        data: result,
    });
}));
const getAllUserFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.AuthService.getAllUserInDB();
    (0, sendResonse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "User is retrived successfully",
        data: result,
    });
}));
const updateUserFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userEmail } = req.user;
    const result = yield auth_service_1.AuthService.updateUserIntoDB(userEmail, req.body);
    (0, sendResonse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "User updated successfully",
        data: result,
    });
}));
const getMeFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const result = yield auth_service_1.AuthService.getMeIntoDB(userId);
    (0, sendResonse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "User retrived successfully",
        data: result,
    });
}));
const deleteFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const result = yield auth_service_1.AuthService.delelteUserIntoDB(userId);
    (0, sendResonse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "User deleted successfully",
        data: result,
    });
}));
const makeAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const result = yield auth_service_1.AuthService.toggleAdminRoleInDB(userId);
    (0, sendResonse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User role updated successfully!",
        data: result,
    });
}));
exports.AuthController = {
    signUp,
    signIn,
    refreshTokenFromDB,
    updateUserFromDB,
    getAllUserFromDB,
    getMeFromDB,
    deleteFromDB,
    makeAdmin,
};
