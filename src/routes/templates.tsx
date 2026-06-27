import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Eye, Sparkles, Users2, ListChecks, TrendingUp } from "lucide-react";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ASSIGNMENT_TYPES } from "@/lib/mock-data";

export const Route = createFileRoute("/templates")({
  head: () => ({
    meta: [
      { title: "Templates — Task Align" },
      { name: "description", content: "Start a new assignment from a predefined template." },
    ],
  }),
  component: TemplatesPage,
});

function TemplatesPage() {
  const navigate = useNavigate();
  const [preview, setPreview] = useState<(typeof ASSIGNMENT_TYPES)[number] | null>(null);

  return (
    <DashboardShell>
      <header className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Workspace</p>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Templates</h1>
        <p className="text-sm text-muted-foreground">
          Kickstart a new assignment using one of our predefined enterprise templates.
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {ASSIGNMENT_TYPES.map((t) => (
          <Card
            key={t.name}
            className="group relative overflow-hidden rounded-2xl border-border/60 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-elevated"
          >
            <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${t.gradient}`} />
            <CardContent className="space-y-4 p-6">
              <div className="flex items-start justify-between">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${t.gradient} text-white shadow-soft`}>
                  <t.icon className="h-7 w-7" />
                </div>
                <Badge variant="outline" className="rounded-full border-primary/20 bg-primary/5 text-primary">
                  {t.defaultOpt}
                </Badge>
              </div>
              <div>
                <h3 className="text-lg font-semibold">{t.name} Assignment</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 rounded-xl bg-muted/40 p-3">
                <Stat icon={Users2} label="Est. Resources" value={t.resources} />
                <Stat icon={ListChecks} label="Est. Tasks" value={t.tasks} />
              </div>
              <div className="flex gap-2 pt-1">
                <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setPreview(t)}>
                  <Eye className="h-4 w-4" /> Preview
                </Button>
                <Button
                  className="flex-1 rounded-xl shadow-soft"
                  onClick={() =>
                    navigate({ to: "/assignments/new", search: { template: t.name } as never })
                  }
                >
                  <Sparkles className="h-4 w-4" /> Use Template
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent className="rounded-2xl sm:max-w-lg">
          {preview && (
            <>
              <DialogHeader>
                <div className={`mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${preview.gradient} text-white`}>
                  <preview.icon className="h-6 w-6" />
                </div>
                <DialogTitle>{preview.name} Assignment Template</DialogTitle>
                <DialogDescription>{preview.description}</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-3 gap-3 py-2">
                <Stat icon={Users2} label="Resources" value={preview.resources} />
                <Stat icon={ListChecks} label="Tasks" value={preview.tasks} />
                <Stat icon={TrendingUp} label="Default Opt." value={preview.defaultOpt} />
              </div>
              <div className="rounded-xl bg-muted/40 p-4 text-sm text-muted-foreground">
                This template will pre-fill the assignment type, default optimization strategy and seed
                a {preview.resources}×{preview.tasks} matrix you can edit before generating.
              </div>
              <DialogFooter>
                <Button variant="outline" className="rounded-xl" onClick={() => setPreview(null)}>
                  Close
                </Button>
                <Button
                  className="rounded-xl shadow-soft"
                  onClick={() =>
                    navigate({ to: "/assignments/new", search: { template: preview.name } as never })
                  }
                >
                  <Sparkles className="h-4 w-4" /> Use Template
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="rounded-lg bg-background p-1.5 shadow-sm">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="leading-tight">
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold tabular-nums">{value}</p>
      </div>
    </div>
  );
}
