import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Users,
  Code2,
  GraduationCap,
  Map,
  Plane,
  Building2,
  ArrowLeft,
  ArrowRight,
  Check,
  Sparkles,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { TopNav } from "@/components/dashboard/TopNav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/assignments/new")({
  component: CreateAssignmentPage,
});

type AssignmentTypeId =
  | "employee"
  | "developer"
  | "teacher"
  | "sales"
  | "flight"
  | "manager";

type AssignmentType = {
  id: AssignmentTypeId;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
  accent: string;
};

const ASSIGNMENT_TYPES: AssignmentType[] = [
  {
    id: "employee",
    title: "Employee Assignment",
    description: "Match employees to projects, shifts, and tasks based on skills and availability.",
    icon: Users,
    tag: "Workforce",
    accent: "from-violet-500/15 to-violet-500/0",
  },
  {
    id: "developer",
    title: "Developer Assignment",
    description: "Allocate developers to features and sprints with optimal load balancing.",
    icon: Code2,
    tag: "Engineering",
    accent: "from-blue-500/15 to-blue-500/0",
  },
  {
    id: "teacher",
    title: "Teacher Assignment",
    description: "Assign teachers to classes, subjects, and time slots without conflicts.",
    icon: GraduationCap,
    tag: "Education",
    accent: "from-amber-500/15 to-amber-500/0",
  },
  {
    id: "sales",
    title: "Sales Region Assignment",
    description: "Distribute territories among sales reps for maximum coverage and revenue.",
    icon: Map,
    tag: "Sales",
    accent: "from-emerald-500/15 to-emerald-500/0",
  },
  {
    id: "flight",
    title: "Flight Crew Assignment",
    description: "Schedule pilots and cabin crew across routes within regulatory limits.",
    icon: Plane,
    tag: "Aviation",
    accent: "from-sky-500/15 to-sky-500/0",
  },
  {
    id: "manager",
    title: "Manager Room Assignment",
    description: "Allocate meeting rooms and managers to optimize space and collaboration.",
    icon: Building2,
    tag: "Facilities",
    accent: "from-rose-500/15 to-rose-500/0",
  },
];

const STEPS = [
  { id: 1, label: "Basic Information" },
  { id: 2, label: "Resources" },
  { id: 3, label: "Constraints" },
  { id: 4, label: "Review" },
];

