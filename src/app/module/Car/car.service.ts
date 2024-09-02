/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../error/AppError";
import { TCar, TSearchCriteria } from "./car.interface";
import { Car } from "./car.model";
import { Booking } from "../Booking/booking.model";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../User/user.model";
import mongoose from "mongoose";
import { calculateTotalPrice } from "./car.utils";

const createCarIntoDB = async (payload: TCar) => {
  const result = await Car.create(payload);
  return result;
};
const getAllCarsFromDB = async (
  name: string,
  carType: string,
  location: string,
  price: number
) => {
  let query: any = {
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

  const result = await Car.find(query);
  return result;
};
const getSingleCarFromDB = async (id: string) => {
  const result = await Car.findById(id);
  return result;
};
const updateCarIntoDB = async (id: string, payload: Partial<TCar>) => {
  const { vehicleSpecification, features, ...reemainingPayload } = payload;
  const modifideUpdateData: Record<string, unknown> = {
    ...reemainingPayload,
  };
  // console.log("modifideUpdateData", modifideUpdateData);
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
  const result = await Car.findOneAndUpdate({ _id: id }, modifideUpdateData, {
    new: true,
    runValidators: true,
  });

  return result;
};
const deleteCarFromDB = async (id: string) => {
  const result = await Car.findOneAndUpdate(
    { _id: id },
    { isDelete: true },
    {
      new: true,
    }
  );
  return result;
};

const returnCarIntoDB = async (bookingId: string, user: JwtPayload) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const userData = await User.findOne({ _id: user?.userId });
    if (!userData) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }
    if (userData.role !== "admin") {
      throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized access");
    }
    const booking = await Booking.findById(bookingId).session(session);
    if (!booking) {
      throw new AppError(httpStatus.NOT_FOUND, "Booking not found");
    }
    const car = await Car.findById(booking.car).session(session);
    if (!car) {
      throw new AppError(httpStatus.NOT_FOUND, "Car not Found!!");
    }

    const { pickUpDate, pickTime } = booking;
    const pricePerHour = car.pricePerHour;

    const { totalCost, dropOffDate, dropTime } = calculateTotalPrice(
      pickUpDate,
      pickTime,
      pricePerHour
    );

    // update booking status
    booking.totalCost = totalCost;
    booking.dropOffDate = dropOffDate;
    booking.dropTime = dropTime;
    booking.status = "completed";

    await booking.save({ session });

    // update cars status
    car.status = "available";
    await car.save({ session });

    // Re-query the booking to populate the car field
    const populatedBooking = await Booking.findById(bookingId)
      .populate("car")
      .populate("user")
      .session(session);
    await session.commitTransaction();
    session.endSession();
    return populatedBooking;
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

// search car
const searchCarsFromDB = async ({
  features,
  carType,
  seats,
}: TSearchCriteria) => {
  const query: any = { status: "available" };

  if (carType) {
    query.carType = carType;
  }
  if (seats) {
    query.maxSeats = seats;
  }
  if (features) {
    query.features = { $in: [features] };
  }

  const result = await Car.find(query);

  return result;
};

export const CarServices = {
  createCarIntoDB,
  getAllCarsFromDB,
  getSingleCarFromDB,
  updateCarIntoDB,
  deleteCarFromDB,
  returnCarIntoDB,
  searchCarsFromDB,
};
