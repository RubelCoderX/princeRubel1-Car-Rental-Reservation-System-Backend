"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateTotalPrice = void 0;
const moment_1 = __importDefault(require("moment"));
const calculateTotalPrice = (pickUpDate, pickTime, pricePerHour = 55) => {
    const pickUpDateTime = (0, moment_1.default)(`${pickUpDate}T${pickTime}`, "DD-MM-YYYYTHH:mm");
    const drofOffDateTime = (0, moment_1.default)();
    // calculate duration in hours
    const duration = moment_1.default.duration(drofOffDateTime.diff(pickUpDateTime));
    const hours = duration.hours();
    const minutes = duration.minutes();
    // calculate total price
    let totalCost = 0;
    // calculate total cost based on minutes
    if (minutes > 0 && minutes <= 30) {
        totalCost += pricePerHour / 2;
    }
    else if (minutes > 30 && minutes <= 60) {
        totalCost += pricePerHour;
    }
    // add full cost for the remaining hours
    totalCost += hours * pricePerHour;
    const dropOffDate = drofOffDateTime.format("DD-MM-YYYY");
    const dropTime = drofOffDateTime.format("HH:mm");
    return {
        totalCost,
        dropOffDate,
        dropTime,
    };
};
exports.calculateTotalPrice = calculateTotalPrice;
