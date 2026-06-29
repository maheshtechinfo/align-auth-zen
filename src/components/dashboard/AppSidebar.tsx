import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import {
  LayoutDashboard,
  ClipboardList,
  PlusSquare,
  History,
  LayoutTemplate,
  BarChart3,
  FileBarChart,
  Bell,
  Activity,
  Settings,
  HelpCircle,
  Sparkles,
  ChevronUp,
  User,
  Pencil,
  KeyRound,
  LogOut,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useProfile } from "@/lib/user-profile";
import { UserAvatar } from "@/components/dashboard/UserAvatar";
import { LogoutDialog } from "@/components/dashboard/LogoutDialog";

const workspaceItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, enabled: true },
  { title: "Assignments", url: "/assignments/history", icon: ClipboardList, enabled: true },
  { title: "Create Assignment", url: "/assignments/new", icon: PlusSquare, enabled: true },
  { title: "Assignment History", url: "/assignments/history", icon: History, enabled: true },
  { title: "Templates", url: "/templates", icon: LayoutTemplate, enabled: true },
];

const insightsItems = [
  { title: "Reports", url: "/reports/history", icon: BarChart3, enabled: true },
  { title: "Report History", url: "/reports/history", icon: FileBarChart, enabled: true },
  { title: "Notifications", url: "/notifications", icon: Bell, badge: 4, enabled: true },
  { title: "Activity Log", url: "/activity", icon: Activity, enabled: true },
];

const systemItems = [
  { title: "Settings", url: "/settings", icon: Settings, enabled: true },
  { title: "Help & Guide", url: "/help", icon: HelpCircle, enabled: true },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (url: string) => pathname === url;

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/dashboard" className="flex items-center gap-2 px-2 py-1.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-glow">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold tracking-tight">Task Align</span>
            <span className="text-xs text-muted-foreground">Resource System</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <NavGroup label="Workspace" items={workspaceItems} isActive={isActive} />
        <NavGroup label="Insights" items={insightsItems} isActive={isActive} />
        <NavGroup label="System" items={systemItems} isActive={isActive} />
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2">
        <ProfileMenu />
      </SidebarFooter>
    </Sidebar>
  );
}

type NavItem = {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  enabled?: boolean;
};

function NavGroup({
  label,
  items,
  isActive,
}: {
  label: string;
  items: NavItem[];
  isActive: (url: string) => boolean;
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const active = isActive(item.url);
            const inner = (
              <>
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
                {item.badge && (
                  <Badge
                    variant="secondary"
                    className="ml-auto h-5 rounded-full bg-primary/10 px-1.5 text-[10px] font-semibold text-primary"
                  >
                    {item.badge}
                  </Badge>
                )}
              </>
            );
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                  {item.enabled ? (
                    <Link to={item.url}>{inner}</Link>
                  ) : (
                    <a href="#" onClick={(e) => e.preventDefault()}>
                      {inner}
                    </a>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function ProfileMenu() {
  const profile = useProfile();
  const [logoutOpen, setLogoutOpen] = useState(false);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex w-full items-center gap-2 rounded-lg p-2 text-left transition-colors hover:bg-sidebar-accent">
            <UserAvatar profile={profile} className="h-9 w-9" fallbackClassName="text-sm" />
            <div className="flex min-w-0 flex-1 flex-col leading-tight group-data-[collapsible=icon]:hidden">
              <span className="truncate text-sm font-semibold">{profile.fullName}</span>
              <span className="truncate text-xs text-muted-foreground">{profile.email}</span>
            </div>
            <ChevronUp className="h-4 w-4 text-muted-foreground group-data-[collapsible=icon]:hidden" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="start" className="w-64 rounded-xl shadow-elevated">
          <DropdownMenuLabel className="flex items-center gap-2">
            <UserAvatar profile={profile} className="h-9 w-9" fallbackClassName="text-xs" />
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-semibold">{profile.fullName}</span>
              <span className="truncate text-xs font-normal text-muted-foreground">
                {profile.email}
              </span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/profile"><User className="mr-2 h-4 w-4" /> My Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/profile/edit"><Pencil className="mr-2 h-4 w-4" /> Edit Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/profile/change-password">
              <KeyRound className="mr-2 h-4 w-4" /> Change Password
            </Link>
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
      <LogoutDialog open={logoutOpen} onOpenChange={setLogoutOpen} />
    </>
  );
}

