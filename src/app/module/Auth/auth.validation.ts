import { z } from "zod";

const singInValidationSchema = z.object({
  body: z.object({
    email: z.string({ required_error: "email is must be required" }),
    password: z.string({ required_error: "Password is required" }),
  }),
});

export const AuthValidation = {
  singInValidationSchema,
};
