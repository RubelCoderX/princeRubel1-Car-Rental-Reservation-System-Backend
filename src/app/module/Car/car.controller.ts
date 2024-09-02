/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResonse";
import { CarServices } from "./car.service";

const createCar = catchAsync(async (req, res) => {
  const result = await CarServices.createCarIntoDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Car created successfully",
    data: result,
  });
});
const getAllCars = catchAsync(async (req, res) => {
  const { name, carType, location, price } = req.query;

  const result = await CarServices.getAllCarsFromDB(
    name as string,
    carType as string,
    location as string,
    parseInt(price as string)
  );
  result.length < 1
    ? sendResponse(res, {
        success: true,
        statusCode: httpStatus.NOT_FOUND,
        message: "Data No Found",
        data: result,
      })
    : sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Cars retrieved successfully",
        data: result,
      });
});

const getSingleCar = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CarServices.getSingleCarFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "A Car retrieved successfully",
    data: result,
  });
});
const updateCar = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CarServices.updateCarIntoDB(id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Car updated successfully",
    data: result,
  });
});
const deleteCar = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CarServices.deleteCarFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Car Deleted successfully",
    data: result,
  });
});
const returnCar = catchAsync(async (req, res) => {
  const { bookingId } = req.params;
  const user = req.user;
  const result = await CarServices.returnCarIntoDB(bookingId, user);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Car return Successfully!!",
    data: result,
  });
});

// search car
const searchCars = catchAsync(async (req, res) => {
  const { features, seats, carType } = req.query as any;

  const result = await CarServices.searchCarsFromDB({
    features,
    carType,
    seats,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Cars searched successfully!",
    data: result,
  });
});

export const CarControllers = {
  createCar,
  getAllCars,
  getSingleCar,
  updateCar,
  deleteCar,
  returnCar,
  searchCars,
};
