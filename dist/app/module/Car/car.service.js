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
exports.CarServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const car_model_1 = require("./car.model");
const booking_model_1 = require("../Booking/booking.model");
const mongoose_1 = __importDefault(require("mongoose"));
const createCarIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield car_model_1.Car.create(payload);
    return result;
});
const getAllCarsFromDB = (name, carType, location, price) => __awaiter(void 0, void 0, void 0, function* () {
    let query = {
        isDelete: { $ne: true },
    };
    if (name) {
        const searchRegex = new RegExp(name, "i");
        query = {
            $or: [{ name: searchRegex }],
        };
    }
    if (carType) {
        const searchRegex = new RegExp(carType, "i");
        query = {
            $or: [{ carType: searchRegex }],
        };
    }
    if (location) {
        const searchRegex = new RegExp(location, "i");
        query = {
            $or: [{ location: searchRegex }],
        };
    }
    if (price > 0) {
        query.pricePerHour = { $lte: price };
    }
    const result = yield car_model_1.Car.find(query);
    return result;
});
const getSingleCarFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield car_model_1.Car.findById(id);
    return result;
});
const updateCarIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield car_model_1.Car.findOneAndUpdate({ _id: id }, payload, {
        new: true,
    });
    return result;
});
const deleteCarFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield car_model_1.Car.findOneAndUpdate({ _id: id }, { isDelete: true }, {
        new: true,
    });
    return result;
});
const returnCarIntoDB = (bookingId, endTime) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const booking = yield booking_model_1.Booking.findById(bookingId);
        if (!booking) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Booking not found");
        }
        const car = yield car_model_1.Car.findById(booking.car);
        if (!car) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Car not Found!!");
        }
        const startTime = booking.startTime;
        const pricePerHour = car === null || car === void 0 ? void 0 : car.pricePerHour;
        // convert time to date
        const sart = new Date(`${booking.date}T${startTime}`);
        const end = new Date(`${booking.date}T${endTime}`);
        // calculation hour
        const duration = (end.getTime() - sart.getTime()) / (1000 * 60 * 60);
        // calculate total cost
        const totalCost = duration * pricePerHour;
        // update car details
        yield car_model_1.Car.findOneAndUpdate({ _id: car._id }, {
            status: "available",
        }, { new: true, session });
        // update booking details
        const updateBooking = yield booking_model_1.Booking.findOneAndUpdate({ _id: bookingId }, { endTime, totalCost }, { new: true, session })
            .populate("car")
            .populate("user");
        yield session.commitTransaction();
        yield session.endSession();
        return updateBooking;
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error(error);
    }
});
// search car
const searchCarsFromDB = (_a) => __awaiter(void 0, [_a], void 0, function* ({ features, carType, seats, }) {
    const query = { status: "available" };
    if (carType) {
        query.carType = carType;
    }
    if (seats) {
        query.maxSeats = seats;
    }
    if (features) {
        query.features = { $in: [features] };
    }
    const result = yield car_model_1.Car.find(query);
    return result;
});
exports.CarServices = {
    createCarIntoDB,
    getAllCarsFromDB,
    getSingleCarFromDB,
    updateCarIntoDB,
    deleteCarFromDB,
    returnCarIntoDB,
    searchCarsFromDB,
};
