import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, Lock, ShieldCheck, ArrowLeft, CheckCircle2 } from "lucide-react";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const emailSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
});
const resetSchema = z
  .object({
    password: z
      .string()
      .min(8, "Min 8 characters")
      .regex(/[A-Z]/, "Add an uppercase letter")
      .regex(/[0-9]/, "Add a number"),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    path: ["confirm"],
    message: "Passwords do not match",
  });

type Step = "email" | "otp" | "reset" | "done";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset your password — Task Align" },
      { name: "description", content: "Reset your Task Align password using a one-time passcode." },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  return (
    <AuthLayout
      title={
        step === "done"
          ? "Password reset"
          : step === "reset"
            ? "Set a new password"
            : step === "otp"
              ? "Verify it's you"
              : "Forgot your password?"
      }
      subtitle={
        step === "done"
          ? "Your password has been updated successfully."
          : step === "reset"
            ? "Choose a strong password you haven't used before."
            : step === "otp"
              ? `Enter the 6-digit code we sent to ${email}`
              : "Enter your email and we'll send you a one-time code."
      }
      footer={
        step !== "done" && (
          <>
            Remembered it?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Back to login
            </Link>
          </>
        )
      }
    >
      {step === "email" && (
        <EmailStep
          onSent={(e) => {
            setEmail(e);
            setStep("otp");
          }}
        />
      )}
      {step === "otp" && (
        <OtpStep
          email={email}
          otp={otp}
          setOtp={setOtp}
          onBack={() => setStep("email")}
          onVerified={() => setStep("reset")}
        />
      )}
      {step === "reset" && <ResetStep onDone={() => setStep("done")} />}
      {step === "done" && <DoneStep />}
    </AuthLayout>
  );
}

function EmailStep({ onSent }: { onSent: (email: string) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof emailSchema>>({ resolver: zodResolver(emailSchema) });

  const submit = async (v: z.infer<typeof emailSchema>) => {
    await new Promise((r) => setTimeout(r, 600));
    toast.success("OTP sent", { description: `Check your inbox at ${v.email}` });
    onSent(v.email);
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-5">
      <div className="space-y-1.5">
        <Label>Email address</Label>
        <div className="relative">
          <Mail className="pointer-events-none absolute inset-y-0 left-3 my-auto h-4 w-4 text-muted-foreground" />
          <Input type="email" placeholder="you@company.com" autoComplete="email" className="pl-9" {...register("email")} />
        </div>
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>
      <Button type="submit" className="h-11 w-full rounded-xl font-semibold shadow-glow" disabled={isSubmitting}>
        {isSubmitting ? "Sending OTP…" : "Send OTP"}
      </Button>
    </form>
  );
}

function OtpStep({
  email,
  otp,
  setOtp,
  onBack,
  onVerified,
}: {
  email: string;
  otp: string;
  setOtp: (v: string) => void;
  onBack: () => void;
  onVerified: () => void;
}) {
  const [verifying, setVerifying] = useState(false);

  const verify = async () => {
    if (otp.length !== 6) {
      toast.error("Enter the 6-digit code");
      return;
    }
    setVerifying(true);
    await new Promise((r) => setTimeout(r, 600));
    setVerifying(false);
    onVerified();
  };

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Change email
      </button>

      <div className="rounded-2xl border border-border bg-primary-soft/50 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium">Verification code sent</p>
            <p className="text-xs text-muted-foreground">
              We emailed a 6-digit code to <span className="font-medium text-foreground">{email}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <InputOTP maxLength={6} value={otp} onChange={setOtp}>
          <InputOTPGroup>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <InputOTPSlot
                key={i}
                index={i}
                className="h-12 w-12 rounded-xl border-border text-lg font-semibold shadow-soft"
              />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>

      <Button onClick={verify} className="h-11 w-full rounded-xl font-semibold shadow-glow" disabled={verifying}>
        {verifying ? "Verifying…" : "Verify code"}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Didn't get the code?{" "}
        <button type="button" className="font-medium text-primary hover:underline" onClick={() => toast.success("OTP resent")}>
          Resend
        </button>
      </p>
    </div>
  );
}

function ResetStep({ onDone }: { onDone: () => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof resetSchema>>({ resolver: zodResolver(resetSchema) });

  const submit = async () => {
    await new Promise((r) => setTimeout(r, 700));
    toast.success("Password updated", { description: "You can now log in with your new password." });
    onDone();
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-5">
      <div className="space-y-1.5">
        <Label>New password</Label>
        <div className="relative">
          <Lock className="pointer-events-none absolute inset-y-0 left-3 my-auto h-4 w-4 text-muted-foreground" />
          <PasswordInput placeholder="At least 8 characters" autoComplete="new-password" className="pl-9" {...register("password")} />
        </div>
        {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label>Confirm new password</Label>
        <div className="relative">
          <Lock className="pointer-events-none absolute inset-y-0 left-3 my-auto h-4 w-4 text-muted-foreground" />
          <PasswordInput placeholder="Re-enter password" autoComplete="new-password" className="pl-9" {...register("confirm")} />
        </div>
        {errors.confirm && <p className="text-xs text-destructive">{errors.confirm.message}</p>}
      </div>
      <Button type="submit" className="h-11 w-full rounded-xl font-semibold shadow-glow" disabled={isSubmitting}>
        {isSubmitting ? "Resetting…" : "Reset password"}
      </Button>
    </form>
  );
}

function DoneStep() {
  const navigate = useNavigate();
  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-success/10 text-success">
        <CheckCircle2 className="h-8 w-8" />
      </div>
      <div className="space-y-2">
        <p className="text-base font-medium">All set!</p>
        <p className="text-sm text-muted-foreground">
          Your password has been reset successfully. You can now log in with your new credentials.
        </p>
      </div>
      <Button onClick={() => navigate({ to: "/login" })} className="h-11 w-full rounded-xl font-semibold shadow-glow">
        Continue to login
      </Button>
    </div>
  );
}
