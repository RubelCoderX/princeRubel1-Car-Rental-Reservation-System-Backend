import { z } from "zod";

const userValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: "Name is required" }),
    password: z.string().min(1, { message: "Password is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    phone: z.string().min(1, { message: "Number is required" }),
    role: z.enum(["user", "admin"]),
    address: z.string(),
  }),
});

export const UserValidation = {
  userValidationSchema,
};
