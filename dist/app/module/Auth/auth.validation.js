"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
const zod_1 = require("zod");
const singInValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({ required_error: "email is must be required" }),
        password: zod_1.z.string({ required_error: "Password is required" }),
    }),
});
exports.AuthValidation = {
    singInValidationSchema,
};
