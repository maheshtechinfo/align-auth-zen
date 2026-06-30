import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  FileBarChart,
  Users2,
  ListChecks,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Bell,
  CircleDot,
  UserPlus,
  FileCheck2,
  AlertTriangle,
  CalendarClock,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { TopNav } from "@/components/dashboard/TopNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Task Align" },
      { name: "description", content: "Overview of assignments, resources and team activity." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-muted/30">
        <AppSidebar />
        <SidebarInset className="bg-transparent">
          <TopNav />
          <main className="flex-1 space-y-6 px-4 py-6 md:px-8 md:py-8">
            <PageHeader />
            <KpiGrid />
            <ChartsRow />
            <BottomRow />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

function PageHeader() {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-sm font-medium text-primary">Welcome back, Jane</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
          Dashboard overview
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here's how your team is performing this week.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Select defaultValue="7d">
          <SelectTrigger className="h-10 w-[160px] rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Last 24 hours</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="qtd">This quarter</SelectItem>
          </SelectContent>
        </Select>
        <Button className="h-10 rounded-xl shadow-glow">+ New Assignment</Button>
      </div>
    </div>
  );
}

const kpis = [
  { label: "Total Assignments", value: "1,284", delta: "+12.4%", trend: "up", icon: ClipboardList, tint: "bg-primary/10 text-primary" },
  { label: "Completed Assignments", value: "924", delta: "+8.1%", trend: "up", icon: CheckCircle2, tint: "bg-success/10 text-success" },
  { label: "Pending Assignments", value: "212", delta: "-3.2%", trend: "down", icon: Clock, tint: "bg-amber-500/10 text-amber-600" },
  { label: "Reports Generated", value: "348", delta: "+5.6%", trend: "up", icon: FileBarChart, tint: "bg-blue-500/10 text-blue-600" },
  { label: "Total Resources", value: "186", delta: "+2.0%", trend: "up", icon: Users2, tint: "bg-fuchsia-500/10 text-fuchsia-600" },
  { label: "Total Tasks", value: "4,872", delta: "+14.7%", trend: "up", icon: ListChecks, tint: "bg-cyan-500/10 text-cyan-600" },
];

function KpiGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {kpis.map((k) => {
        const TrendIcon = k.trend === "up" ? TrendingUp : TrendingDown;
        const trendColor = k.trend === "up" ? "text-success" : "text-destructive";
        return (
          <Card key={k.label} className="rounded-2xl border-border shadow-soft transition-shadow hover:shadow-elevated">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${k.tint}`}>
                  <k.icon className="h-5 w-5" />
                </div>
                <span className={`inline-flex items-center gap-1 text-xs font-medium ${trendColor}`}>
                  <TrendIcon className="h-3.5 w-3.5" /> {k.delta}
                </span>
              </div>
              <p className="mt-4 text-2xl font-semibold tracking-tight">{k.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{k.label}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

const barData = [
  { type: "Development", count: 320 },
  { type: "Design", count: 210 },
  { type: "QA", count: 178 },
  { type: "Research", count: 124 },
  { type: "Marketing", count: 96 },
  { type: "Support", count: 142 },
];

const pieData = [
  { name: "Completed", value: 924, color: "oklch(0.65 0.16 155)" },
  { name: "Draft", value: 148, color: "oklch(0.55 0.24 285)" },
];

function ChartsRow() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="rounded-2xl border-border shadow-soft lg:col-span-2">
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <div>
            <CardTitle className="text-base">Assignments by type</CardTitle>
            <CardDescription>Distribution across categories this quarter</CardDescription>
          </div>
          <Select defaultValue="qtr">
            <SelectTrigger className="h-9 w-[130px] rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mo">This month</SelectItem>
              <SelectItem value="qtr">This quarter</SelectItem>
              <SelectItem value="yr">This year</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
                <defs>
                  <linearGradient id="barFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.55 0.24 285)" stopOpacity={1} />
                    <stop offset="100%" stopColor="oklch(0.55 0.24 285)" stopOpacity={0.35} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="oklch(0.93 0.01 280)" />
                <XAxis dataKey="type" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "oklch(0.5 0.02 280)" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "oklch(0.5 0.02 280)" }} />
                <RechartsTooltip
                  cursor={{ fill: "oklch(0.55 0.24 285 / 0.06)" }}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid oklch(0.93 0.01 280)",
                    boxShadow: "0 8px 24px -8px oklch(0.55 0.24 285 / 0.2)",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="count" fill="url(#barFill)" radius={[8, 8, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border shadow-soft">
        <CardHeader>
          <CardTitle className="text-base">Assignment status</CardTitle>
          <CardDescription>Live status across all assignments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((d) => (
                    <Cell key={d.name} fill={d.color} />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid oklch(0.93 0.01 280)",
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 space-y-2">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
                  <span className="text-muted-foreground">{d.name}</span>
                </div>
                <span className="font-medium">{d.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ---------- Bottom row ----------

type AssignmentRow = {
  id: string;
  title: string;
  type: string;
  status: "Completed" | "Draft";
  due: string;
};

const allAssignments: AssignmentRow[] = [
  { id: "TA-2041", title: "Design system audit Q3",     type: "Design",      status: "Draft",     due: "Jun 28, 2026" },
  { id: "TA-2040", title: "API rate-limit refactor",    type: "Development", status: "Draft",     due: "Jun 26, 2026" },
  { id: "TA-2039", title: "Onboarding usability study", type: "Research",    status: "Completed", due: "Jun 20, 2026" },
  { id: "TA-2038", title: "Q3 campaign launch plan",    type: "Marketing",   status: "Draft",     due: "Jul 02, 2026" },
  { id: "TA-2037", title: "Regression test suite",      type: "QA",          status: "Completed", due: "Jun 18, 2026" },
  { id: "TA-2036", title: "Customer churn dashboard",   type: "Analytics",   status: "Draft",     due: "Jul 10, 2026" },
  { id: "TA-2035", title: "Mobile app accessibility",   type: "Design",      status: "Draft",     due: "Jul 05, 2026" },
  { id: "TA-2034", title: "Billing API migration",      type: "Development", status: "Completed", due: "Jun 12, 2026" },
];

function BottomRow() {
  return (
    <Card className="rounded-2xl border-border shadow-soft">
      <RecentAssignments />
    </Card>
  );
}

function RecentAssignments() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filtered = useMemo(() => {
    return allAssignments.filter((a) => {
      const matchesQ =
        !query ||
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.id.toLowerCase().includes(query.toLowerCase()) ||
        a.assignee.name.toLowerCase().includes(query.toLowerCase());
      const matchesS = status === "all" || a.status.toLowerCase() === status;
      return matchesQ && matchesS;
    });
  }, [query, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <>
      <CardHeader className="space-y-4">
        <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base">Recent assignments</CardTitle>
            <CardDescription>Latest activity across your workspace</CardDescription>
          </div>
          <Button variant="ghost" className="text-primary hover:text-primary">View all</Button>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute inset-y-0 left-3 my-auto h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search by title, ID or assignee…"
              className="h-10 rounded-xl pl-9"
            />
          </div>
          <Select
            value={status}
            onValueChange={(v) => {
              setStatus(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-10 w-full rounded-xl sm:w-[160px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="in progress">In Progress</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="pl-6">ID</TableHead>
                <TableHead>Assignment</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due</TableHead>
                <TableHead className="pr-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {current.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="py-12 text-center text-sm text-muted-foreground">
                    No assignments match your filters.
                  </TableCell>
                </TableRow>
              )}
              {current.map((a) => (
                <TableRow key={a.id} className="border-border">
                  <TableCell className="pl-6 font-mono text-xs text-muted-foreground">{a.id}</TableCell>
                  <TableCell className="font-medium">{a.title}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="bg-primary/10 text-[10px] font-semibold text-primary">
                          {a.assignee.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{a.assignee.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{a.type}</TableCell>
                  <TableCell><PriorityPill p={a.priority} /></TableCell>
                  <TableCell><StatusPill s={a.status} /></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{a.due}</TableCell>
                  <TableCell className="pr-6 text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Separator />
        <div className="flex flex-col items-center justify-between gap-3 px-6 py-4 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            Showing <span className="font-medium text-foreground">{current.length}</span> of{" "}
            <span className="font-medium text-foreground">{filtered.length}</span> assignments
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-lg"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <Button
                key={i}
                variant={page === i + 1 ? "default" : "outline"}
                size="icon"
                className="h-8 w-8 rounded-lg text-xs"
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-lg"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </>
  );
}

function PriorityPill({ p }: { p: AssignmentRow["priority"] }) {
  const styles: Record<AssignmentRow["priority"], string> = {
    Low: "bg-muted text-muted-foreground",
    Medium: "bg-blue-500/10 text-blue-600",
    High: "bg-amber-500/10 text-amber-600",
    Critical: "bg-destructive/10 text-destructive",
  };
  return (
    <Badge variant="secondary" className={`rounded-full border-0 px-2.5 py-0.5 text-xs font-medium ${styles[p]}`}>
      {p}
    </Badge>
  );
}

function StatusPill({ s }: { s: AssignmentRow["status"] }) {
  const styles: Record<AssignmentRow["status"], string> = {
    Completed: "bg-success/10 text-success",
    "In Progress": "bg-primary/10 text-primary",
    Pending: "bg-amber-500/10 text-amber-600",
    Cancelled: "bg-muted text-muted-foreground line-through",
  };
  return (
    <Badge variant="secondary" className={`gap-1.5 rounded-full border-0 px-2.5 py-0.5 text-xs font-medium ${styles[s]}`}>
      <CircleDot className="h-3 w-3" /> {s}
    </Badge>
  );
}

const activities = [
  { icon: FileCheck2, tint: "bg-success/10 text-success", title: "Mei Lin completed", target: "Onboarding usability study", time: "12m ago" },
  { icon: UserPlus, tint: "bg-primary/10 text-primary", title: "Alex Rivera was assigned to", target: "Design system audit Q3", time: "1h ago" },
  { icon: AlertTriangle, tint: "bg-destructive/10 text-destructive", title: "Critical priority set on", target: "API rate-limit refactor", time: "3h ago" },
  { icon: CalendarClock, tint: "bg-amber-500/10 text-amber-600", title: "Due date updated for", target: "Q3 campaign launch plan", time: "Yesterday" },
  { icon: FileCheck2, tint: "bg-success/10 text-success", title: "Hana Sato closed", target: "Regression test suite", time: "Yesterday" },
];

function RecentActivity() {
  return (
    <>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-base">Recent activity</CardTitle>
          <CardDescription>Latest events across the workspace</CardDescription>
        </div>
        <Button variant="ghost" size="sm" className="text-primary hover:text-primary">View log</Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((a, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${a.tint}`}>
              <a.icon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm leading-tight">
                <span className="text-muted-foreground">{a.title} </span>
                <span className="font-medium">{a.target}</span>
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">{a.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </>
  );
}

const notifications = [
  { title: "New report ready", body: "Weekly resource utilization is available.", time: "Just now", unread: true },
  { title: "Approval requested", body: "Diego needs approval on Q3 campaign plan.", time: "30m ago", unread: true },
  { title: "Deadline tomorrow", body: "API rate-limit refactor is due in 24 hours.", time: "2h ago", unread: true },
  { title: "New team member", body: "Sara Iqbal joined the Design team.", time: "Yesterday", unread: false },
];

function NotificationsWidget() {
  return (
    <>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Bell className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-base">Notifications</CardTitle>
            <CardDescription>You have 3 unread</CardDescription>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="text-primary hover:text-primary">Mark all</Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {notifications.map((n, i) => (
          <div
            key={i}
            className={`flex gap-3 rounded-xl border border-transparent p-3 transition-colors hover:border-border hover:bg-muted/40 ${n.unread ? "bg-primary-soft/40" : ""}`}
          >
            <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.unread ? "bg-primary" : "bg-muted-foreground/30"}`} />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <p className="truncate text-sm font-medium">{n.title}</p>
                <span className="shrink-0 text-[11px] text-muted-foreground">{n.time}</span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">{n.body}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </>
  );
}
