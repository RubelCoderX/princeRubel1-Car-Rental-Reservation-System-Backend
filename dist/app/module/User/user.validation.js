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
        role: zod_1.z.enum(["user", "admin"]),
        address: zod_1.z.string(),
    }),
});
exports.UserValidation = {
    userValidationSchema,
};
