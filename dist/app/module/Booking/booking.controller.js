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
exports.BookingControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResonse_1 = __importDefault(require("../../utils/sendResonse"));
const booking_service_1 = require("./booking.service");
const createBooking = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const booking = yield booking_service_1.BookingServices.BookingCarFromDB(req.body, req.user);
    (0, sendResonse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Car booked successfully",
        data: booking,
    });
}));
const getAllBookings = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield booking_service_1.BookingServices.getAllBookingsFromDB(query);
    result.length < 1
        ? (0, sendResonse_1.default)(res, {
            success: true,
            statusCode: http_status_1.default.NOT_FOUND,
            message: "Data No Found",
            data: result,
        })
        : (0, sendResonse_1.default)(res, {
            success: true,
            statusCode: 200,
            message: "Bookings retrieved successfully",
            data: result,
        });
}));
const getMyBookings = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userEmail = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userEmail;
    // Call the service method to get bookings by user email
    const result = yield booking_service_1.BookingServices.getMyBookingsFromDB(userEmail);
    result.length < 1
        ? (0, sendResonse_1.default)(res, {
            success: true,
            statusCode: http_status_1.default.NOT_FOUND,
            message: "Data No Found",
            data: result,
        })
        : (0, sendResonse_1.default)(res, {
            success: true,
            statusCode: 200,
            message: "My Bookings retrieved successfully",
            data: result,
        });
}));
exports.BookingControllers = {
    createBooking,
    getAllBookings,
    getMyBookings,
};
