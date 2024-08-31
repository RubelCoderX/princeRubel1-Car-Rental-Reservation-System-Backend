"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booking = void 0;
const mongoose_1 = require("mongoose");
const bookingSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    car: { type: mongoose_1.Schema.Types.ObjectId, ref: "Car", required: true },
    totalCost: { type: Number, default: 0 },
    isCanceled: { type: Boolean, default: false },
    status: {
        type: String,
        enum: ["pending", "ongoing", "complete"],
        default: "pending",
    },
    identity: { type: String, required: true },
    identityNo: { type: String, required: true },
    drivingLicenseNo: { type: String, required: true },
}, {
    timestamps: true,
});
exports.Booking = (0, mongoose_1.model)("Booking", bookingSchema);
