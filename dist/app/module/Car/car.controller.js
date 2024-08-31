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
exports.CarControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResonse_1 = __importDefault(require("../../utils/sendResonse"));
const car_service_1 = require("./car.service");
const createCar = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield car_service_1.CarServices.createCarIntoDB(req.body);
    (0, sendResonse_1.default)(res, {
        success: true,
        statusCode: 201,
        message: "Car created successfully",
        data: result,
    });
}));
const getAllCars = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, carType, location, price } = req.query;
    const result = yield car_service_1.CarServices.getAllCarsFromDB(name, carType, location, parseInt(price));
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
            message: "Cars retrieved successfully",
            data: result,
        });
}));
const getSingleCar = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield car_service_1.CarServices.getSingleCarFromDB(id);
    (0, sendResonse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "A Car retrieved successfully",
        data: result,
    });
}));
const updateCar = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield car_service_1.CarServices.updateCarIntoDB(id, req.body);
    (0, sendResonse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Car updated successfully",
        data: result,
    });
}));
const deleteCar = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield car_service_1.CarServices.deleteCarFromDB(id);
    (0, sendResonse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Car Deleted successfully",
        data: result,
    });
}));
const returnCar = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bookingId, endTime } = req.body;
    const result = yield car_service_1.CarServices.returnCarIntoDB(bookingId, endTime);
    (0, sendResonse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Car return Successfully!!",
        data: result,
    });
}));
// search car
const searchCars = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req.body);
    const result = yield car_service_1.CarServices.searchCarsFromDB(req.body);
    (0, sendResonse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Cars searched successfully!",
        data: result,
    });
}));
exports.CarControllers = {
    createCar,
    getAllCars,
    getSingleCar,
    updateCar,
    deleteCar,
    returnCar,
    searchCars,
};
