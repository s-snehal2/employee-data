import { z } from "zod";

export const employeeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),

  email: z.string().min(2, "Enter a valid email address"),

  role: z.string().min(2, "Role is required"),
});

export type EmployeeFormValues = z.infer<typeof employeeSchema>;
