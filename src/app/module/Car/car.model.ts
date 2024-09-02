import { model, Schema } from "mongoose";
import { TCar } from "./car.interface";

const carSchema = new Schema<TCar>(
  {
    name: {
      type: String,
      required: [true, "Car Name must be required"],
    },
    description: {
      type: String,
      required: [true, "Car Description must be required"],
    },
    color: {
      type: String,
      required: [true, "Car color is required"],
    },
    isElectric: {
      type: Boolean,
      required: [true, "isElectric is required"],
    },
    features: {
      type: [String],
      required: [true, "Features are required"],
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
    pricePerHour: {
      type: Number,
      required: [true, "Price per hour is required"],
    },
    status: {
      type: String,
      enum: ["available", "unavailable"],
      default: "available",
    },
    carImgUrl: {
      type: [String],
      required: [true, "Car image URL is required"],
    },
    vehicleSpecification: {
      type: [String],
      required: [true, "Vehicle specifications are required"],
    },
    maxSeats: {
      type: Number,
      required: [true, "Max seats are required"],
    },
    rating: {
      type: Number,
      default: 0,
    },
    gearType: {
      type: String,
      required: [true, "Gear type is required"],
    },
    fuelType: {
      type: String,
      required: [true, "Fuel type is required"],
    },
    carType: {
      type: String,
      required: [true, "Car type is required"],
    },
  },
  {
    timestamps: true,
  }
);

export const Car = model<TCar>("Car", carSchema);
