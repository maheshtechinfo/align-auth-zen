import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  Pencil,
  FileBarChart,
  Users2,
  ListChecks,
  Grid3x3,
  TrendingUp,
  Calendar,
  User,
  CheckCircle2,
  Clock,
} from "lucide-react";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ASSIGNMENTS, formatDate, type AssignmentStatus } from "@/lib/mock-data";

export const Route = createFileRoute("/assignments/$id")({
  head: ({ params }) => ({
    meta: [{ title: `Assignment #${params.id} — Task Align` }],
  }),
  loader: ({ params }) => {
    const record = ASSIGNMENTS.find((a) => a.id === params.id);
    if (!record) throw notFound();
    return { record };
  },
  component: AssignmentDetailsPage,
});

function statusPill(s: AssignmentStatus) {
  if (s === "Completed") return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
  if (s === "Pending") return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
  return "bg-slate-100 text-slate-700 ring-1 ring-slate-200";
}

function AssignmentDetailsPage() {
  const { record } = Route.useLoaderData();

  const kpis = [
    { label: "Resources", value: record.resources, icon: Users2, tone: "from-violet-500/15 to-violet-500/5 text-violet-600" },
    { label: "Tasks", value: record.tasks, icon: ListChecks, tone: "from-indigo-500/15 to-indigo-500/5 text-indigo-600" },
    { label: "Matrix Size", value: `${record.resources}×${record.tasks}`, icon: Grid3x3, tone: "from-fuchsia-500/15 to-fuchsia-500/5 text-fuchsia-600" },
    {
      label: record.optimization === "Cost" ? "Total Cost" : "Total Profit",
      value: record.result ? `$${record.result.toLocaleString()}` : "—",
      icon: TrendingUp,
      tone: "from-emerald-500/15 to-emerald-500/5 text-emerald-600",
    },
  ];

  return (
    <DashboardShell>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link to="/assignments/history" className="hover:text-foreground">
              Assignments
            </Link>
            <span>/</span>
            <span className="font-mono">#{record.id}</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{record.name}</h1>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="rounded-full border-primary/20 bg-primary/5 text-primary">
              {record.type}
            </Badge>
            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusPill(record.status)}`}>
              {record.status === "Completed" ? <CheckCircle2 className="mr-1 h-3 w-3" /> : <Clock className="mr-1 h-3 w-3" />}
              {record.status}
            </span>
            <span className="text-xs text-muted-foreground">Optimization: {record.optimization}</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="outline" className="rounded-xl">
            <Link to="/assignments/history">
              <ArrowLeft className="h-4 w-4" /> Back
            </Link>
          </Button>
          <Button variant="outline" className="rounded-xl">
            <Pencil className="h-4 w-4" /> Edit Assignment
          </Button>
          <Button className="rounded-xl shadow-soft">
            <FileBarChart className="h-4 w-4" /> Generate Report
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label} className={`rounded-2xl border-border/60 shadow-soft bg-gradient-to-br ${k.tone}`}>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{k.label}</p>
                <p className="mt-2 text-2xl font-semibold tabular-nums">{k.value}</p>
              </div>
              <div className="rounded-xl bg-background/70 p-2.5 shadow-sm">
                <k.icon className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-2xl border-border/60 shadow-soft">
        <CardHeader>
          <CardTitle className="text-base">Assignment Information</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-x-8 gap-y-4 md:grid-cols-2 lg:grid-cols-3">
            <InfoRow label="Assignment Name" value={record.name} />
            <InfoRow label="Assignment Type" value={record.type} />
            <InfoRow label="Optimization Type" value={record.optimization} />
            <InfoRow label="Status" value={record.status} />
            <InfoRow label="Created By" value={record.createdBy} icon={<User className="h-3.5 w-3.5" />} />
            <InfoRow label="Created Date" value={formatDate(record.createdDate)} icon={<Calendar className="h-3.5 w-3.5" />} />
            <InfoRow label="Last Updated" value={formatDate(record.lastModified)} icon={<Calendar className="h-3.5 w-3.5" />} />
            <InfoRow label="Assignment ID" value={`#${record.id}`} />
          </dl>
          <Separator className="my-6" />
          <div className="rounded-xl bg-muted/40 p-4 text-sm text-muted-foreground">
            Detailed resource & task tables and the optimization matrix appear here once data has been loaded.
            Generate a report to export the full assignment summary.
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}

function InfoRow({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="mt-1 flex items-center gap-1.5 text-sm font-medium">
        {icon}
        {value}
      </dd>
    </div>
  );
}
