import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ShieldCheck, Check, X } from "lucide-react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { passwordStrength, setPassword, verifyPassword } from "@/lib/user-profile";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/profile/change-password")({
  component: ChangePasswordPage,
});

const passwordRules = z
  .string()
  .min(8, "Minimum 8 characters")
  .regex(/[A-Z]/, "Must contain an uppercase letter")
  .regex(/[a-z]/, "Must contain a lowercase letter")
  .regex(/\d/, "Must contain a number")
  .regex(/[^A-Za-z0-9]/, "Must contain a special character");

const schema = z
  .object({
    currentPassword: z.string().refine((v) => verifyPassword(v), {
      message: "Current password is incorrect",
    }),
    newPassword: passwordRules,
    confirmPassword: z.string(),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  })
  .refine((v) => v.newPassword !== v.currentPassword, {
    path: ["newPassword"],
    message: "New password must differ from current password",
  });

type FormValues = z.infer<typeof schema>;

const RULES = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "An uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "A lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { label: "A number", test: (p: string) => /\d/.test(p) },
  { label: "A special character", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

function ChangePasswordPage() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const newPw = watch("newPassword") || "";
  const { score, label } = passwordStrength(newPw);
  const strengthColors = ["bg-muted", "bg-destructive", "bg-amber-500", "bg-emerald-500"];

  const onSubmit = (values: FormValues) => {
    setSaving(true);
    setTimeout(() => {
      setPassword(values.newPassword);
      toast.success("Password Changed Successfully");
      setSaving(false);
      navigate({ to: "/profile" });
    }, 400);
  };

  return (
    <DashboardShell>
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Change Password</h1>
          <p className="text-sm text-muted-foreground">
            Use a strong, unique password to keep your account secure.
          </p>
        </div>

        <Card className="rounded-2xl border-border/60 shadow-soft">
          <CardContent className="space-y-6 p-6 md:p-8">
            <div className="flex items-center gap-3 rounded-xl bg-primary/5 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <p className="text-sm text-muted-foreground">
                For your security, you'll need to confirm your current password before setting a new one.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <PasswordInput id="currentPassword" className="h-11 rounded-xl" {...register("currentPassword")} />
                {errors.currentPassword && (
                  <p className="text-xs text-destructive">{errors.currentPassword.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <PasswordInput id="newPassword" className="h-11 rounded-xl" {...register("newPassword")} />
                {newPw.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <div className="flex gap-1.5">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className={cn(
                            "h-1.5 flex-1 rounded-full transition-colors",
                            i <= score ? strengthColors[score] : "bg-muted",
                          )}
                        />
                      ))}
                    </div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Strength: <span className="text-foreground">{label}</span>
                    </p>
                  </div>
                )}
                {errors.newPassword && (
                  <p className="text-xs text-destructive">{errors.newPassword.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <PasswordInput id="confirmPassword" className="h-11 rounded-xl" {...register("confirmPassword")} />
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
                )}
              </div>

              <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Password requirements
                </p>
                <ul className="grid gap-1.5 sm:grid-cols-2">
                  {RULES.map((rule) => {
                    const ok = rule.test(newPw);
                    return (
                      <li key={rule.label} className="flex items-center gap-2 text-xs">
                        <span
                          className={cn(
                            "flex h-4 w-4 items-center justify-center rounded-full",
                            ok
                              ? "bg-emerald-500/15 text-emerald-600"
                              : "bg-muted text-muted-foreground",
                          )}
                        >
                          {ok ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                        </span>
                        <span className={ok ? "text-foreground" : "text-muted-foreground"}>
                          {rule.label}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="flex justify-end gap-2 border-t border-border/60 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => navigate({ to: "/profile" })}
                >
                  Cancel
                </Button>
                <Button type="submit" className="rounded-xl" disabled={saving}>
                  {saving ? "Updating…" : "Update Password"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
