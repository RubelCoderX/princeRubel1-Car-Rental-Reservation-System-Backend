import { model, Schema } from "mongoose";
import { TBooking } from "./booking.interface";

const bookingSchema = new Schema<TBooking>(
  {
    date: {
      type: String,
      required: [true, "Date is required"],
    },
    startTime: {
      type: String,
      required: [true, "Start Time is required"],
    },
    endTime: {
      type: String,
      default: null,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    carId: {
      type: Schema.Types.ObjectId,
      ref: "Car",
      required: [true, "Car is required"],
    },
    totalCost: {
      type: Number,
      default: 0,
    },
    email: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Booking = model<TBooking>("Booking", bookingSchema);
