import { Types } from "mongoose";

export type TBooking = {
  date: string;
  startTime: string;
  endTime?: string | null;
  user: Types.ObjectId;
  carId: Types.ObjectId;
  totalCost?: number;
  email: string;
};
