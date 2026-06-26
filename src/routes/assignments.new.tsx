import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
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
  Plus,
  Pencil,
  Trash2,
  UploadCloud,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  Info,
  Hand,
  FileUp,
  Grid3x3,
  ClipboardCheck,
  Loader2,
  Trophy,
  FileDown,
  RefreshCw,
  LayoutDashboard,
  AlertTriangle,
  Save,
  Calculator,
  Target,
  Clock,
  Gauge,
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
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
    description:
      "Match employees to projects, shifts, and tasks based on skills and availability.",
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


// 6-step model. Step 0 = type selection (auto-completed once chosen).
const STEPS = [
  { id: 0, label: "Assignment Type" },
  { id: 1, label: "Basic Information" },
  { id: 2, label: "Resources & Tasks" },
  { id: 3, label: "Matrix Entry" },
  { id: 4, label: "Review" },
  { id: 5, label: "Result" },
];

type BasicForm = {
  name: string;
  description: string;
  optimization: "cost" | "profit";
};

type NamedItem = { id: string; name: string };

type AssignmentResult = {
  pairs: { resource: string; task: string; value: number }[];
  total: number;
  manual: number;
  savings: number;
  improvement: number;
  executionMs: number;
};

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

// Brute-force Hungarian for small N (n!), greedy fallback above 8.
function solveAssignment(
  matrix: number[][],
  rowNames: string[],
  colNames: string[],
  mode: "cost" | "profit",
): { pairs: { resource: string; task: string; value: number }[]; total: number } {
  const n = matrix.length;
  if (n === 0) return { pairs: [], total: 0 };
  const m = matrix[0].length;
  const size = Math.min(n, m);

  if (n <= 8 && m <= 8) {
    const cols = Array.from({ length: m }, (_, i) => i);
    let best: number[] | null = null;
    let bestScore = mode === "cost" ? Infinity : -Infinity;
    const permute = (arr: number[], k: number) => {
      if (k === size) {
        let s = 0;
        for (let i = 0; i < size; i++) s += matrix[i][arr[i]] ?? 0;
        if (mode === "cost" ? s < bestScore : s > bestScore) {
          bestScore = s;
          best = arr.slice(0, size);
        }
        return;
      }
      for (let i = k; i < arr.length; i++) {
        [arr[k], arr[i]] = [arr[i], arr[k]];
        permute(arr, k + 1);
        [arr[k], arr[i]] = [arr[i], arr[k]];
      }
    };
    permute(cols, 0);
    const pairs = (best ?? []).map((c, r) => ({
      resource: rowNames[r],
      task: colNames[c],
      value: matrix[r][c],
    }));
    return { pairs, total: bestScore === Infinity || bestScore === -Infinity ? 0 : bestScore };
  }

  // Greedy fallback
  const used = new Set<number>();
  const pairs: { resource: string; task: string; value: number }[] = [];
  let total = 0;
  for (let r = 0; r < size; r++) {
    let bestC = -1;
    let bestV = mode === "cost" ? Infinity : -Infinity;
    for (let c = 0; c < m; c++) {
      if (used.has(c)) continue;
      const v = matrix[r][c] ?? 0;
      if (mode === "cost" ? v < bestV : v > bestV) {
        bestV = v;
        bestC = c;
      }
    }
    if (bestC >= 0) {
      used.add(bestC);
      pairs.push({ resource: rowNames[r], task: colNames[bestC], value: matrix[r][bestC] });
      total += matrix[r][bestC];
    }
  }
  return { pairs, total };
}

function diagonalTotal(matrix: number[][]): number {
  let s = 0;
  const n = Math.min(matrix.length, matrix[0]?.length ?? 0);
  for (let i = 0; i < n; i++) s += matrix[i][i] ?? 0;
  return s;
}



