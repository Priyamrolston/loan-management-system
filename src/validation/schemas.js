import { z } from "zod";

export const personalSchema = z.object({
  fullName: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Enter a valid email"),
  mobile: z.string().min(10, "Enter valid mobile number"),
});