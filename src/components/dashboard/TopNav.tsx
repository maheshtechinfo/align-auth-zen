import { Search, User, Pencil, KeyRound, LogOut } from "lucide-react";
import { NotificationsBell } from "@/components/dashboard/NotificationsBell";
import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@tanstack/react-router";
import { useProfile } from "@/lib/user-profile";
import { UserAvatar } from "@/components/dashboard/UserAvatar";
import { LogoutDialog } from "@/components/dashboard/LogoutDialog";

export function TopNav() {
  const profile = useProfile();
  const [logoutOpen, setLogoutOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md md:px-6">
      <SidebarTrigger className="h-9 w-9 rounded-lg" />
      <Separator orientation="vertical" className="h-6" />

      <div className="relative w-full max-w-md">
        <Search className="pointer-events-none absolute inset-y-0 left-3 my-auto h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search assignments, resources, reports…"
          className="h-10 rounded-xl border-border bg-muted/40 pl-9 focus-visible:bg-background"
        />
        <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 select-none items-center gap-1 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline-flex">
          ⌘K
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <NotificationsBell />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-xl p-1 pr-3 transition-colors hover:bg-muted">
              <UserAvatar profile={profile} className="h-8 w-8" fallbackClassName="text-xs" />
              <div className="hidden text-left leading-tight md:block">
                <p className="text-sm font-semibold">{profile.fullName}</p>
                <p className="text-xs text-muted-foreground">{profile.role}</p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-elevated">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/profile"><User className="mr-2 h-4 w-4" /> My Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/profile/edit"><Pencil className="mr-2 h-4 w-4" /> Edit Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/profile/change-password"><KeyRound className="mr-2 h-4 w-4" /> Change Password</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setLogoutOpen(true);
              }}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <LogoutDialog open={logoutOpen} onOpenChange={setLogoutOpen} />
    </header>
  );
}
