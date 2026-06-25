import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, Phone, User, Lock } from "lucide-react";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { emailExists, mobileExists, registerEmail, registerMobile } from "@/lib/mock-auth";

const schema = z
  .object({
    fullName: z.string().trim().min(2, "Enter your full name").max(80),
    email: z.string().trim().toLowerCase().email("Enter a valid email").max(255),
    mobile: z
      .string()
      .trim()
      .min(7, "Enter a valid mobile number")
      .max(20)
      .regex(/^\+?[0-9\s-]+$/, "Only digits, spaces, + and -"),
    password: z
      .string()
      .min(8, "Min 8 characters")
      .max(72)
      .regex(/[A-Z]/, "Add an uppercase letter")
      .regex(/[0-9]/, "Add a number"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type FormValues = z.infer<typeof schema>;

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create your account — Task Align" },
      { name: "description", content: "Sign up for Task Align to align your team and assign resources with clarity." },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    let bad = false;
    if (emailExists(values.email)) {
      setError("email", { message: "An account with this email already exists" });
      bad = true;
    }
    if (mobileExists(values.mobile)) {
      setError("mobile", { message: "This mobile number is already registered" });
      bad = true;
    }
    if (bad) return;

    await new Promise((r) => setTimeout(r, 600));
    registerEmail(values.email);
    registerMobile(values.mobile);
    toast.success("Account created", { description: "Welcome to Task Align." });
    navigate({ to: "/login" });
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start aligning your team in minutes — no credit card required."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Field label="Full name" icon={<User className="h-4 w-4" />} error={errors.fullName?.message}>
          <Input placeholder="Jane Cooper" autoComplete="name" {...register("fullName")} />
        </Field>

        <Field label="Email address" icon={<Mail className="h-4 w-4" />} error={errors.email?.message}>
          <Input type="email" placeholder="jane@company.com" autoComplete="email" {...register("email")} />
        </Field>

        <Field label="Mobile number" icon={<Phone className="h-4 w-4" />} error={errors.mobile?.message}>
          <Input type="tel" placeholder="+1 555 123 4567" autoComplete="tel" {...register("mobile")} />
        </Field>

        <Field label="Password" icon={<Lock className="h-4 w-4" />} error={errors.password?.message}>
          <PasswordInput placeholder="At least 8 characters" autoComplete="new-password" {...register("password")} />
        </Field>

        <Field label="Confirm password" icon={<Lock className="h-4 w-4" />} error={errors.confirmPassword?.message}>
          <PasswordInput placeholder="Re-enter password" autoComplete="new-password" {...register("confirmPassword")} />
        </Field>

        <Button type="submit" className="h-11 w-full rounded-xl text-sm font-semibold shadow-glow" disabled={isSubmitting}>
          {isSubmitting ? "Creating account…" : "Create account"}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          By signing up you agree to our{" "}
          <a className="underline hover:text-foreground" href="#">Terms</a> and{" "}
          <a className="underline hover:text-foreground" href="#">Privacy Policy</a>.
        </p>
      </form>
    </AuthLayout>
  );
}

function Field({
  label,
  icon,
  error,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
            {icon}
          </span>
        )}
        <div className={icon ? "[&_input]:pl-9" : ""}>{children}</div>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
