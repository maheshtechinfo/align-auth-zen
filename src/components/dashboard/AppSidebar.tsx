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
  Activity,
  Activity,
  Settings,
  HelpCircle,
  Sparkles,
  ChevronUp,
  ChevronDown,
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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

type LeafItem = {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
};

type GroupItem = {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: LeafItem[];
};

const dashboardItem: LeafItem = { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard };

const assignmentsGroup: GroupItem = {
  title: "Assignments",
  icon: ClipboardList,
  children: [
    { title: "Create Assignment", url: "/assignments/new", icon: PlusSquare },
    { title: "Assignment History", url: "/assignments/history", icon: History },
    { title: "Templates", url: "/templates", icon: LayoutTemplate },
  ],
};

const reportsGroup: GroupItem = {
  title: "Reports",
  icon: BarChart3,
  children: [
    { title: "Report History", url: "/reports/history", icon: FileBarChart },
  ],
};

const activityItem: LeafItem = { title: "Activity Log", url: "/activity", icon: Activity };

const systemItems: LeafItem[] = [
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "Help & Guide", url: "/help", icon: HelpCircle },
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
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive(dashboardItem.url)} tooltip={dashboardItem.title}>
                  <Link to={dashboardItem.url}>
                    <dashboardItem.icon className="h-4 w-4" />
                    <span>{dashboardItem.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <CollapsibleGroup group={assignmentsGroup} pathname={pathname} isActive={isActive} />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Insights</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <CollapsibleGroup group={reportsGroup} pathname={pathname} isActive={isActive} />
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive(activityItem.url)} tooltip={activityItem.title}>
                  <Link to={activityItem.url}>
                    <activityItem.icon className="h-4 w-4" />
                    <span>{activityItem.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2">
        <ProfileMenu />
      </SidebarFooter>
    </Sidebar>
  );
}

function CollapsibleGroup({
  group,
  pathname,
  isActive,
}: {
  group: GroupItem;
  pathname: string;
  isActive: (url: string) => boolean;
}) {
  const childActive = group.children.some((c) => pathname === c.url);
  const [open, setOpen] = useState(childActive);

  return (
    <Collapsible open={open || childActive} onOpenChange={setOpen} asChild>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={group.title} isActive={childActive}>
            <group.icon className="h-4 w-4" />
            <span>{group.title}</span>
            <ChevronDown
              className={`ml-auto h-4 w-4 transition-transform ${(open || childActive) ? "rotate-180" : ""}`}
            />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {group.children.map((child) => (
              <SidebarMenuSubItem key={child.title}>
                <SidebarMenuSubButton asChild isActive={isActive(child.url)}>
                  <Link to={child.url}>
                    <child.icon className="h-3.5 w-3.5" />
                    <span>{child.title}</span>
                    {child.badge && (
                      <Badge
                        variant="secondary"
                        className="ml-auto h-5 rounded-full bg-primary/10 px-1.5 text-[10px] font-semibold text-primary"
                      >
                        {child.badge}
                      </Badge>
                    )}
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
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
