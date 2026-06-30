import { createFileRoute } from "@tanstack/react-router";
import { Download, FileSpreadsheet, CheckCircle2 } from "lucide-react";
import * as XLSX from "xlsx";
import { toast } from "sonner";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/templates")({
  head: () => ({
    meta: [
      { title: "Templates — Task Align" },
      { name: "description", content: "Download sample Excel templates for creating assignments." },
    ],
  }),
  component: TemplatesPage,
});

const RESOURCES = ["Rahul", "Amit", "Simran", "Pooja", "John"];
const TASKS = ["Module 1", "Module 2", "Module 3", "Module 4", "Module 5"];
const MATRIX = [
  [9, 2, 7, 8, 6],
  [6, 4, 3, 7, 5],
  [5, 8, 1, 8, 4],
  [7, 6, 9, 4, 3],
  [8, 3, 2, 6, 7],
];

function downloadSample() {
  const header = ["Resource / Task", ...TASKS];
  const rows = RESOURCES.map((r, i) => [r, ...MATRIX[i]]);
  const ws = XLSX.utils.aoa_to_sheet([header, ...rows]);
  ws["!cols"] = [{ wch: 18 }, ...TASKS.map(() => ({ wch: 12 }))];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Assignment Matrix");
  XLSX.writeFile(wb, "task-align-sample-template.xlsx");
  toast.success("Sample Excel template downloaded");
}

function TemplatesPage() {
  return (
    <DashboardShell>
      <header className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Workspace</p>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Templates</h1>
        <p className="text-sm text-muted-foreground">
          Download sample Excel templates for creating assignments.
        </p>
      </header>

      <Card className="rounded-2xl border-border/60 shadow-soft">
        <CardHeader className="flex flex-row items-start gap-4 space-y-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-glow">
            <FileSpreadsheet className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-lg">Sample Excel Format</CardTitle>
            <CardDescription>
              A single sheet with resources as rows, tasks as columns, and matrix values inside.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="overflow-hidden rounded-xl border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold text-foreground">Resource / Task</TableHead>
                  {TASKS.map((t) => (
                    <TableHead key={t} className="text-center font-semibold text-foreground">
                      {t}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {RESOURCES.map((r, i) => (
                  <TableRow key={r}>
                    <TableCell className="font-medium">{r}</TableCell>
                    {MATRIX[i].map((v, j) => (
                      <TableCell key={j} className="text-center tabular-nums">
                        {v}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
            <p className="text-sm font-semibold text-foreground">
              The uploaded Excel will automatically extract:
            </p>
            <ul className="mt-3 space-y-2 text-sm text-foreground">
              {["Resources", "Tasks", "Matrix Values"].map((label) => (
                <li key={label} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>{label}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted-foreground">No separate uploads required.</p>
          </div>

          <div className="flex justify-center">
            <Button className="rounded-xl shadow-soft" size="lg" onClick={downloadSample}>
              <Download className="h-4 w-4" /> Download Sample Excel Template
            </Button>
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
