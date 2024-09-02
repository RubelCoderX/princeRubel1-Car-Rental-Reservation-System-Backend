"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingValidation = void 0;
const zod_1 = require("zod");
const BookingValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        user: zod_1.z.string({ required_error: "User is required" }),
        car: zod_1.z.string({ required_error: "Car is required" }),
        totalCost: zod_1.z.number().nonnegative().default(0),
        status: zod_1.z.enum(["pending", "ongoing", "completed"]).default("pending"),
        identity: zod_1.z.string().nonempty("Identity is required"),
        identityNo: zod_1.z.string().nonempty("Identity number is required"),
        drivingLicenseNo: zod_1.z.string().nonempty("Driving license number is required"),
        isDeleted: zod_1.z.boolean().default(false),
    }),
});
exports.BookingValidation = {
    BookingValidationSchema,
};
