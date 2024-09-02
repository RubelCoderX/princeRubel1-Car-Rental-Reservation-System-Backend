import { model, Schema } from "mongoose";
import { TBooking } from "./booking.interface";
import moment from "moment";

const bookingSchema = new Schema<TBooking>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    car: { type: Schema.Types.ObjectId, ref: "Car", required: true },
    pickUpDate: {
      type: String,
      required: true,
      default: () => moment().format("DD-MM-YYYY"),
    },
    pickTime: {
      type: String,
      required: true,
      default: () => moment().format("HH:mm"),
    },
    dropOffDate: { type: String, default: "" },
    dropTime: { type: String, default: "" },
    totalCost: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "ongoing", "completed", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    transactionId: { type: String, default: "" },
    identity: { type: String, required: true },
    identityNo: { type: String, required: true },
    drivingLicenseNo: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Query Middleware
bookingSchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

bookingSchema.pre("findOne", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

export const Booking = model<TBooking>("Booking", bookingSchema);
