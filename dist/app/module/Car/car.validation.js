"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarValidation = void 0;
const zod_1 = require("zod");
const carSchemaValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, { message: "Car Name must be required" }),
        description: zod_1.z
            .string()
            .min(1, { message: "Car Description must be required" }),
        color: zod_1.z.string().min(1, { message: "Car color is required" }),
        isElectric: zod_1.z
            .boolean()
            .refine((val) => val !== undefined, "isElectric is required"),
        isDelete: zod_1.z.boolean().default(false),
        pricePerHour: zod_1.z
            .number()
            .positive("PricePerHour is required and must be positive"),
        status: zod_1.z.enum(["available", "unavailable"]).optional(),
        carImgUrl: zod_1.z.string().min(1, { message: "Car Image URL must be required" }),
    }),
});
const updateCarSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string()
            .min(1, { message: "Car Name must be required" })
            .optional(),
        description: zod_1.z
            .string()
            .min(1, { message: "Car Description must be required" })
            .optional(),
        color: zod_1.z.string().min(1, { message: "Car color is required" }).optional(),
        isElectric: zod_1.z
            .boolean()
            .refine((val) => val !== undefined, "isElectric is required")
            .optional(),
        features: zod_1.z
            .array(zod_1.z.string())
            .nonempty("Features must be a non-empty array")
            .optional(),
        isDelete: zod_1.z.boolean().default(false).optional(),
        pricePerHour: zod_1.z
            .number()
            .positive("PricePerHour is required and must be positive")
            .optional(),
        status: zod_1.z.enum(["available", "unavailable"]).optional(),
    }),
});
exports.CarValidation = {
    carSchemaValidation,
    updateCarSchema,
};
