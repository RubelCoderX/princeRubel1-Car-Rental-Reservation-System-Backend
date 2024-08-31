"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const userValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, { message: "Name is required" }),
        password: zod_1.z.string().min(1, { message: "Password is required" }),
        email: zod_1.z.string().email({ message: "Invalid email address" }),
        phone: zod_1.z.string().min(1, { message: "Number is required" }),
        role: zod_1.z.enum(["user", "admin"]).optional(),
        image: zod_1.z.string().min(1, { message: "Image is required" }).optional(),
        // for future use, if we have address field in the database
        address: zod_1.z.string().optional(),
    }),
});
const userUpdateValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        email: zod_1.z.string().optional(),
        phone: zod_1.z.string().optional(),
        image: zod_1.z.string().optional(),
    }),
});
exports.UserValidation = {
    userValidationSchema,
    userUpdateValidationSchema,
};