function CreateAssignmentPage() {
  const [selected, setSelected] = useState<AssignmentType | null>(null);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<BasicForm>({
    name: "",
    description: "",
    optimization: "cost",
  });
  const [resources, setResources] = useState<NamedItem[]>([
    { id: uid(), name: "John" },
    { id: uid(), name: "David" },
    { id: uid(), name: "Rahul" },
    { id: uid(), name: "Amit" },
    { id: uid(), name: "Simran" },
  ]);
  const [tasks, setTasks] = useState<NamedItem[]>([
    { id: uid(), name: "Module 1" },
    { id: uid(), name: "Module 2" },
    { id: uid(), name: "Module 3" },
    { id: uid(), name: "Module 4" },
    { id: uid(), name: "Module 5" },
  ]);

  const reset = () => {
    setSelected(null);
    setStep(1);
    setForm({ name: "", description: "", optimization: "cost" });
  };

  const handleNext = () => {
    if (step === 1) {
      if (!form.name.trim()) {
        toast.error("Assignment name is required");
        return;
      }
      toast.success("Basic information saved");
    } else if (step === 2) {
      if (resources.length === 0 || tasks.length === 0) {
        toast.error("Add at least one resource and one task");
        return;
      }
      toast.success("Resources & tasks saved");
    }
    setStep((s) => Math.min(s + 1, 4));
  };

  const handleBack = () => {
    if (step === 1) reset();
    else setStep((s) => s - 1);
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <TopNav />
        <main className="flex-1 bg-gradient-to-b from-primary-soft/30 via-background to-background">
          <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8">
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
              <div className="space-y-6">
                <HorizontalStepper step={step} type={selected} />
                {step === 1 && (
                  <BasicInfoStep
                    form={form}
                    setForm={setForm}
                    onBack={handleBack}
                    onNext={handleNext}
                    onCancel={reset}
                  />
                )}
                {step === 2 && (
                  <ResourcesTasksStep
                    resources={resources}
                    setResources={setResources}
                    tasks={tasks}
                    setTasks={setTasks}
                    onBack={handleBack}
                    onNext={handleNext}
                  />
                )}
                {step >= 3 && (
                  <Card className="rounded-2xl border-border bg-card shadow-soft">
                    <CardContent className="flex h-64 flex-col items-center justify-center gap-3 p-8 text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Sparkles className="h-6 w-6" />
                      </div>
                      <p className="text-base font-semibold">
                        {STEPS[step]?.label} — coming next
                      </p>
                      <p className="max-w-md text-sm text-muted-foreground">
                        This step will be built in the next iteration.
                      </p>
                      <div className="mt-2 flex gap-2">
                        <Button variant="outline" onClick={handleBack} className="rounded-xl">
                          <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

/* ---------------- Type selection ---------------- */

function TypeSelection({ onSelect }: { onSelect: (t: AssignmentType) => void }) {
  return (
    <div>
      <div className="mb-8 max-w-2xl">
        <Badge
          variant="secondary"
          className="mb-3 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
        >
          <Sparkles className="mr-1.5 h-3 w-3" />
          Step 1 · Choose a workflow
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
                Select <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Horizontal stepper ---------------- */

function HorizontalStepper({ step, type }: { step: number; type: AssignmentType }) {
  return (
    <Card className="rounded-2xl border-border bg-card shadow-soft">
      <CardContent className="p-5 md:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
              <type.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">{type.title}</p>
              <p className="text-xs text-muted-foreground">{type.tag} workflow</p>
            </div>
          </div>
          <Badge
            variant="secondary"
            className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
          >
            Step {step + 1} of {STEPS.length}
          </Badge>
        </div>

        <ol className="flex flex-wrap items-center gap-2 md:flex-nowrap">
          {STEPS.map((s, idx) => {
            const status: "done" | "current" | "upcoming" =
              s.id < step ? "done" : s.id === step ? "current" : "upcoming";
            return (
              <li key={s.id} className="flex flex-1 items-center gap-2 min-w-fit">
                <div
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl border px-3 py-2 transition-colors",
                    status === "done" && "border-primary/30 bg-primary/5",
                    status === "current" &&
                      "border-primary bg-primary text-primary-foreground shadow-glow",
                    status === "upcoming" && "border-border bg-background",
                  )}
                >
                  <div
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ring-1",
                      status === "done" && "bg-primary text-primary-foreground ring-primary",
                      status === "current" &&
                        "bg-primary-foreground text-primary ring-primary-foreground",
                      status === "upcoming" && "bg-muted text-muted-foreground ring-border",
                    )}
                  >
                    {status === "done" ? <Check className="h-3.5 w-3.5" /> : idx + 1}
                  </div>
                  <span
                    className={cn(
                      "text-xs font-medium whitespace-nowrap",
                      status === "upcoming" && "text-muted-foreground",
                    )}
                  >
                    {s.label}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "hidden h-px flex-1 md:block",
                      s.id < step ? "bg-primary/40" : "bg-border",
                    )}
                  />
                )}
              </li>
            );
          })}
        </ol>
      </CardContent>
    </Card>
  );
}

/* ---------------- Step 1: Basic info ---------------- */

