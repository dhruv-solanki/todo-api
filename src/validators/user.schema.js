import { z } from "zod";

const userRegisterSchema = z.object({
  name: z.string("Name is required"),
  email: z.email("Email is required"),
  password: z.string("Password is required"),
});

const userLoginSchema = z.object({
  email: z.email("Email is required"),
  password: z.string("Password is required"),
});

export { userRegisterSchema, userLoginSchema };