function CreateAssignmentPage() {
  const [selected, setSelected] = useState<AssignmentType | null>(null);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    description: "",
    optimization: "cost" as "cost" | "profit",
  });

  const reset = () => {
    setSelected(null);
    setStep(1);
    setForm({ name: "", description: "", optimization: "cost" });
  };

  const handleNext = () => {
    if (!form.name.trim()) {
      toast.error("Assignment name is required");
      return;
    }
    toast.success("Basic information saved", {
      description: "Continue with the next step to add resources.",
    });
    setStep((s) => Math.min(s + 1, STEPS.length));
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <TopNav />
        <main className="flex-1 bg-gradient-to-b from-primary-soft/30 via-background to-background">
          <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8">
            {/* Breadcrumb */}
            <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
              <Link to="/dashboard" className="hover:text-foreground">
                Dashboard
              </Link>
              <span>/</span>
              <span className="text-foreground">Assignments</span>
              <span>/</span>
              <span className="font-medium text-primary">Create New</span>
            </div>

            {!selected ? (
              <TypeSelection onSelect={setSelected} />
            ) : (
              <Stepper
                type={selected}
                step={step}
                form={form}
                setForm={setForm}
                onBack={() => (step === 1 ? reset() : setStep((s) => s - 1))}
                onNext={handleNext}
                onCancel={reset}
              />
            )}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

function TypeSelection({ onSelect }: { onSelect: (t: AssignmentType) => void }) {
  return (
    <div>
      <div className="mb-8 max-w-2xl">
        <Badge
          variant="secondary"
          className="mb-3 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
        >
          <Sparkles className="mr-1.5 h-3 w-3" />
          Step 1 of 2 · Choose a workflow
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Create a new assignment
        </h1>
        <p className="mt-2 text-base text-muted-foreground">
          Select the assignment type that best matches your use case. Each workflow comes
          with tailored fields, constraints, and optimization presets.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {ASSIGNMENT_TYPES.map((t) => (
          <Card
            key={t.id}
            className="group relative overflow-hidden rounded-2xl border-border bg-card shadow-soft transition-all hover:-translate-y-1 hover:shadow-elevated"
          >
            <div
              className={cn(
                "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-60",
                t.accent,
              )}
            />
            <CardContent className="relative flex h-full flex-col gap-4 p-6">
              <div className="flex items-start justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15 transition-all group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-glow">
                  <t.icon className="h-7 w-7" />
                </div>
                <Badge
                  variant="outline"
                  className="rounded-full border-border/70 bg-background/80 text-[10px] font-medium uppercase tracking-wide text-muted-foreground"
                >
                  {t.tag}
                </Badge>
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-semibold tracking-tight text-foreground">
                  {t.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {t.description}
                </p>
              </div>

              <Button
                onClick={() => onSelect(t)}
                className="mt-2 w-full rounded-xl bg-primary text-primary-foreground shadow-soft transition-all hover:shadow-glow"
              >
                Select
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Stepper({
  type,
  step,
  form,
  setForm,
  onBack,
  onNext,
  onCancel,
}: {
  type: AssignmentType;
  step: number;
  form: { name: string; description: string; optimization: "cost" | "profit" };
  setForm: React.Dispatch<
    React.SetStateAction<{
      name: string;
      description: string;
      optimization: "cost" | "profit";
    }>
  >;
  onBack: () => void;
  onNext: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      {/* Stepper rail */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <Card className="rounded-2xl border-border bg-card shadow-soft">
          <CardContent className="p-5">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
                <type.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{type.title}</p>
                <p className="text-xs text-muted-foreground">{type.tag} workflow</p>
              </div>
            </div>
            <ol className="space-y-1">
              {STEPS.map((s, idx) => {
                const status =
                  s.id < step ? "done" : s.id === step ? "current" : "upcoming";
                return (
                  <li key={s.id} className="relative">
                    <div
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-2.5 py-2 transition-colors",
                        status === "current" && "bg-primary/8",
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ring-1 transition-colors",
                          status === "done" &&
                            "bg-primary text-primary-foreground ring-primary",
                          status === "current" &&
                            "bg-primary text-primary-foreground ring-primary shadow-glow",
                          status === "upcoming" &&
                            "bg-muted text-muted-foreground ring-border",
                        )}
                      >
                        {status === "done" ? <Check className="h-3.5 w-3.5" /> : s.id}
                      </div>
                      <div className="min-w-0">
                        <p
                          className={cn(
                            "truncate text-sm",
                            status === "upcoming"
                              ? "text-muted-foreground"
                              : "font-medium text-foreground",
                          )}
                        >
                          {s.label}
                        </p>
                      </div>
                    </div>
                    {idx < STEPS.length - 1 && (
                      <div className="ml-[22px] h-3 w-px bg-border" />
                    )}
                  </li>
                );
              })}
            </ol>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="mt-4 w-full justify-start rounded-lg text-xs text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
              Change assignment type
            </Button>
          </CardContent>
        </Card>
      </aside>

      {/* Step content */}
      <Card className="rounded-2xl border-border bg-card shadow-soft">
        <CardContent className="p-6 md:p-8">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-primary">
                Step {step} of {STEPS.length}
              </p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight">
                Basic Information
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Name your assignment and define how the optimizer should solve it.
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onCancel}
              className="rounded-lg text-muted-foreground hover:text-foreground"
              aria-label="Cancel"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Assignment Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="e.g. Q3 Field Sales Territory Plan"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="h-11 rounded-xl"
                />
                <p className="text-xs text-muted-foreground">
                  This is how the assignment will appear across dashboards and reports.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Brief context, goals, or notes for collaborators…"
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  rows={4}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">Optimization Type</Label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <OptimizationOption
                    selected={form.optimization === "cost"}
                    onSelect={() => setForm((f) => ({ ...f, optimization: "cost" }))}
                    icon={TrendingDown}
                    title="Cost Minimization"
                    description="Solve for the lowest total operating cost across all resources."
                  />
                  <OptimizationOption
                    selected={form.optimization === "profit"}
                    onSelect={() =>
                      setForm((f) => ({ ...f, optimization: "profit" }))
                    }
                    icon={TrendingUp}
                    title="Profit Maximization"
                    description="Optimize allocations to maximize total margin and revenue."
                  />
                </div>
              </div>
            </div>
          )}

          {step > 1 && (
            <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 text-sm text-muted-foreground">
              {STEPS[step - 1]?.label} — coming next.
            </div>
          )}

          <div className="mt-8 flex items-center justify-between border-t border-border pt-5">
            <Button
              variant="outline"
              onClick={onCancel}
              className="h-11 rounded-xl px-5"
            >
              Cancel
            </Button>
            <div className="flex items-center gap-2">
              {step > 1 && (
                <Button
                  variant="ghost"
                  onClick={onBack}
                  className="h-11 rounded-xl px-5"
                >
                  <ArrowLeft className="mr-1.5 h-4 w-4" />
                  Back
                </Button>
              )}
              <Button
                onClick={onNext}
                className="h-11 rounded-xl bg-primary px-6 text-primary-foreground shadow-soft hover:shadow-glow"
              >
                Next
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function OptimizationOption({
  selected,
  onSelect,
  icon: Icon,
  title,
  description,
}: {
  selected: boolean;
  onSelect: () => void;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group relative flex flex-col items-start gap-3 rounded-2xl border p-5 text-left transition-all",
        selected
          ? "border-primary bg-primary/5 shadow-soft ring-1 ring-primary/30"
          : "border-border bg-card hover:border-primary/40 hover:bg-primary/2",
      )}
    >
      <div className="flex w-full items-start justify-between">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl transition-colors",
            selected
              ? "bg-primary text-primary-foreground shadow-glow"
              : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary",
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div
          className={cn(
            "flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors",
            selected ? "border-primary bg-primary" : "border-border bg-background",
          )}
        >
          {selected && <Check className="h-3 w-3 text-primary-foreground" />}
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </button>
  );
}
