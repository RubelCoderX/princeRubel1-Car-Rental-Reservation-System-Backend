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
exports.BookingServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const car_model_1 = require("../Car/car.model");
const booking_model_1 = require("./booking.model");
const user_model_1 = require("../User/user.model");
const mongoose_1 = __importDefault(require("mongoose"));
const uuid_1 = require("uuid");
const paymentGatway_1 = require("../../utils/paymentGatway");
const BookingCarFromDB = (payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield user_model_1.User.findOne({ email: user.userEmail });
    if (!userData) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, " User not found!!");
    }
    // payload.car = payload.carId;
    payload.user = userData._id;
    const carData = yield car_model_1.Car.findById(payload === null || payload === void 0 ? void 0 : payload.car);
    // check if the car is exists
    if (!carData) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Car not found!!");
    }
    if (carData.status !== "available") {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Car booking is not available");
    }
    payload.user = userData._id;
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        carData.status = "unavailable";
        yield car_model_1.Car.create([carData], { session });
        // Save the booking to the database
        const bookingData = yield booking_model_1.Booking.create([payload], { session });
        const result = bookingData[0];
        yield (yield result.populate("user")).populate("car");
        yield session.commitTransaction();
        yield session.endSession();
        return result;
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error(error);
    }
});
const getAllBookingsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { carId, date } = query;
    const filter = {};
    if (carId) {
        filter.car = carId;
    }
    if (date) {
        filter.date = date;
    }
    // console.log(filter);
    const result = yield booking_model_1.Booking.find(filter).populate("car").populate("user");
    // console.log(result);
    return result;
});
const getMyBookingsFromDB = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email });
    if (!(user === null || user === void 0 ? void 0 : user._id)) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    const bookings = yield booking_model_1.Booking.find({ user: user === null || user === void 0 ? void 0 : user._id })
        .populate("user")
        .populate("car");
    return bookings;
});
const updateBookeingFromDB = (user, payload, bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    // check the user is exists or not
    const userData = yield user_model_1.User.findOne({ email: user === null || user === void 0 ? void 0 : user.userEmail });
    if (!userData) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found!");
    }
    //  check the booking using booking id and user id
    const isCarBooked = yield booking_model_1.Booking.findOne({
        user: userData === null || userData === void 0 ? void 0 : userData._id,
        _id: bookingId,
    });
    if (!isCarBooked) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Booking not found!");
    }
    // if status is pending, user can update data
    if (isCarBooked.status === "pending") {
        const updateBooking = yield booking_model_1.Booking.findOneAndUpdate({ _id: bookingId }, payload, { new: true });
        if (!updateBooking) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Bad request");
        }
        return updateBooking;
    }
    else {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Bad request");
    }
});
const deleteBookingFromDB = (user, bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // Check if the user exists
        const userData = yield user_model_1.User.findOne({ email: user === null || user === void 0 ? void 0 : user.userEmail });
        if (!userData) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found!");
        }
        const isCarBooked = yield booking_model_1.Booking.findById(bookingId);
        if (!isCarBooked) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Booking not found!");
        }
        // Check the booking status before deletion
        if (isCarBooked.status === "ongoing") {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "You can't delete the booking because it is ongoing.");
        }
        // Only allow deletion if the booking status is pending
        if (isCarBooked.status === "pending" ||
            isCarBooked.status === "completed") {
            const deleteBooking = yield booking_model_1.Booking.findOneAndUpdate({ _id: bookingId }, { isDeleted: true }, { new: true, session });
            // Update the car's isBooked status to false
            yield car_model_1.Car.findByIdAndUpdate(isCarBooked.car, { status: "available" }, { new: true, session });
            yield session.commitTransaction();
            yield session.endSession();
            return deleteBooking;
        }
        else {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Booking cannot be deleted unless it is pending.");
        }
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Failed to delete booking!");
    }
});
const updateBookingStatus = (user, bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield user_model_1.User.findOne({ email: user.userEmail });
    if (!userData) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    // check if the booking is exists
    const isBookingExists = yield booking_model_1.Booking.findOne({
        _id: bookingId,
    });
    if (!isBookingExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Booking not found");
    }
    // if booking is status pending then only user can update the booking
    const updateBooking = yield booking_model_1.Booking.findOneAndUpdate({ _id: bookingId }, { status: "ongoing" }, { new: true });
    return updateBooking;
});
const completedBooking = (user, bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    // check the user is exists or not
    const userData = yield user_model_1.User.findOne({ email: user === null || user === void 0 ? void 0 : user.userEmail });
    if (!userData) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found!");
    }
    // check the booking using booking id and user id
    const isCarBooked = yield booking_model_1.Booking.findById(bookingId);
    if (!isCarBooked) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Booking not found!");
    }
    // car is exists or not
    const carData = yield car_model_1.Car.findById(isCarBooked.car);
    if (!carData) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Car not found!!");
    }
    const transactionId = (0, uuid_1.v4)();
    // handle payment
    const paymentDetails = {
        transactionId,
        customerName: userData === null || userData === void 0 ? void 0 : userData.name,
        customerEmail: userData === null || userData === void 0 ? void 0 : userData.email,
        customerPhone: userData === null || userData === void 0 ? void 0 : userData.phone,
        customerAddress: userData === null || userData === void 0 ? void 0 : userData.address,
        totalCost: isCarBooked === null || isCarBooked === void 0 ? void 0 : isCarBooked.totalCost,
        bookingId: isCarBooked === null || isCarBooked === void 0 ? void 0 : isCarBooked._id,
        currency: "BDT",
    };
    const paymentSession = yield (0, paymentGatway_1.paymentGatway)(paymentDetails);
    return paymentSession;
});
exports.BookingServices = {
    BookingCarFromDB,
    getAllBookingsFromDB,
    getMyBookingsFromDB,
    updateBookeingFromDB,
    deleteBookingFromDB,
    updateBookingStatus,
    completedBooking,
};
