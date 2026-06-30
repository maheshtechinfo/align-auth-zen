import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Search,
  Filter,
  Download,
  X,
  ChevronLeft,
  ChevronRight,
  Plus,
  ClipboardList,
} from "lucide-react";
import { toast } from "sonner";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  ASSIGNMENTS,
  formatDate,
  type AssignmentRecord,
  type AssignmentStatus,
  type AssignmentType,
  type OptimizationType,
} from "@/lib/mock-data";

export const Route = createFileRoute("/assignments/history")({
  head: () => ({
    meta: [
      { title: "Assignment History — Task Align" },
      { name: "description", content: "View, search and manage all assignments created in Task Align." },
    ],
  }),
  component: AssignmentHistoryPage,
});

const TYPES: AssignmentType[] = ["Employee", "Developer", "Teacher", "Sales Region", "Flight Crew", "Manager Room"];
const STATUSES: AssignmentStatus[] = ["Completed", "Pending", "Draft"];
const OPTS: OptimizationType[] = ["Cost", "Profit"];

function statusVariant(s: AssignmentStatus) {
  if (s === "Completed") return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
  if (s === "Pending") return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
  return "bg-slate-100 text-slate-700 ring-1 ring-slate-200";
}

function AssignmentHistoryPage() {
  const [rows, setRows] = useState<AssignmentRecord[]>(ASSIGNMENTS);
  const [query, setQuery] = useState("");
  const [type, setType] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [opt, setOpt] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [toDelete, setToDelete] = useState<AssignmentRecord | null>(null);

  const filtered = useMemo(() => {
    let list = rows.filter((r) => {
      const q = query.toLowerCase();
      const matchQ =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q) ||
        r.status.toLowerCase().includes(q);
      const matchT = type === "all" || r.type === type;
      const matchS = status === "all" || r.status === status;
      const matchO = opt === "all" || r.optimization === opt;
      const matchFrom = !dateFrom || r.createdDate >= dateFrom;
      const matchTo = !dateTo || r.createdDate <= dateTo;
      return matchQ && matchT && matchS && matchO && matchFrom && matchTo;
    });
    list = [...list].sort((a, b) =>
      sort === "newest"
        ? b.createdDate.localeCompare(a.createdDate)
        : a.createdDate.localeCompare(b.createdDate),
    );
    return list;
  }, [rows, query, type, status, opt, dateFrom, dateTo, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const clearFilters = () => {
    setQuery("");
    setType("all");
    setStatus("all");
    setOpt("all");
    setDateFrom("");
    setDateTo("");
    setSort("newest");
    setPage(1);
  };

  const handleClone = (r: AssignmentRecord) => {
    const next: AssignmentRecord = {
      ...r,
      id: String(Math.max(...rows.map((x) => Number(x.id))) + 1).padStart(3, "0"),
      name: `${r.name} (Copy)`,
      status: "Draft",
      createdDate: new Date().toISOString().slice(0, 10),
      lastModified: new Date().toISOString().slice(0, 10),
    };
    setRows([next, ...rows]);
    toast.success(`Cloned "${r.name}"`);
  };

  const handleDelete = () => {
    if (!toDelete) return;
    setRows(rows.filter((x) => x.id !== toDelete.id));
    toast.success(`Deleted "${toDelete.name}"`);
    setToDelete(null);
  };

  const handleExport = () => {
    const header = ["ID", "Name", "Type", "Optimization", "Resources", "Tasks", "Status", "Created", "Modified"];
    const lines = [header.join(",")].concat(
      filtered.map((r) =>
        [r.id, r.name, r.type, r.optimization, r.resources, r.tasks, r.status, r.createdDate, r.lastModified].join(","),
      ),
    );
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "assignment-history.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Assignment list exported");
  };

  return (
    <DashboardShell>
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Workspace</p>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Assignment History</h1>
          <p className="text-sm text-muted-foreground">View and manage all assignments created in the system.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" className="rounded-xl" onClick={handleExport}>
            <Download className="h-4 w-4" /> Export Assignment List
          </Button>
          <Button asChild className="rounded-xl shadow-soft">
            <Link to="/assignments/new">
              <Plus className="h-4 w-4" /> Create Assignment
            </Link>
          </Button>
        </div>
      </header>

      <Card className="sticky top-[64px] z-10 rounded-2xl border-border/60 shadow-soft">
        <CardContent className="space-y-4 p-4 md:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by Assignment Name, Type or Status..."
                className="h-10 rounded-xl pl-9"
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Filter className="h-4 w-4" /> {filtered.length} results
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-6">
            <FilterSelect label="Type" value={type} onChange={setType} options={TYPES} />
            <FilterSelect label="Status" value={status} onChange={setStatus} options={STATUSES} />
            <FilterSelect label="Optimization" value={opt} onChange={setOpt} options={OPTS} />
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-muted-foreground">From</label>
              <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="h-9 rounded-lg" />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-muted-foreground">To</label>
              <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="h-9 rounded-lg" />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-muted-foreground">Sort by</label>
              <Select value={sort} onValueChange={(v: "newest" | "oldest") => setSort(v)}>
                <SelectTrigger className="h-9 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end">
            <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={clearFilters}>
              <X className="h-4 w-4" /> Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/60 shadow-soft">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Optimization</TableHead>
                  <TableHead className="text-right">Resources</TableHead>
                  <TableHead className="text-right">Tasks</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Modified</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="py-16 text-center text-sm text-muted-foreground">
                      <ClipboardList className="mx-auto mb-2 h-8 w-8 opacity-40" />
                      No assignments match your filters.
                    </TableCell>
                  </TableRow>
                )}
                {paged.map((r) => (
                  <TableRow key={r.id} className="hover:bg-muted/30">
                    <TableCell className="font-mono text-xs text-muted-foreground">#{r.id}</TableCell>
                    <TableCell className="font-medium">
                      <Link to="/assignments/$id" params={{ id: r.id }} className="hover:text-primary">
                        {r.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="rounded-full border-primary/20 bg-primary/5 text-primary">
                        {r.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{r.optimization}</TableCell>
                    <TableCell className="text-right tabular-nums">{r.resources}</TableCell>
                    <TableCell className="text-right tabular-nums">{r.tasks}</TableCell>
                    <TableCell>
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusVariant(r.status)}`}>
                        {r.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(r.createdDate)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(r.lastModified)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col items-center justify-between gap-3 border-t p-4 md:flex-row">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Rows per page</span>
              <Select
                value={String(pageSize)}
                onValueChange={(v) => {
                  setPageSize(Number(v));
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-8 w-[80px] rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[10, 25, 50, 100].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span>
                {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, filtered.length)} of {filtered.length}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg"
                disabled={currentPage === 1}
                onClick={() => setPage(currentPage - 1)}
              >
                <ChevronLeft className="h-4 w-4" /> Prev
              </Button>
              <span className="px-3 text-sm tabular-nums">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg"
                disabled={currentPage === totalPages}
                onClick={() => setPage(currentPage + 1)}
              >
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete assignment?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove <span className="font-semibold">{toDelete?.name}</span> and all its data.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardShell>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="space-y-1">
      <label className="text-[11px] font-medium text-muted-foreground">{label}</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-9 rounded-lg">
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
