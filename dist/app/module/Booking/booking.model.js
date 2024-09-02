"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booking = void 0;
const mongoose_1 = require("mongoose");
const moment_1 = __importDefault(require("moment"));
const bookingSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    car: { type: mongoose_1.Schema.Types.ObjectId, ref: "Car", required: true },
    pickUpDate: {
        type: String,
        required: true,
        default: () => (0, moment_1.default)().format("DD-MM-YYYY"),
    },
    pickTime: {
        type: String,
        required: true,
        default: () => (0, moment_1.default)().format("HH:mm"),
    },
    dropOffDate: { type: String, default: "" },
    dropTime: { type: String, default: "" },
    totalCost: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ["pending", "ongoing", "completed", "cancelled"],
        default: "pending",
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending",
    },
    transactionId: { type: String, default: "" },
    identity: { type: String, required: true },
    identityNo: { type: String, required: true },
    drivingLicenseNo: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true,
});
// Query Middleware
bookingSchema.pre("find", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
bookingSchema.pre("findOne", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
exports.Booking = (0, mongoose_1.model)("Booking", bookingSchema);
