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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
const user_model_1 = require("../User/user.model");
const mongoose_1 = __importDefault(require("mongoose"));
const car_utils_1 = require("./car.utils");
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
    const { vehicleSpecification, features } = payload, reemainingPayload = __rest(payload, ["vehicleSpecification", "features"]);
    const modifideUpdateData = Object.assign({}, reemainingPayload);
    // for features
    if (features && Object.keys(features).length) {
        for (const [key, value] of Object.entries(features)) {
            modifideUpdateData[`features.${key}`] = value;
        }
    }
    // for vehicleSpecification
    if (vehicleSpecification && Object.keys(vehicleSpecification).length) {
        for (const [key, value] of Object.entries(vehicleSpecification)) {
            modifideUpdateData[`vehicleSpecification.${key}`] = value;
        }
    }
    const result = yield car_model_1.Car.findOneAndUpdate({ _id: id }, modifideUpdateData, {
        new: true,
        runValidators: true,
    });
    return result;
});
const deleteCarFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield car_model_1.Car.findOneAndUpdate({ _id: id }, { isDelete: true }, {
        new: true,
    });
    return result;
});
const returnCarIntoDB = (bookingId, user) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const userData = yield user_model_1.User.findOne({ _id: user === null || user === void 0 ? void 0 : user.userId });
        if (!userData) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
        }
        if (userData.role !== "admin") {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized access");
        }
        const booking = yield booking_model_1.Booking.findById(bookingId).session(session);
        if (!booking) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Booking not found");
        }
        const car = yield car_model_1.Car.findById(booking.car).session(session);
        if (!car) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Car not Found!!");
        }
        const { pickUpDate, pickTime } = booking;
        const pricePerHour = car.pricePerHour;
        const { totalCost, dropOffDate, dropTime } = (0, car_utils_1.calculateTotalPrice)(pickUpDate, pickTime, pricePerHour);
        // update booking status
        booking.totalCost = totalCost;
        booking.dropOffDate = dropOffDate;
        booking.dropTime = dropTime;
        booking.status = "completed";
        yield booking.save({ session });
        // update cars status
        car.status = "available";
        yield car.save({ session });
        // Re-query the booking to populate the car field
        const populatedBooking = yield booking_model_1.Booking.findById(bookingId)
            .populate("car")
            .populate("user")
            .session(session);
        yield session.commitTransaction();
        session.endSession();
        return populatedBooking;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, error.message);
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
