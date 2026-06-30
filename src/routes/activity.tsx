import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  Activity,
  Calendar,
  CalendarDays,
  CalendarRange,
  Sparkles,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  const grouped = useMemo(() => {
    const list = [...ACTIVITIES].sort((a, b) => b.dateTime.localeCompare(a.dateTime));
    const map = new Map<string, ActivityItem[]>();
    list.forEach((a) => {
      if (!map.has(a.dayLabel)) map.set(a.dayLabel, []);
      map.get(a.dayLabel)!.push(a);
    });
    return Array.from(map.entries());
  }, []);

  return (
    <DashboardShell>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Activity Log</h1>
        <p className="text-sm text-muted-foreground">
          Track all important activities performed within Task Align.
        </p>
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
          <CardTitle className="text-base">Timeline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {grouped.map(([day, list]) => (
            <div key={day}>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {day}
              </p>
              <div className="relative space-y-4 border-l-2 border-border pl-6">
                {list.map((a) => (
                  <div key={a.id} className="relative">
                    <span className="absolute -left-[30px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary shadow-glow">
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
    </DashboardShell>
  );
}
