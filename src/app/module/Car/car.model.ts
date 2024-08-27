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
      required: [true, "Features is required"],
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
    pricePerHour: {
      type: Number,
      required: [true, "PricePerHour is required"],
    },
    status: {
      type: String,
      default: "available",
    },
    carImgUrl: {
      type: [String],
      required: [true, "Car imgUrl is required"],
    },
    vehicleSpecification: {
      type: [String],
      required: [true, "Vehicle Specification is required"],
    },
    maxSeats: {
      type: Number,
      required: [true, "Max Seats is required"],
    },
  },
  {
    timestamps: true,
  }
);

export const Car = model<TCar>("Car", carSchema);