function BasicInfoStep({
  form,
  setForm,
  onBack,
  onNext,
  onCancel,
}: {
  form: BasicForm;
  setForm: React.Dispatch<React.SetStateAction<BasicForm>>;
  onBack: () => void;
  onNext: () => void;
  onCancel: () => void;
}) {
  return (
    <Card className="rounded-2xl border-border bg-card shadow-soft">
      <CardContent className="p-6 md:p-8">
        <StepHeader
          step={2}
          title="Basic Information"
          description="Name your assignment and define how the optimizer should solve it."
          onCancel={onCancel}
        />
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
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
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
                onSelect={() => setForm((f) => ({ ...f, optimization: "profit" }))}
                icon={TrendingUp}
                title="Profit Maximization"
                description="Optimize allocations to maximize total margin and revenue."
              />
            </div>
          </div>
        </div>
        <StepFooter onBack={onBack} onNext={onNext} backLabel="Cancel" />
      </CardContent>
    </Card>
  );
}

/* ---------------- Step 2: Resources & Tasks ---------------- */

function ResourcesTasksStep({
  resources,
  setResources,
  tasks,
  setTasks,
  onBack,
  onNext,
}: {
  resources: NamedItem[];
  setResources: React.Dispatch<React.SetStateAction<NamedItem[]>>;
  tasks: NamedItem[];
  setTasks: React.Dispatch<React.SetStateAction<NamedItem[]>>;
  onBack: () => void;
  onNext: () => void;
}) {
  const [mode, setMode] = useState<"manual" | "upload">("manual");

  return (
    <Card className="rounded-2xl border-border bg-card shadow-soft">
      <CardContent className="p-6 md:p-8">
        <StepHeader
          step={3}
          title="Resources & Tasks"
          description="Add resources and tasks manually or upload them using an Excel template."
        />

        <Tabs value={mode} onValueChange={(v) => setMode(v as "manual" | "upload")}>
          <TabsList className="h-12 rounded-xl bg-muted/60 p-1">
            <TabsTrigger
              value="manual"
              className="h-10 gap-2 rounded-lg px-4 text-sm data-[state=active]:bg-background data-[state=active]:shadow-soft"
            >
              <Hand className="h-4 w-4" /> Manual Entry
            </TabsTrigger>
            <TabsTrigger
              value="upload"
              className="h-10 gap-2 rounded-lg px-4 text-sm data-[state=active]:bg-background data-[state=active]:shadow-soft"
            >
              <FileUp className="h-4 w-4" /> Bulk Upload (Excel)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="mt-6">
            <div className="grid gap-5 lg:grid-cols-2">
              <ItemListCard
                label="Resources"
                placeholder="e.g. John"
                inputLabel="Resource Name"
                addLabel="Add Resource"
                columnLabel="Resource Name"
                totalLabel="Total Resources"
                accentIcon={Users}
                items={resources}
                setItems={setResources}
              />
              <ItemListCard
                label="Tasks"
                placeholder="e.g. Module 1"
                inputLabel="Task Name"
                addLabel="Add Task"
                columnLabel="Task Name"
                totalLabel="Total Tasks"
                accentIcon={Sparkles}
                items={tasks}
                setItems={setTasks}
              />
            </div>
          </TabsContent>

          <TabsContent value="upload" className="mt-6">
            <BulkUploadPanel />
          </TabsContent>
        </Tabs>

        <StepFooter onBack={onBack} onNext={onNext} backLabel="Back" />
      </CardContent>
    </Card>
  );
}

