/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../error/AppError";
import { Car } from "../Car/car.model";
import { Booking } from "./booking.model";
import { User } from "../User/user.model";
import { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { paymentGatway } from "../../utils/paymentGatway";

const BookingCarFromDB = async (
  payload: Record<string, unknown>,
  user: JwtPayload
) => {
  const userData = await User.findOne({ email: user.userEmail });

  if (!userData) {
    throw new AppError(httpStatus.NOT_FOUND, " User not found!!");
  }
  // payload.car = payload.carId;
  payload.user = userData._id;

  const carData = await Car.findById(payload?.car);

  // check if the car is exists
  if (!carData) {
    throw new AppError(httpStatus.NOT_FOUND, "Car not found!!");
  }

  if (carData.status !== "available") {
    throw new AppError(httpStatus.BAD_REQUEST, "Car booking is not available");
  }
  payload.user = userData._id;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    carData.status = "unavailable";
    await Car.create([carData], { session });
    // Save the booking to the database
    const bookingData = await Booking.create([payload], { session });
    const result = bookingData[0];
    await (await result.populate("user")).populate("car");

    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
};
const getAllBookingsFromDB = async (query: Record<string, unknown>) => {
  const { carId, date } = query;

  const filter: any = {};

  if (carId) {
    filter.car = carId;
  }

  if (date) {
    filter.date = date;
  }
  // console.log(filter);
  const result = await Booking.find(filter).populate("car").populate("user");
  // console.log(result);

  return result;
};

const getMyBookingsFromDB = async (email: string) => {
  const user = await User.findOne({ email });

  if (!user?._id) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const bookings = await Booking.find({ user: user?._id })
    .populate("user")
    .populate("car");

  return bookings;
};
const updateBookeingFromDB = async (
  user: JwtPayload,
  payload: Record<string, unknown>,
  bookingId: string
) => {
  // check the user is exists or not
  const userData = await User.findOne({ email: user?.userEmail });

  if (!userData) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }

  //  check the booking using booking id and user id
  const isCarBooked = await Booking.findOne({
    user: userData?._id,
    _id: bookingId,
  });
  if (!isCarBooked) {
    throw new AppError(httpStatus.BAD_REQUEST, "Booking not found!");
  }

  // if status is pending, user can update data
  if (isCarBooked.status === "pending") {
    const updateBooking = await Booking.findOneAndUpdate(
      { _id: bookingId },
      payload,
      { new: true }
    );
    if (!updateBooking) {
      throw new AppError(httpStatus.BAD_REQUEST, "Bad request");
    }
    return updateBooking;
  } else {
    throw new AppError(httpStatus.BAD_REQUEST, "Bad request");
  }
};

const deleteBookingFromDB = async (user: JwtPayload, bookingId: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Check if the user exists
    const userData = await User.findOne({ email: user?.userEmail });
    if (!userData) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found!");
    }

    const isCarBooked = await Booking.findById(bookingId);

    if (!isCarBooked) {
      throw new AppError(httpStatus.NOT_FOUND, "Booking not found!");
    }
    // Check the booking status before deletion
    if (isCarBooked.status === "ongoing") {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "You can't delete the booking because it is ongoing."
      );
    }
    // Only allow deletion if the booking status is pending
    if (
      isCarBooked.status === "pending" ||
      isCarBooked.status === "completed"
    ) {
      const deleteBooking = await Booking.findOneAndUpdate(
        { _id: bookingId },
        { isDeleted: true },
        { new: true, session }
      );

      // Update the car's isBooked status to false
      await Car.findByIdAndUpdate(
        isCarBooked.car,
        { status: "available" },
        { new: true, session }
      );

      await session.commitTransaction();
      await session.endSession();

      return deleteBooking;
    } else {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Booking cannot be deleted unless it is pending."
      );
    }
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete booking!");
  }
};

const updateBookingStatus = async (user: JwtPayload, bookingId: string) => {
  const userData = await User.findOne({ email: user.userEmail });
  if (!userData) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  // check if the booking is exists
  const isBookingExists = await Booking.findOne({
    _id: bookingId,
  });

  if (!isBookingExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking not found");
  }
  // if booking is status pending then only user can update the booking

  const updateBooking = await Booking.findOneAndUpdate(
    { _id: bookingId },
    { status: "ongoing" },
    { new: true }
  );
  return updateBooking;
};

const completedBooking = async (user: JwtPayload, bookingId: string) => {
  // check the user is exists or not
  const userData = await User.findOne({ email: user?.userEmail });
  if (!userData) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }
  // check the booking using booking id and user id
  const isCarBooked = await Booking.findById(bookingId);
  if (!isCarBooked) {
    throw new AppError(httpStatus.BAD_REQUEST, "Booking not found!");
  }
  // car is exists or not
  const carData = await Car.findById(isCarBooked.car);
  if (!carData) {
    throw new AppError(httpStatus.NOT_FOUND, "Car not found!!");
  }
  const transactionId = uuidv4();
  // handle payment
  const paymentDetails = {
    transactionId,
    customerName: userData?.name,
    customerEmail: userData?.email,
    customerPhone: userData?.phone,
    customerAddress: userData?.address,
    totalCost: isCarBooked?.totalCost,
    bookingId: isCarBooked?._id,
    currency: "BDT",
  };
  const paymentSession = await paymentGatway(paymentDetails);

  return paymentSession;
};

export const BookingServices = {
  BookingCarFromDB,
  getAllBookingsFromDB,
  getMyBookingsFromDB,
  updateBookeingFromDB,
  deleteBookingFromDB,
  updateBookingStatus,
  completedBooking,
};
