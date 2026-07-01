import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Mail, Phone, Shield, Calendar, Clock, Pencil, User as UserIcon } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/dashboard/UserAvatar";
import { useProfile } from "@/lib/user-profile";

export const Route = createFileRoute("/profile/")({
  component: MyProfilePage,
});

function InfoRow({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-border/60 bg-muted/30 p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="mt-0.5 truncate text-sm font-semibold text-foreground">{value}</p>
        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
      </div>
    </div>
  );
}

function MyProfilePage() {
  const profile = useProfile();
  const navigate = useNavigate();

  return (
    <DashboardShell>
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
          <p className="text-sm text-muted-foreground">
            Your personal account information and activity overview.
          </p>
        </div>

        <Card className="overflow-hidden rounded-2xl border-border/60 shadow-soft">
          <div className="h-28 bg-gradient-to-r from-primary via-primary/80 to-purple-400" />
          <CardContent className="-mt-14 space-y-8 p-6 md:p-8">
            <div className="flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
              <div className="flex items-end gap-4">
                <UserAvatar
                  profile={profile}
                  className="h-24 w-24 ring-4 ring-background"
                  fallbackClassName="text-2xl"
                />
                <div className="pb-2">
                  <h2 className="text-xl font-semibold">{profile.fullName}</h2>
                  <p className="text-sm text-muted-foreground">{profile.email}</p>
                  <Badge className="mt-2 rounded-full bg-primary/10 text-primary hover:bg-primary/15">
                    {profile.role}
                  </Badge>
                </div>
              </div>
              <Button asChild className="rounded-xl">
                <Link to="/profile/edit">
                  <Pencil className="mr-2 h-4 w-4" /> Edit Profile
                </Link>
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <InfoRow icon={UserIcon} label="Full Name" value={profile.fullName} />
              <InfoRow icon={Mail} label="Email Address" value={profile.email} />
              <InfoRow icon={Phone} label="Mobile Number" value={profile.mobile} />
              <InfoRow icon={Shield} label="Role" value={profile.role} />
              <InfoRow icon={Calendar} label="Account Created" value={profile.createdAt} />
              <InfoRow icon={Clock} label="Last Login" value={profile.lastLogin} />
            </div>

            <div className="flex justify-end gap-2 border-t border-border/60 pt-6">
              <Button variant="outline" className="rounded-xl" onClick={() => navigate({ to: "/dashboard" })}>
                Close
              </Button>
              <Button asChild className="rounded-xl">
                <Link to="/profile/edit">Edit Profile</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
