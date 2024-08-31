"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingValidation = void 0;
const zod_1 = require("zod");
const BookingValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        user: zod_1.z.string(),
        car: zod_1.z.string(),
        location: zod_1.z.string().nonempty("Location is required"),
        pickUpDate: zod_1.z.string(),
        pickUpTime: zod_1.z.string(),
        dropOffDate: zod_1.z.string(),
        dropOffTime: zod_1.z.string(),
        isCanceled: zod_1.z.boolean().default(false),
        identity: zod_1.z.string().nonempty("Identity type is required"),
        identityNo: zod_1.z.string().nonempty("Identity number is required"),
        drivingLicenseNo: zod_1.z.string().nonempty("Driving license number is required"),
    }),
});
exports.BookingValidation = {
    BookingValidationSchema,
};
