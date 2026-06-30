import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Check, Trash2, Bell } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { NOTIFICATIONS, type NotificationItem } from "@/lib/notifications";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/notifications")({
  component: NotificationsPage,
});

const toneClass: Record<NotificationItem["tone"], string> = {
  success: "bg-emerald-100 text-emerald-600",
  info: "bg-primary/10 text-primary",
  warning: "bg-amber-100 text-amber-600",
};

function NotificationsPage() {
  const [items, setItems] = useState<NotificationItem[]>(NOTIFICATIONS);
  const unreadCount = items.filter((n) => !n.read).length;

  const markAllRead = () => setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  const clearAll = () => setItems([]);
  const markOne = (id: string) =>
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));

  const lists = useMemo(
    () => ({
      all: items,
      unread: items.filter((n) => !n.read),
      read: items.filter((n) => n.read),
    }),
    [items],
  );

  return (
    <DashboardShell>
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Notifications</h1>
          <p className="text-sm text-muted-foreground">
            {unreadCount} unread · {items.length} total
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={markAllRead}
            disabled={unreadCount === 0}
          >
            <Check className="h-4 w-4" /> Mark all as read
          </Button>
          <Button
            variant="outline"
            className="rounded-xl text-destructive hover:text-destructive"
            onClick={clearAll}
            disabled={items.length === 0}
          >
            <Trash2 className="h-4 w-4" /> Clear all
          </Button>
        </div>
      </div>

      <Card className="rounded-2xl shadow-soft">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">All Notifications</CardTitle>
          <Badge variant="secondary" className="rounded-full bg-primary/10 text-primary">
            {unreadCount} unread
          </Badge>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="rounded-xl">
              <TabsTrigger value="all" className="rounded-lg">All</TabsTrigger>
              <TabsTrigger value="unread" className="rounded-lg">Unread</TabsTrigger>
              <TabsTrigger value="read" className="rounded-lg">Read</TabsTrigger>
            </TabsList>

            {(["all", "unread", "read"] as const).map((key) => (
              <TabsContent key={key} value={key} className="mt-4 space-y-1">
                {lists[key].length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-sm text-muted-foreground">
                    <Bell className="mb-2 h-6 w-6 opacity-50" />
                    You're all caught up
                  </div>
                ) : (
                  lists[key].map((n) => (
                    <button
                      key={n.id}
                      onClick={() => markOne(n.id)}
                      className={cn(
                        "flex w-full gap-3 rounded-xl p-4 text-left transition-colors hover:bg-muted/60",
                        !n.read && "bg-primary/[0.04]",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                          toneClass[n.tone],
                        )}
                      >
                        <n.icon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="truncate text-sm font-semibold">{n.title}</p>
                          {!n.read && (
                            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{n.description}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{n.time}</p>
                      </div>
                    </button>
                  ))
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