function ItemListCard({
  label,
  placeholder,
  inputLabel,
  addLabel,
  columnLabel,
  totalLabel,
  accentIcon: AccentIcon,
  items,
  setItems,
}: {
  label: string;
  placeholder: string;
  inputLabel: string;
  addLabel: string;
  columnLabel: string;
  totalLabel: string;
  accentIcon: React.ComponentType<{ className?: string }>;
  items: NamedItem[];
  setItems: React.Dispatch<React.SetStateAction<NamedItem[]>>;
}) {
  const [value, setValue] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");

  const add = () => {
    const v = value.trim();
    if (!v) return;
    setItems((arr) => [...arr, { id: uid(), name: v }]);
    setValue("");
  };

  const remove = (id: string) => setItems((arr) => arr.filter((i) => i.id !== id));

  const startEdit = (item: NamedItem) => {
    setEditingId(item.id);
    setEditingValue(item.name);
  };

  const saveEdit = () => {
    if (!editingId) return;
    const v = editingValue.trim();
    if (!v) return;
    setItems((arr) => arr.map((i) => (i.id === editingId ? { ...i, name: v } : i)));
    setEditingId(null);
    setEditingValue("");
  };

  return (
    <Card className="rounded-2xl border-border bg-card shadow-soft">
      <CardContent className="flex h-full flex-col gap-5 p-5">
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
            <AccentIcon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-base font-semibold tracking-tight">{label}</p>
            <p className="text-xs text-muted-foreground">
              {items.length} {label.toLowerCase()} added
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">{inputLabel}</Label>
          <div className="flex gap-2">
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  add();
                }
              }}
              placeholder={placeholder}
              className="h-11 rounded-xl"
            />
            <Button
              onClick={add}
              disabled={!value.trim()}
              className="h-11 shrink-0 rounded-xl bg-primary px-4 text-primary-foreground shadow-soft hover:shadow-glow"
            >
              <Plus className="mr-1 h-4 w-4" /> {addLabel}
            </Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="w-12 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  #
                </TableHead>
                <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {columnLabel}
                </TableHead>
                <TableHead className="w-28 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="py-10 text-center text-sm text-muted-foreground">
                    No entries yet. Add your first {label.toLowerCase().slice(0, -1)}.
                  </TableCell>
                </TableRow>
              )}
              {items.map((item, idx) => {
                const editing = editingId === item.id;
                return (
                  <TableRow key={item.id} className="group">
                    <TableCell className="text-sm text-muted-foreground">{idx + 1}</TableCell>
                    <TableCell className="text-sm font-medium">
                      {editing ? (
                        <Input
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              saveEdit();
                            } else if (e.key === "Escape") {
                              setEditingId(null);
                            }
                          }}
                          autoFocus
                          className="h-9 rounded-lg"
                        />
                      ) : (
                        item.name
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {editing ? (
                          <Button
                            size="sm"
                            onClick={saveEdit}
                            className="h-8 rounded-lg bg-primary px-3 text-primary-foreground"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </Button>
                        ) : (
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => startEdit(item)}
                            className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => remove(item.id)}
                          className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <div className="mt-auto flex items-center justify-between rounded-xl bg-primary/5 px-4 py-3">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {totalLabel}
          </span>
          <Badge className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-soft">
            {items.length}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

/* ---------------- Bulk upload ---------------- */

type UploadState = {
  filename: string;
  resources: number;
  tasks: number;
  matrix: number;
};

function BulkUploadPanel() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploaded, setUploaded] = useState<UploadState | null>({
    filename: "developer_assignment.xlsx",
    resources: 5,
    tasks: 5,
    matrix: 25,
  });

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext !== "xlsx" && ext !== "xls") {
      toast.error("Only .xlsx and .xls files are supported");
      return;
    }
    setUploaded({ filename: file.name, resources: 5, tasks: 5, matrix: 25 });
    toast.success("File uploaded", { description: file.name });
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
      {/* Upload card */}
      <Card className="rounded-2xl border-border bg-card shadow-soft">
        <CardContent className="space-y-5 p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base font-semibold tracking-tight">
                Upload Excel Template
              </p>
              <p className="text-xs text-muted-foreground">
                Upload a single Excel file containing Resources, Tasks and Matrix Values.
              </p>
            </div>
          </div>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              handleFiles(e.dataTransfer.files);
            }}
            className={cn(
              "relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-all",
              dragging
                ? "border-primary bg-primary/5"
                : "border-border bg-muted/30 hover:border-primary/40 hover:bg-primary/5",
            )}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-glow">
              <UploadCloud className="h-7 w-7" />
            </div>
            <div>
              <p className="text-sm font-semibold">Drag & drop your Excel file here</p>
              <p className="mt-1 text-xs text-muted-foreground">
                or click below to browse from your device
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 text-[11px]">
              <Badge
                variant="outline"
                className="rounded-full border-border bg-background px-2.5 py-0.5 font-medium text-muted-foreground"
              >
                .xlsx
              </Badge>
              <Badge
                variant="outline"
                className="rounded-full border-border bg-background px-2.5 py-0.5 font-medium text-muted-foreground"
              >
                .xls
              </Badge>
              <span className="text-muted-foreground">· Max 10 MB</span>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
            <Button
              variant="outline"
              className="h-10 rounded-xl"
              onClick={() => toast.success("Sample template downloaded")}
            >
              <Download className="mr-1.5 h-4 w-4" /> Download Sample Template
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="h-10 rounded-xl"
                onClick={() => inputRef.current?.click()}
              >
                Browse Files
              </Button>
              <Button
                className="h-10 rounded-xl bg-primary text-primary-foreground shadow-soft hover:shadow-glow"
                onClick={() => inputRef.current?.click()}
              >
                <UploadCloud className="mr-1.5 h-4 w-4" /> Upload Excel
              </Button>
            </div>
          </div>

          {uploaded && (
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <FileSpreadsheet className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold">{uploaded.filename}</p>
                    <Badge className="rounded-full bg-success/15 px-2.5 py-0.5 text-[11px] font-medium text-success">
                      <CheckCircle2 className="mr-1 h-3 w-3" /> Uploaded Successfully
                    </Badge>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <Stat label="Resources" value={uploaded.resources} />
                    <Stat label="Tasks" value={uploaded.tasks} />
                    <Stat label="Matrix Values" value={uploaded.matrix} />
                  </div>
                  <ul className="mt-4 space-y-1.5">
                    {[
                      "Resources Imported Successfully",
                      "Tasks Imported Successfully",
                      "Matrix Imported Successfully",
                    ].map((msg) => (
                      <li
                        key={msg}
                        className="flex items-center gap-2 text-xs text-foreground"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                        {msg}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setUploaded(null)}
                  className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info / sample format card */}
      <Card className="rounded-2xl border-border bg-card shadow-soft">
        <CardContent className="space-y-4 p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
              <Info className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base font-semibold tracking-tight">Sample Excel Format</p>
              <p className="text-xs text-muted-foreground">
                A single sheet with resources as rows, tasks as columns, and matrix values
                inside.
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-border">
            <div className="overflow-x-auto">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="bg-primary/10 text-primary">
                    <th className="px-2.5 py-2 text-left font-semibold">Resource / Task</th>
                    {["Module 1", "Module 2", "Module 3", "Module 4", "Module 5"].map((m) => (
                      <th key={m} className="px-2.5 py-2 text-center font-semibold">
                        {m}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Rahul", 9, 2, 7, 8, 6],
                    ["Amit", 6, 4, 3, 7, 5],
                    ["Simran", 5, 8, 1, 8, 4],
                    ["Pooja", 7, 6, 9, 4, 3],
                    ["John", 8, 3, 2, 6, 7],
                  ].map((row, i) => (
                    <tr key={i} className="border-t border-border bg-card">
                      <td className="px-2.5 py-2 font-medium">{row[0]}</td>
                      {row.slice(1).map((v, j) => (
                        <td
                          key={j}
                          className="px-2.5 py-2 text-center text-muted-foreground"
                        >
                          {v}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
            <p className="text-xs font-semibold text-primary">
              The uploaded Excel will automatically extract:
            </p>
            <ul className="mt-2 space-y-1 text-xs text-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Resources
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Tasks
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Matrix Values
              </li>
            </ul>
            <p className="mt-2 text-[11px] text-muted-foreground">
              No separate uploads required.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-background px-3 py-2 text-center">
      <p className="text-lg font-semibold text-primary">{value}</p>
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
    </div>
  );
}

/* ---------------- Shared step pieces ---------------- */

function StepHeader({
  step,
  title,
  description,
  onCancel,
}: {
  step: number;
  title: string;
  description: string;
  onCancel?: () => void;
}) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-primary">
          Step {step} of {STEPS.length}
        </p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {onCancel && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onCancel}
          className="rounded-lg text-muted-foreground hover:text-foreground"
          aria-label="Cancel"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

function StepFooter({
  onBack,
  onNext,
  backLabel = "Back",
}: {
  onBack: () => void;
  onNext: () => void;
  backLabel?: string;
}) {
  return (
    <div className="mt-8 flex items-center justify-between border-t border-border pt-5">
      <Button variant="outline" onClick={onBack} className="h-11 rounded-xl px-5">
        <ArrowLeft className="mr-1.5 h-4 w-4" /> {backLabel}
      </Button>
      <Button
        onClick={onNext}
        className="h-11 rounded-xl bg-primary px-6 text-primary-foreground shadow-soft hover:shadow-glow"
      >
        Next <ArrowRight className="ml-1.5 h-4 w-4" />
      </Button>
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
          : "border-border bg-card hover:border-primary/40",
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
        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{description}</p>
      </div>
    </button>
  );
}
