import { z } from "zod";

const carSchemaValidation = z.object({
  body: z.object({
    name: z.string().min(1, { message: "Car Name must be required" }),
    description: z
      .string()
      .min(1, { message: "Car Description must be required" }),
    color: z.string().min(1, { message: "Car color is required" }),
    isElectric: z
      .boolean()
      .refine((val) => val !== undefined, "isElectric is required"),
    isDelete: z.boolean().default(false),
    pricePerHour: z
      .number()
      .positive("PricePerHour is required and must be positive"),
    status: z.enum(["available", "unavailable"]).optional(),
  }),
});

const updateCarSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, { message: "Car Name must be required" })
      .optional(),
    description: z
      .string()
      .min(1, { message: "Car Description must be required" })
      .optional(),
    color: z.string().min(1, { message: "Car color is required" }).optional(),
    isElectric: z
      .boolean()
      .refine((val) => val !== undefined, "isElectric is required")
      .optional(),
    features: z
      .array(z.string())
      .nonempty("Features must be a non-empty array")
      .optional(),
    isDelete: z.boolean().default(false).optional(),
    pricePerHour: z
      .number()
      .positive("PricePerHour is required and must be positive")
      .optional(),
    status: z.enum(["available", "unavailable"]).optional(),
  }),
});

export const CarValidation = {
  carSchemaValidation,
  updateCarSchema,
};
