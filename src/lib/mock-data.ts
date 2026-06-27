import {
  Users2,
  Code2,
  GraduationCap,
  MapPin,
  Plane,
  Building2,
  type LucideIcon,
} from "lucide-react";

export type AssignmentType =
  | "Employee"
  | "Developer"
  | "Teacher"
  | "Sales Region"
  | "Flight Crew"
  | "Manager Room";

export type OptimizationType = "Cost" | "Profit";
export type AssignmentStatus = "Completed" | "Pending" | "Draft";

export type AssignmentRecord = {
  id: string;
  name: string;
  type: AssignmentType;
  optimization: OptimizationType;
  resources: number;
  tasks: number;
  status: AssignmentStatus;
  createdDate: string;
  lastModified: string;
  createdBy: string;
  result?: number;
};

export const ASSIGNMENT_TYPES: { name: AssignmentType; icon: LucideIcon; description: string; defaultOpt: OptimizationType; resources: number; tasks: number; gradient: string }[] = [
  { name: "Employee", icon: Users2, description: "Match employees to roles based on skills and availability.", defaultOpt: "Cost", resources: 12, tasks: 12, gradient: "from-violet-500 to-fuchsia-500" },
  { name: "Developer", icon: Code2, description: "Allocate developers to projects by cost or productivity.", defaultOpt: "Cost", resources: 15, tasks: 15, gradient: "from-indigo-500 to-purple-500" },
  { name: "Teacher", icon: GraduationCap, description: "Assign teachers to classes optimizing performance.", defaultOpt: "Profit", resources: 10, tasks: 10, gradient: "from-pink-500 to-rose-500" },
  { name: "Sales Region", icon: MapPin, description: "Distribute sales reps across regions for max profit.", defaultOpt: "Profit", resources: 8, tasks: 8, gradient: "from-emerald-500 to-teal-500" },
  { name: "Flight Crew", icon: Plane, description: "Schedule crew to flights minimizing operational cost.", defaultOpt: "Cost", resources: 20, tasks: 20, gradient: "from-sky-500 to-blue-500" },
  { name: "Manager Room", icon: Building2, description: "Assign managers to meeting rooms efficiently.", defaultOpt: "Cost", resources: 6, tasks: 6, gradient: "from-amber-500 to-orange-500" },
];

export const ASSIGNMENTS: AssignmentRecord[] = [
  { id: "001", name: "Banking Project", type: "Developer", optimization: "Cost", resources: 15, tasks: 15, status: "Completed", createdDate: "2026-06-15", lastModified: "2026-06-18", createdBy: "Mahesh Kumar", result: 142500 },
  { id: "002", name: "Summer Faculty Plan", type: "Teacher", optimization: "Profit", resources: 10, tasks: 10, status: "Completed", createdDate: "2026-06-12", lastModified: "2026-06-14", createdBy: "Jane Cooper", result: 89400 },
  { id: "003", name: "APAC Sales Coverage", type: "Sales Region", optimization: "Profit", resources: 8, tasks: 8, status: "Pending", createdDate: "2026-06-20", lastModified: "2026-06-21", createdBy: "Arun Patel" },
  { id: "004", name: "Q3 Crew Rotation", type: "Flight Crew", optimization: "Cost", resources: 20, tasks: 20, status: "Completed", createdDate: "2026-06-08", lastModified: "2026-06-10", createdBy: "Linda Park", result: 312800 },
  { id: "005", name: "HQ Room Allocation", type: "Manager Room", optimization: "Cost", resources: 6, tasks: 6, status: "Draft", createdDate: "2026-06-22", lastModified: "2026-06-22", createdBy: "Jane Cooper" },
  { id: "006", name: "Onboarding Wave 7", type: "Employee", optimization: "Cost", resources: 12, tasks: 12, status: "Completed", createdDate: "2026-06-05", lastModified: "2026-06-09", createdBy: "Mahesh Kumar", result: 56400 },
  { id: "007", name: "Mobile Squad Build", type: "Developer", optimization: "Profit", resources: 9, tasks: 9, status: "Pending", createdDate: "2026-06-19", lastModified: "2026-06-20", createdBy: "Arun Patel" },
  { id: "008", name: "Winter Term Faculty", type: "Teacher", optimization: "Cost", resources: 14, tasks: 14, status: "Draft", createdDate: "2026-06-23", lastModified: "2026-06-23", createdBy: "Jane Cooper" },
  { id: "009", name: "EMEA Sales Lift", type: "Sales Region", optimization: "Profit", resources: 11, tasks: 11, status: "Completed", createdDate: "2026-05-28", lastModified: "2026-06-02", createdBy: "Linda Park", result: 184200 },
  { id: "010", name: "Holiday Crew Plan", type: "Flight Crew", optimization: "Cost", resources: 18, tasks: 18, status: "Completed", createdDate: "2026-05-30", lastModified: "2026-06-03", createdBy: "Mahesh Kumar", result: 268000 },
  { id: "011", name: "Exec Floor Rooms", type: "Manager Room", optimization: "Profit", resources: 7, tasks: 7, status: "Pending", createdDate: "2026-06-25", lastModified: "2026-06-26", createdBy: "Jane Cooper" },
  { id: "012", name: "Platform Refactor Team", type: "Developer", optimization: "Cost", resources: 13, tasks: 13, status: "Completed", createdDate: "2026-06-11", lastModified: "2026-06-17", createdBy: "Arun Patel", result: 124900 },
];

export type ReportFormat = "PDF" | "Excel";
export type ReportRecord = {
  id: string;
  name: string;
  assignmentId: string;
  assignmentName: string;
  assignmentType: AssignmentType;
  generatedBy: string;
  generatedDate: string;
  format: ReportFormat;
};

export const REPORTS: ReportRecord[] = [
  { id: "RPT001", name: "Developer Assignment Report", assignmentId: "001", assignmentName: "Banking Project", assignmentType: "Developer", generatedBy: "Mahesh Kumar", generatedDate: "2026-06-20", format: "PDF" },
  { id: "RPT002", name: "Faculty Optimization Summary", assignmentId: "002", assignmentName: "Summer Faculty Plan", assignmentType: "Teacher", generatedBy: "Jane Cooper", generatedDate: "2026-06-15", format: "Excel" },
  { id: "RPT003", name: "Crew Cost Analysis", assignmentId: "004", assignmentName: "Q3 Crew Rotation", assignmentType: "Flight Crew", generatedBy: "Linda Park", generatedDate: "2026-06-11", format: "PDF" },
  { id: "RPT004", name: "EMEA Sales Lift Report", assignmentId: "009", assignmentName: "EMEA Sales Lift", assignmentType: "Sales Region", generatedBy: "Linda Park", generatedDate: "2026-06-03", format: "Excel" },
  { id: "RPT005", name: "Onboarding Outcome", assignmentId: "006", assignmentName: "Onboarding Wave 7", assignmentType: "Employee", generatedBy: "Mahesh Kumar", generatedDate: "2026-06-10", format: "PDF" },
  { id: "RPT006", name: "Holiday Crew Plan Report", assignmentId: "010", assignmentName: "Holiday Crew Plan", assignmentType: "Flight Crew", generatedBy: "Mahesh Kumar", generatedDate: "2026-06-04", format: "PDF" },
  { id: "RPT007", name: "Platform Refactor Output", assignmentId: "012", assignmentName: "Platform Refactor Team", assignmentType: "Developer", generatedBy: "Arun Patel", generatedDate: "2026-06-18", format: "Excel" },
];

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}
