import { Bell, Check, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NOTIFICATIONS, type NotificationItem } from "@/lib/notifications";
import { cn } from "@/lib/utils";

const toneClass: Record<NotificationItem["tone"], string> = {
  success: "bg-emerald-100 text-emerald-600",
  info: "bg-primary/10 text-primary",
  warning: "bg-amber-100 text-amber-600",
};

export function NotificationsBell() {
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
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-xl">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground shadow-glow">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[380px] rounded-2xl p-0 shadow-elevated"
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div>
            <p className="text-sm font-semibold">Notifications</p>
            <p className="text-xs text-muted-foreground">
              {unreadCount} unread · {items.length} total
            </p>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 rounded-lg text-xs text-primary hover:text-primary"
            onClick={markAllRead}
            disabled={unreadCount === 0}
          >
            <Check className="mr-1 h-3.5 w-3.5" /> Mark all
          </Button>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <div className="px-3 pt-3">
            <TabsList className="grid w-full grid-cols-3 rounded-xl">
              <TabsTrigger value="all" className="rounded-lg text-xs">All</TabsTrigger>
              <TabsTrigger value="unread" className="rounded-lg text-xs">Unread</TabsTrigger>
              <TabsTrigger value="read" className="rounded-lg text-xs">Read</TabsTrigger>
            </TabsList>
          </div>

          {(["all", "unread", "read"] as const).map((key) => (
            <TabsContent key={key} value={key} className="mt-2">
              <ScrollArea className="h-[340px]">
                <div className="space-y-1 px-2 pb-2">
                  {lists[key].length === 0 ? (
                    <div className="flex h-40 flex-col items-center justify-center text-center text-sm text-muted-foreground">
                      <Bell className="mb-2 h-6 w-6 opacity-50" />
                      You're all caught up
                    </div>
                  ) : (
                    lists[key].map((n) => (
                      <button
                        key={n.id}
                        onClick={() => markOne(n.id)}
                        className={cn(
                          "flex w-full gap-3 rounded-xl p-3 text-left transition-colors hover:bg-muted/60",
                          !n.read && "bg-primary/[0.04]",
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                            toneClass[n.tone],
                          )}
                        >
                          <n.icon className="h-4 w-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="truncate text-sm font-semibold">{n.title}</p>
                            {!n.read && (
                              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                            )}
                          </div>
                          <p className="line-clamp-2 text-xs text-muted-foreground">
                            {n.description}
                          </p>
                          <p className="mt-1 text-[11px] text-muted-foreground">{n.time}</p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>

        <div className="flex items-center justify-between border-t border-border px-3 py-2">
          <Button
            size="sm"
            variant="ghost"
            className="h-8 rounded-lg text-xs text-destructive hover:text-destructive"
            onClick={clearAll}
            disabled={items.length === 0}
          >
            <Trash2 className="mr-1 h-3.5 w-3.5" /> Clear all
          </Button>
          <Button asChild size="sm" variant="ghost" className="h-8 rounded-lg text-xs text-primary hover:text-primary">
            <Link to="/notifications">View all</Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
