import httpStatus from "http-status";
import AppError from "../../error/AppError";
import { Car } from "../Car/car.model";
import { Booking } from "./booking.model";
import { TBooking } from "./booking.interface";
import { User } from "../User/user.model";

const BookingCarFromDB = async (payload: TBooking) => {
  const { car: carId, date, startTime, user: userId, email } = payload;

  const car = await Car.findById(carId);
  // check if the car is exists
  if (!car) {
    throw new AppError(httpStatus.NOT_FOUND, `Car with ID ${carId} not found`);
  }

  if (car.status !== "available") {
    throw new AppError(httpStatus.BAD_REQUEST, "Car booking is not available");
  }
  // check if the user is exists
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `User with ID ${userId} not found`
    );
  }

  // Create a new booking instance
  const newBooking = new Booking({
    carId,
    date,
    car,
    user,
    startTime,
    endTime: null,
    totalCost: 0,
  });

  // Save the booking to the database
  const result = await newBooking.save();
  return result;
};

export const BookingServices = {
  BookingCarFromDB,
};
