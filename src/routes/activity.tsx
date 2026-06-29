import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Activity,
  Calendar,
  CalendarDays,
  CalendarRange,
  Download,
  Printer,
  Search,
  Sparkles,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ACTIVITIES, type ActivityItem } from "@/lib/notifications";

export const Route = createFileRoute("/activity")({
  component: ActivityLogPage,
});

const summaryCards = [
  { label: "Today's Activities", value: 5, icon: Calendar, gradient: "from-violet-500 to-fuchsia-500" },
  { label: "This Week", value: 14, icon: CalendarRange, gradient: "from-indigo-500 to-purple-500" },
  { label: "This Month", value: 86, icon: CalendarDays, gradient: "from-sky-500 to-blue-500" },
  { label: "Total Activities", value: 1284, icon: Activity, gradient: "from-emerald-500 to-teal-500" },
];

function ActivityLogPage() {
  const [query, setQuery] = useState("");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("all");
  const [sort, setSort] = useState("newest");

  const filtered = useMemo(() => {
    let list = ACTIVITIES.slice();
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (a) =>
          a.activity.toLowerCase().includes(q) ||
          a.details.toLowerCase().includes(q) ||
          a.performedBy.toLowerCase().includes(q),
      );
    }
    if (moduleFilter !== "all") list = list.filter((a) => a.module === moduleFilter);
    if (userFilter !== "all") list = list.filter((a) => a.performedBy === userFilter);
    list.sort((a, b) =>
      sort === "newest"
        ? b.dateTime.localeCompare(a.dateTime)
        : a.dateTime.localeCompare(b.dateTime),
    );
    return list;
  }, [query, moduleFilter, userFilter, sort]);

  const grouped = useMemo(() => {
    const map = new Map<string, ActivityItem[]>();
    filtered.forEach((a) => {
      if (!map.has(a.dayLabel)) map.set(a.dayLabel, []);
      map.get(a.dayLabel)!.push(a);
    });
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <DashboardShell>
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Activity Log</h1>
          <p className="text-sm text-muted-foreground">
            Track all important activities performed within Task Align.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="rounded-xl">
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button variant="outline" className="rounded-xl">
            <Printer className="h-4 w-4" /> Print
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((c) => (
          <Card key={c.label} className="overflow-hidden rounded-2xl border-0 shadow-soft">
            <div className={`h-1 w-full bg-gradient-to-r ${c.gradient}`} />
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {c.label}
                </p>
                <p className="mt-1 text-2xl font-semibold">{c.value.toLocaleString()}</p>
              </div>
              <span className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${c.gradient} text-white shadow-glow`}>
                <c.icon className="h-5 w-5" />
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-2xl shadow-soft">
        <CardHeader>
          <CardTitle className="text-base">Search & filter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="pointer-events-none absolute inset-y-0 left-3 my-auto h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by Activity, Assignment or User..."
              className="h-11 rounded-xl pl-9"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Select value={moduleFilter} onValueChange={setModuleFilter}>
              <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="Activity Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modules</SelectItem>
                <SelectItem value="Assignments">Assignments</SelectItem>
                <SelectItem value="Reports">Reports</SelectItem>
                <SelectItem value="Profile">Profile</SelectItem>
                <SelectItem value="Authentication">Authentication</SelectItem>
                <SelectItem value="Settings">Settings</SelectItem>
              </SelectContent>
            </Select>
            <Select value={userFilter} onValueChange={setUserFilter}>
              <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="Performed By" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="Mahesh Kumar">Mahesh Kumar (Me)</SelectItem>
                <SelectItem value="Jane Cooper">Jane Cooper</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="7d">
              <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="Date Range" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest first</SelectItem>
                <SelectItem value="oldest">Oldest first</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="rounded-2xl shadow-soft lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {grouped.length === 0 && (
              <p className="text-sm text-muted-foreground">No activity matches your filters.</p>
            )}
            {grouped.map(([day, list]) => (
              <div key={day}>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {day}
                </p>
                <div className="relative space-y-4 border-l-2 border-border pl-5">
                  {list.map((a) => (
                    <div key={a.id} className="relative">
                      <span className="absolute -left-[26px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary shadow-glow">
                        <Sparkles className="h-2.5 w-2.5 text-primary-foreground" />
                      </span>
                      <p className="text-xs font-medium text-muted-foreground">{a.time}</p>
                      <p className="text-sm font-semibold">{a.activity}</p>
                      <p className="text-xs text-muted-foreground">
                        {a.performedBy} · {a.details}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-soft lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-base">Activity table</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-xl border border-border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>Module</TableHead>
                    <TableHead>Performed By</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="text-xs text-muted-foreground">
                        <div className="font-medium text-foreground">{a.dayLabel}</div>
                        {a.time}
                      </TableCell>
                      <TableCell>
                        <p className="text-sm font-medium">{a.activity}</p>
                        <p className="text-xs text-muted-foreground">{a.details}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="rounded-full bg-primary/10 text-primary">
                          {a.module}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{a.performedBy}</TableCell>
                      <TableCell>
                        <Badge className="rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                          {a.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
