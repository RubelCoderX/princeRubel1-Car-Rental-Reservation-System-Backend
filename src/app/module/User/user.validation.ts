import { z } from "zod";

const userValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: "Name is required" }),
    password: z.string().min(1, { message: "Password is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    phone: z.string().min(1, { message: "Number is required" }),
    role: z.enum(["user", "admin"]).optional(),
    image: z.string().min(1, { message: "Image is required" }).optional(),
    // for future use, if we have address field in the database
    address: z.string().optional(),
  }),
});
const userUpdateValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    image: z.string().optional(),
  }),
});

export const UserValidation = {
  userValidationSchema,
  userUpdateValidationSchema,
};
