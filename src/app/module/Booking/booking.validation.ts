import { z } from "zod";

const BookingValidationSchema = z.object({
  body: z.object({
    carId: z
      .string()
      .min(1, { message: "Car ID must be provided and must be a string" }),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: "Date must be in the format YYYY-MM-DD",
    }),
    startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
      message: "Start time must be in the format HH:MM in 24-hour format",
    }),
  }),
});

export const BookingValidation = {
  BookingValidationSchema,
};
