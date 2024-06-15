import httpStatus from "http-status";
import AppError from "../../error/AppError";
import { TCar } from "./car.interface";
import { Car } from "./car.model";
import { Booking } from "../Booking/booking.model";
import mongoose from "mongoose";

const createCarIntoDB = async (payload: TCar) => {
  const result = await Car.create(payload);
  return result;
};
const getAllCarsFromDB = async () => {
  const result = await Car.find();
  return result;
};
const getSingleCarFromDB = async (id: string) => {
  const result = await Car.findById(id);
  return result;
};
const updateCarIntoDB = async (id: string, payload: Partial<TCar>) => {
  const result = await Car.findOneAndUpdate({ _id: id }, payload, {
    new: true,
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
const returnCarIntoDB = async (bookingId: string, endTime: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      throw new AppError(httpStatus.NOT_FOUND, "Booking not found");
    }

    const car = await Car.findById(booking.car);
    if (!car) {
      throw new AppError(httpStatus.NOT_FOUND, "Car not Found!!");
    }

    const startTime = booking.startTime;
    const pricePerHour = car?.pricePerHour;

    // convert time to date
    const sart = new Date(`${booking.date}T${startTime}`);
    const end = new Date(`${booking.date}T${endTime}`);

    // calculation hour
    const duration = (end.getTime() - sart.getTime()) / (1000 * 60 * 60);
    // calculate total cost
    const totalCost = duration * pricePerHour;

    // update car details
    await Car.findOneAndUpdate(
      { _id: car._id },
      {
        status: "available",
      },
      { new: true, session }
    );
    // update booking details
    const updateBooking = await Booking.findOneAndUpdate(
      { _id: bookingId },
      { endTime, totalCost },
      { new: true, session }
    )
      .populate("car")
      .populate("user");

    await session.commitTransaction();
    await session.endSession();

    return updateBooking;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
};

export const CarServices = {
  createCarIntoDB,
  getAllCarsFromDB,
  getSingleCarFromDB,
  updateCarIntoDB,
  deleteCarFromDB,
  returnCarIntoDB,
};
