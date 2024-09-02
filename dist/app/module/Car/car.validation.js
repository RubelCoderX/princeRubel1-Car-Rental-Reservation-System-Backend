"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarValidation = void 0;
const zod_1 = require("zod");
const carSchemaValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "Car name is required"),
        description: zod_1.z.string().min(1, "Description is required"),
        color: zod_1.z.string().min(1, "Color is required"),
        isElectric: zod_1.z.boolean(),
        features: zod_1.z.array(zod_1.z.string()).nonempty("At least one feature is required"),
        pricePerHour: zod_1.z.number().min(0, "Price per hour must be a positive number"),
        carImgUrl: zod_1.z
            .string()
            .url("Must be a valid URL")
            .nonempty("At least one image URL is required"),
        vehicleSpecification: zod_1.z
            .array(zod_1.z.string())
            .nonempty("At least one vehicle specification is required"),
        maxSeats: zod_1.z.number().int().positive("Max seats must be a positive integer"),
        rating: zod_1.z.number().min(0).max(5, "Rating must be between 0 and 5"),
        gearType: zod_1.z.string().min(1, "Gear type is required"),
        fuelType: zod_1.z.string().min(1, "Fuel type is required"),
        carType: zod_1.z.string().min(1, "Car type is required"),
    }),
});
const updateCarSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        color: zod_1.z.string().optional(),
        isElectric: zod_1.z.boolean().optional(),
        features: zod_1.z.array(zod_1.z.string()).optional(),
        isDelete: zod_1.z.boolean().optional(),
        pricePerHour: zod_1.z
            .number()
            .optional(),
        carImgUrl: zod_1.z.string().optional(),
        vehicleSpecification: zod_1.z.array(zod_1.z.string()).optional(),
        maxSeats: zod_1.z
            .number()
            .optional(),
        rating: zod_1.z
            .number()
            .optional(),
        gearType: zod_1.z.string().optional(),
        fuelType: zod_1.z.string().optional(),
        carType: zod_1.z.string().optional(),
    }),
});
exports.CarValidation = {
    carSchemaValidation,
    updateCarSchema,
};
