"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import api from "@/lib/axios";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Mail,
  User,
  UserPen,
  UserPlus,
} from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Name must contain at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  role: z.string().min(2, "Role is required"),
});

type FormData = z.infer<typeof schema>;

export default function EmployeeForm({ employeeId }: { employeeId?: string }) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      role: "",
    },
  });

  // Fetch employee details for Edit mode
  useEffect(() => {
    if (!employeeId) return;

    const fetchEmployee = async () => {
      try {
        const response = await api.get(`/employees/${employeeId}`);

        reset(response.data.data);
      } catch (error: unknown) {
        const message = axios.isAxiosError(error)
          ? error.response?.data?.message || "Employee not found"
          : "Something went wrong while fetching employee";

        alert(message);
        router.replace("/employee-data");
      }
    };

    fetchEmployee();
  }, [employeeId, reset, router]);

  // Add or Update employee
  const onSubmit = async (values: FormData) => {
    try {
      if (employeeId) {
        await api.put(`/employees/${employeeId}`, values);
      } else {
        await api.post("/employees", values);
      }

      router.push("/employee-data");
      router.refresh();
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || "Failed to save employee"
        : "Something went wrong. Please try again.";

      alert(message);
    }
  };

  const isEdit = Boolean(employeeId);
  const HeaderIcon = isEdit ? UserPen : UserPlus;

  return (
    <div className="flex flex-1 items-start justify-center bg-muted/40 px-4 py-10 sm:items-center sm:py-16">
      <div className="w-full max-w-lg">
        {/* Back link */}
        <button
          type="button"
          onClick={() => router.push("/employee-data")}
          className="mb-4 inline-flex items-center gap-1.5 rounded-md text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <ArrowLeft className="size-4" />
          Back to employees
        </button>

        <Card className="shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <CardHeader className="flex flex-row items-start gap-4 border-b pb-6">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <HeaderIcon className="size-5" />
              </div>

              <div className="space-y-1">
                <CardTitle className="text-xl font-semibold tracking-tight">
                  {isEdit ? "Edit Employee" : "Add Employee"}
                </CardTitle>

                <CardDescription>
                  {isEdit
                    ? "Update employee information"
                    : "Enter details to add a new employee"}
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-5 py-6">
              {/* Employee Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Employee Name</Label>

                <div className="relative">
                  <User className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="Enter employee name"
                    autoComplete="name"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    className="h-10 pl-9"
                    {...register("name")}
                  />
                </div>

                {errors.name && (
                  <p
                    id="name-error"
                    role="alert"
                    className="text-sm text-destructive"
                  >
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>

                <div className="relative">
                  <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className="h-10 pl-9"
                    {...register("email")}
                  />
                </div>

                {errors.email && (
                  <p
                    id="email-error"
                    role="alert"
                    className="text-sm text-destructive"
                  >
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Job Role */}
              <div className="space-y-2">
                <Label htmlFor="role">Job Role</Label>

                <div className="relative">
                  <BriefcaseBusiness className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="role"
                    placeholder="e.g. Frontend Developer"
                    autoComplete="organization-title"
                    aria-invalid={!!errors.role}
                    aria-describedby={errors.role ? "role-error" : undefined}
                    className="h-10 pl-9"
                    {...register("role")}
                  />
                </div>

                {errors.role && (
                  <p
                    id="role-error"
                    role="alert"
                    className="text-sm text-destructive"
                  >
                    {errors.role.message}
                  </p>
                )}
              </div>
            </CardContent>

            {/* Buttons */}
            <CardFooter className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
                onClick={() => router.push("/employee-data")}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                size="lg"
                className="w-full sm:w-auto sm:min-w-36"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Spinner />
                    Saving...
                  </>
                ) : isEdit ? (
                  "Update Employee"
                ) : (
                  "Add Employee"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
