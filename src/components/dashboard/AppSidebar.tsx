import { Link, useRouterState } from "@tanstack/react-router";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const workspaceItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Assignments", url: "/dashboard/assignments", icon: ClipboardList },
  { title: "Create Assignment", url: "/assignments/new", icon: PlusSquare },
  { title: "Assignment History", url: "/dashboard/assignments/history", icon: History },
  { title: "Templates", url: "/dashboard/templates", icon: LayoutTemplate },
];

const insightsItems = [
  { title: "Reports", url: "/dashboard/reports", icon: BarChart3 },
  { title: "Report History", url: "/dashboard/reports/history", icon: FileBarChart },
  { title: "Notifications", url: "/dashboard/notifications", icon: Bell, badge: 4 },
  { title: "Activity Log", url: "/dashboard/activity", icon: Activity },
];

const systemItems = [
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
  { title: "Help & Guide", url: "/dashboard/help", icon: HelpCircle },
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
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                  <a
                    href={
                      item.url === "/dashboard" || item.url === "/assignments/new"
                        ? item.url
                        : "#"
                    }
                  >
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
                  </a>
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
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex w-full items-center gap-2 rounded-lg p-2 text-left transition-colors hover:bg-sidebar-accent">
          <Avatar className="h-9 w-9 ring-2 ring-primary/20">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
              JC
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate text-sm font-semibold">Jane Cooper</span>
            <span className="truncate text-xs text-muted-foreground">Resource Manager</span>
          </div>
          <ChevronUp className="h-4 w-4 text-muted-foreground group-data-[collapsible=icon]:hidden" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="start" className="w-60 rounded-xl shadow-elevated">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
              JC
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Jane Cooper</span>
            <span className="text-xs font-normal text-muted-foreground">jane@taskalign.com</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem><User className="mr-2 h-4 w-4" /> My Profile</DropdownMenuItem>
        <DropdownMenuItem><Pencil className="mr-2 h-4 w-4" /> Edit Profile</DropdownMenuItem>
        <DropdownMenuItem><KeyRound className="mr-2 h-4 w-4" /> Change Password</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="text-destructive focus:text-destructive">
          <Link to="/login">
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
