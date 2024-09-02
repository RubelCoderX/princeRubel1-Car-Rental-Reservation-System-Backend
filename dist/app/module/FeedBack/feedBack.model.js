"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedBack = void 0;
const mongoose_1 = require("mongoose");
const moment_1 = __importDefault(require("moment"));
const feedBackSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    message: {
        type: String,
        required: [true, "Message is required"],
    },
    rating: {
        type: Number,
        required: [true, "Rating is required"],
    },
    profile: {
        type: String,
        required: [true, "Profile is required"],
    },
    date: {
        type: String,
        required: true,
        default: () => (0, moment_1.default)().format("DD-MM-YYYY"),
    },
});
exports.FeedBack = (0, mongoose_1.model)("FeedBack", feedBackSchema);
