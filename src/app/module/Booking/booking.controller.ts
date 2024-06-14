import httpStatus from "http-status";
import AppError from "../../error/AppError";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResonse";
import { Car } from "../Car/car.model";
import { TBooking } from "./booking.interface";
import { BookingServices } from "./booking.service";
import mongoose from "mongoose";

const createBooking = catchAsync(async (req, res) => {
  const { carId, date, startTime } = req.body;

  // checking if the user is authorized
  if (!req.user || !req.user.userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User not authorized");
  }

  const userId = req.user.userId;

  //checking if the car is exists
  const car = await Car.findById(carId);
  if (!car) {
    throw new AppError(httpStatus.NOT_FOUND, "Car is not found");
  }

  const bookingPayload: TBooking = {
    carId,
    date,
    startTime,
    car: car._id,
    user: new mongoose.Types.ObjectId(userId.toString()),
    email: req.user.userEmail,
  };

  const booking = await BookingServices.BookingCarFromDB(bookingPayload);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Car booked successfully",
    data: booking,
  });
});

const getAllBookings = catchAsync(async (req, res) => {
  const { carId, date } = req.query;
  const result = await BookingServices.getAllBookingsFromDB(
    carId as string,
    date as string
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Bookings retrieved successfully",
    data: result,
  });
});

export const BookingControllers = {
  createBooking,
  getAllBookings,
};
