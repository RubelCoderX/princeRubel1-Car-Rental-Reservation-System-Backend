import { z } from "zod";

const BookingValidationSchema = z.object({
  body: z.object({
    user: z.string({ required_error: "User is required" }),
    car: z.string({ required_error: "Car is required" }),
    totalCost: z.number().nonnegative().default(0),
    status: z.enum(["pending", "ongoing", "complete"]).default("pending"),
    identity: z.string().nonempty("Identity is required"),
    identityNo: z.string().nonempty("Identity number is required"),
    drivingLicenseNo: z.string().nonempty("Driving license number is required"),
    isDeleted: z.boolean().default(false),
  }),
});

export const BookingValidation = {
  BookingValidationSchema,
};
