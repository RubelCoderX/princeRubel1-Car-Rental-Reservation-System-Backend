import httpStatus from "http-status";
import AppError from "../../error/AppError";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResonse";
import { Car } from "../Car/car.model";
import { TBooking } from "./booking.interface";
import { BookingServices } from "./booking.service";

const createBooking = catchAsync(async (req, res) => {
  const { carId, date, startTime } = req.body;

  // checking if the user is authorized
  if (!req.user || !req.user.userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User donot authorized");
  }

  const car = await Car.findById(carId);
  if (!car) {
    throw new AppError(httpStatus.NOT_FOUND, "Car is not found");
  }

  const bookingPayload: TBooking = {
    carId,
    date,
    startTime,
    car: car._id,
    user: req.user.userId,
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

export const BookingControllers = {
  createBooking,
};
