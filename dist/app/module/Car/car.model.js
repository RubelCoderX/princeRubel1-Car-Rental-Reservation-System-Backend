"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Car = void 0;
const mongoose_1 = require("mongoose");
const carSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Car Name must be required"],
    },
    description: {
        type: String,
        required: [true, "Car Description must be required"],
    },
    color: {
        type: String,
        required: [true, "Car color is required"],
    },
    isElectric: {
        type: Boolean,
        required: [true, "isElectric is required"],
    },
    features: {
        type: [String],
        required: [true, "Features is required"],
    },
    isDelete: {
        type: Boolean,
        default: false,
    },
    pricePerHour: {
        type: Number,
        required: [true, "PricePerHour is required"],
    },
    status: {
        type: String,
        default: "available",
    },
}, {
    timestamps: true,
});
exports.Car = (0, mongoose_1.model)("Car", carSchema);
