"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingValidation = void 0;
const zod_1 = require("zod");
const BookingValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        carId: zod_1.z.string(),
        date: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
            message: "Date must be in the format YYYY-MM-DD",
        }),
        startTime: zod_1.z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
            message: "Start time must be in the format HH:MM in 24-hour format",
        }),
    }),
});
exports.BookingValidation = {
    BookingValidationSchema,
};
