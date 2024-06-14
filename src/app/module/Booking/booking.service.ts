import httpStatus from "http-status";
import AppError from "../../error/AppError";
import { Car } from "../Car/car.model";
import { Booking } from "./booking.model";
import { User } from "../User/user.model";
import { JwtPayload } from "jsonwebtoken";
import mongoose, { startSession } from "mongoose";

const BookingCarFromDB = async (
  payload: Record<string, unknown>,
  userData: JwtPayload
) => {
  const userInformation = await User.findOne({ email: userData.userEmail });

  if (!userInformation) {
    throw new AppError(httpStatus.NOT_FOUND, " User not found!!");
  }

  const carData = await Car.findById(payload.carId);

  // check if the car is exists
  if (!carData) {
    throw new AppError(httpStatus.NOT_FOUND, "Car not found!!");
  }

  if (carData.status !== "available") {
    throw new AppError(httpStatus.BAD_REQUEST, "Car booking is not available");
  }
  payload.user = userInformation._id;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    carData.status = "unavailable";
    await Car.create([carData], { session });
    // Save the booking to the database
    const bookingData = await Booking.create([payload], { session });
    const result = bookingData[0];
    await (await result.populate("user")).populate("carId");

    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
};
const getAllBookingsFromDB = async (carId: string, date: string) => {
  const query: any = {};

  if (carId) {
    query.carId = carId;
  }
  if (date) {
    query.date = date;
  }
  const result = await Booking.find(query).populate("user").populate("carId");

  return result;
};

const getMyBookingsFromDB = async (email: string) => {
  const user = await User.findOne({ email });

  if (!user?._id) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const bookings = await Booking.find({ user: user?._id })
    .populate("user")
    .populate("carId");

  return bookings;
};

export const BookingServices = {
  BookingCarFromDB,
  getAllBookingsFromDB,
  getMyBookingsFromDB,
};
