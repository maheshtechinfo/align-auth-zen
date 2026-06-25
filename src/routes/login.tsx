import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, Lock, Phone, ArrowLeft, ShieldCheck } from "lucide-react";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const emailSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
  remember: z.boolean().optional(),
});
const mobileSchema = z.object({
  mobile: z
    .string()
    .trim()
    .min(7, "Enter a valid mobile number")
    .regex(/^\+?[0-9\s-]+$/, "Only digits, spaces, + and -"),
});

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — Task Align" },
      { name: "description", content: "Log in to Task Align with email or mobile OTP." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to continue managing your assignments."
      footer={
        <>
          New to Task Align?{" "}
          <Link to="/register" className="font-medium text-primary hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <Tabs defaultValue="email" className="w-full">
        <TabsList className="grid w-full grid-cols-2 rounded-xl bg-muted p-1 h-11">
          <TabsTrigger value="email" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-soft">
            <Mail className="mr-2 h-4 w-4" /> Email
          </TabsTrigger>
          <TabsTrigger value="mobile" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-soft">
            <Phone className="mr-2 h-4 w-4" /> Mobile OTP
          </TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="mt-6">
          <EmailLogin />
        </TabsContent>
        <TabsContent value="mobile" className="mt-6">
          <MobileLogin />
        </TabsContent>
      </Tabs>
    </AuthLayout>
  );
}

function EmailLogin() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof emailSchema>>({ resolver: zodResolver(emailSchema) });

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 600));
    toast.success("Logged in", { description: "Welcome back to Task Align." });
    navigate({ to: "/dashboard" });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-1.5">
        <Label>Email address</Label>
        <div className="relative">
          <Mail className="pointer-events-none absolute inset-y-0 left-3 my-auto h-4 w-4 text-muted-foreground" />
          <Input type="email" placeholder="you@company.com" autoComplete="email" className="pl-9" {...register("email")} />
        </div>
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label>Password</Label>
          <Link to="/forgot-password" className="text-xs font-medium text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <Lock className="pointer-events-none absolute inset-y-0 left-3 my-auto h-4 w-4 text-muted-foreground" />
          <PasswordInput placeholder="••••••••" autoComplete="current-password" className="pl-9" {...register("password")} />
        </div>
        {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
      </div>

      <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
        <Checkbox {...register("remember")} /> Remember me for 30 days
      </label>

      <Button type="submit" className="h-11 w-full rounded-xl font-semibold shadow-glow" disabled={isSubmitting}>
        {isSubmitting ? "Logging in…" : "Log in"}
      </Button>
    </form>
  );
}

function MobileLogin() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"mobile" | "otp">("mobile");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof mobileSchema>>({ resolver: zodResolver(mobileSchema) });

  const sendOtp = async (values: z.infer<typeof mobileSchema>) => {
    setSending(true);
    await new Promise((r) => setTimeout(r, 700));
    setMobile(values.mobile);
    setStep("otp");
    setSending(false);
    toast.success("OTP sent", { description: `We sent a 6-digit code to ${values.mobile}` });
  };

  const verify = async () => {
    if (otp.length !== 6) {
      toast.error("Enter the 6-digit code");
      return;
    }
    setVerifying(true);
    await new Promise((r) => setTimeout(r, 600));
    setVerifying(false);
    toast.success("Verified", { description: "You're logged in." });
    navigate({ to: "/dashboard" });
  };

  if (step === "mobile") {
    return (
      <form onSubmit={handleSubmit(sendOtp)} className="space-y-5">
        <div className="space-y-1.5">
          <Label>Mobile number</Label>
          <div className="relative">
            <Phone className="pointer-events-none absolute inset-y-0 left-3 my-auto h-4 w-4 text-muted-foreground" />
            <Input type="tel" placeholder="+1 555 123 4567" autoComplete="tel" className="pl-9" {...register("mobile")} />
          </div>
          {errors.mobile && <p className="text-xs text-destructive">{errors.mobile.message}</p>}
          <p className="text-xs text-muted-foreground">We'll send a one-time passcode to verify it's you.</p>
        </div>
        <Button type="submit" className="h-11 w-full rounded-xl font-semibold shadow-glow" disabled={sending}>
          {sending ? "Sending OTP…" : "Send OTP"}
        </Button>
      </form>
    );
  }

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => {
          setStep("mobile");
          setOtp("");
        }}
        className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Change number
      </button>

      <div className="rounded-2xl border border-border bg-primary-soft/50 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium">Enter verification code</p>
            <p className="text-xs text-muted-foreground">
              We sent a 6-digit code to <span className="font-medium text-foreground">{mobile}</span>
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
        {verifying ? "Verifying…" : "Log in"}
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
