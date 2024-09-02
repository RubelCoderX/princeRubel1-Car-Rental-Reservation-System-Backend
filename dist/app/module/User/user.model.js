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
exports.User = void 0;
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../config"));
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        unique: true,
        required: [true, "Name is required"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
    },
    image: {
        type: String,
    },
    phone: {
        type: String,
        required: [true, "Phone Number is required"],
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    address: {
        type: String,
        // required: [true, "Address is required"],
    },
}, {
    timestamps: true,
});
// hashed the password field
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        this.password = yield bcrypt_1.default.hash(this.password, Number(config_1.default.bcrypt_salt_rounds));
        next();
    });
});
// Static method to check if a user exists by
userSchema.statics.isUserExitsByEmail = function (email) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.User.findOne({ email });
    });
};
// Static method to check if the password matches
userSchema.statics.isPasswordMatched = function (palinTextPassword, hashedTextPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(palinTextPassword, hashedTextPassword);
    });
};
exports.User = (0, mongoose_1.model)("User", userSchema);
