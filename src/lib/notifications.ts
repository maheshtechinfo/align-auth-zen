import {
  CheckCircle2,
  FileSpreadsheet,
  Sparkles,
  FileText,
  KeyRound,
  Bell,
  type LucideIcon,
} from "lucide-react";

export type NotificationItem = {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  time: string;
  read: boolean;
  tone: "success" | "info" | "warning";
};

export const NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n1",
    icon: CheckCircle2,
    title: "Assignment Created Successfully",
    description: "Developer Assignment has been created.",
    time: "2 minutes ago",
    read: false,
    tone: "success",
  },
  {
    id: "n2",
    icon: FileSpreadsheet,
    title: "Matrix Uploaded Successfully",
    description: "The Excel matrix was uploaded successfully.",
    time: "15 minutes ago",
    read: false,
    tone: "info",
  },
  {
    id: "n3",
    icon: Sparkles,
    title: "Hungarian Algorithm Completed",
    description: "The optimal assignment has been generated.",
    time: "30 minutes ago",
    read: false,
    tone: "success",
  },
  {
    id: "n4",
    icon: FileText,
    title: "Report Generated",
    description: "Developer Assignment Report.pdf is ready.",
    time: "1 hour ago",
    read: false,
    tone: "info",
  },
  {
    id: "n5",
    icon: KeyRound,
    title: "Password Changed",
    description: "Your password has been updated successfully.",
    time: "Yesterday",
    read: true,
    tone: "warning",
  },
  {
    id: "n6",
    icon: Bell,
    title: "Weekly Digest Available",
    description: "Your weekly optimization digest is ready to view.",
    time: "2 days ago",
    read: true,
    tone: "info",
  },
];

export type ActivityModule =
  | "Assignments"
  | "Reports"
  | "Profile"
  | "Authentication"
  | "Settings";

export type ActivityItem = {
  id: string;
  dateTime: string;
  dayLabel: string;
  time: string;
  activity: string;
  module: ActivityModule;
  details: string;
  performedBy: string;
  status: "Success" | "Pending" | "Failed";
};

export const ACTIVITIES: ActivityItem[] = [
  { id: "a1", dateTime: "2026-06-29T10:15:00", dayLabel: "Today", time: "10:15 AM", activity: "Created Developer Assignment", module: "Assignments", details: "Banking Project", performedBy: "Mahesh Kumar", status: "Success" },
  { id: "a2", dateTime: "2026-06-29T10:20:00", dayLabel: "Today", time: "10:20 AM", activity: "Added Resources", module: "Assignments", details: "15 resources added", performedBy: "Mahesh Kumar", status: "Success" },
  { id: "a3", dateTime: "2026-06-29T10:25:00", dayLabel: "Today", time: "10:25 AM", activity: "Uploaded Matrix", module: "Assignments", details: "matrix_banking.xlsx (15×15)", performedBy: "Mahesh Kumar", status: "Success" },
  { id: "a4", dateTime: "2026-06-29T10:28:00", dayLabel: "Today", time: "10:28 AM", activity: "Hungarian Algorithm Executed", module: "Assignments", details: "Optimal cost: ₹1,42,500", performedBy: "Mahesh Kumar", status: "Success" },
  { id: "a5", dateTime: "2026-06-29T10:30:00", dayLabel: "Today", time: "10:30 AM", activity: "Downloaded PDF Report", module: "Reports", details: "Developer Assignment Report.pdf", performedBy: "Mahesh Kumar", status: "Success" },
  { id: "a6", dateTime: "2026-06-28T18:10:00", dayLabel: "Yesterday", time: "06:10 PM", activity: "Changed Password", module: "Authentication", details: "Password updated", performedBy: "Mahesh Kumar", status: "Success" },
  { id: "a7", dateTime: "2026-06-28T15:42:00", dayLabel: "Yesterday", time: "03:42 PM", activity: "Updated Profile", module: "Profile", details: "Avatar and bio updated", performedBy: "Mahesh Kumar", status: "Success" },
  { id: "a8", dateTime: "2026-06-28T11:05:00", dayLabel: "Yesterday", time: "11:05 AM", activity: "Generated Teacher Assignment", module: "Assignments", details: "Summer Faculty Plan", performedBy: "Jane Cooper", status: "Success" },
  { id: "a9", dateTime: "2026-06-27T09:00:00", dayLabel: "This Week", time: "09:00 AM", activity: "Logged In", module: "Authentication", details: "Web · Chrome on macOS", performedBy: "Mahesh Kumar", status: "Success" },
  { id: "a10", dateTime: "2026-06-26T16:20:00", dayLabel: "This Week", time: "04:20 PM", activity: "Updated Settings", module: "Settings", details: "Enabled email notifications", performedBy: "Mahesh Kumar", status: "Success" },
];
