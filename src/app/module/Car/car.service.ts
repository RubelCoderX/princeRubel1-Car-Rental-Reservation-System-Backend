import httpStatus from "http-status";
import AppError from "../../error/AppError";
import { TCar } from "./car.interface";
import { Car } from "./car.model";
import { Booking } from "../Booking/booking.model";

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
  const booking = await Booking.findOneAndUpdate(
    { _id: bookingId },
    { $set: { endTime } },
    { new: true }
  )
    .populate("car")
    .populate("user");

  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking not found");
  }

  const car = await Car.findById(booking.car);
  if (!car) {
    throw new AppError(httpStatus.NOT_FOUND, "Car not Found!!");
  }

  // Update the booking details
  booking.endTime = endTime;

  const startTime = booking.startTime;
  const pricePerHour = car?.pricePerHour;
  console.log(pricePerHour);

  //

  // Save the updated booking
  await booking.save();
};

export const CarServices = {
  createCarIntoDB,
  getAllCarsFromDB,
  getSingleCarFromDB,
  updateCarIntoDB,
  deleteCarFromDB,
  returnCarIntoDB,
};
