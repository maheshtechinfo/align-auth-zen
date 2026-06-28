import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserAvatar } from "@/components/dashboard/UserAvatar";
import {
  getProfile,
  isEmailTaken,
  isMobileTaken,
  updateProfile,
  useProfile,
} from "@/lib/user-profile";

export const Route = createFileRoute("/profile/edit")({
  component: EditProfilePage,
});

const schema = z.object({
  fullName: z.string().trim().min(2, "Full name is required").max(80),
  email: z
    .string()
    .trim()
    .email("Enter a valid email")
    .refine((v) => !isEmailTaken(v), { message: "Email is already in use" }),
  mobile: z
    .string()
    .trim()
    .regex(/^\d{10}$/, "Enter a valid 10-digit mobile")
    .refine((v) => !isMobileTaken(v), { message: "Mobile is already in use" }),
});

type FormValues = z.infer<typeof schema>;

const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/jpg", "image/png"];

function EditProfilePage() {
  const profile = useProfile();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(profile.avatarDataUrl);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: profile.fullName,
      email: profile.email,
      mobile: profile.mobile,
    },
  });

  const onPickFile = (file: File | null) => {
    if (!file) return;
    if (!ALLOWED.includes(file.type)) {
      toast.error("Only JPG, JPEG and PNG files are allowed");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("Image must be smaller than 2 MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const onSubmit = (values: FormValues) => {
    setSaving(true);
    setTimeout(() => {
      updateProfile({ ...values, avatarDataUrl: preview });
      toast.success("Profile Updated Successfully");
      setSaving(false);
      navigate({ to: "/profile" });
    }, 400);
  };

  const previewProfile = { ...profile, fullName: profile.fullName, avatarDataUrl: preview };

  return (
    <DashboardShell>
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Profile</h1>
          <p className="text-sm text-muted-foreground">
            Update your personal information and profile picture.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="rounded-2xl border-border/60 shadow-soft">
            <CardContent className="space-y-8 p-6 md:p-8">
              {/* Avatar */}
              <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border/70 bg-muted/30 p-6 sm:flex-row sm:items-center sm:text-left">
                <UserAvatar
                  profile={previewProfile}
                  className="h-28 w-28 ring-4 ring-background"
                  fallbackClassName="text-3xl"
                />
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-semibold">Profile Picture</h3>
                  <p className="text-xs text-muted-foreground">
                    JPG, JPEG or PNG. Maximum size 2 MB.
                  </p>
                  <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                    <Button
                      type="button"
                      className="rounded-xl"
                      onClick={() => fileRef.current?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" /> Upload New Image
                    </Button>
                    {preview && (
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-xl"
                        onClick={() => setPreview(null)}
                      >
                        <ImageIcon className="mr-2 h-4 w-4" /> Remove
                      </Button>
                    )}
                  </div>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    className="hidden"
                    onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
                  />
                </div>
              </div>

              {/* Fields */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" className="h-11 rounded-xl" {...register("fullName")} />
                  {errors.fullName && (
                    <p className="text-xs text-destructive">{errors.fullName.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" className="h-11 rounded-xl" {...register("email")} />
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <Input id="mobile" className="h-11 rounded-xl" {...register("mobile")} />
                  {errors.mobile && (
                    <p className="text-xs text-destructive">{errors.mobile.message}</p>
                  )}
                </div>
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
                <Button
                  type="submit"
                  className="rounded-xl"
                  disabled={saving || (!isDirty && preview === getProfile().avatarDataUrl)}
                >
                  {saving ? "Saving…" : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </DashboardShell>
  );
}
