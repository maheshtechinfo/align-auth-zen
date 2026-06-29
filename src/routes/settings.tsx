import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Monitor, Moon, Sun, Save, RotateCcw, Bell, Globe, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

const defaultSettings = {
  theme: "light" as "light" | "dark" | "system",
  emailNotif: true,
  pushNotif: true,
  assignmentAlerts: true,
  optimization: "cost" as "cost" | "profit",
  language: "en",
};

function SettingsPage() {
  const [s, setS] = useState(defaultSettings);

  return (
    <DashboardShell>
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Customize Task Align to match how you work.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={() => {
              setS(defaultSettings);
              toast.success("Settings reset to default");
            }}
          >
            <RotateCcw className="h-4 w-4" /> Reset Default
          </Button>
          <Button className="rounded-xl" onClick={() => toast.success("Settings saved")}>
            <Save className="h-4 w-4" /> Save Settings
          </Button>
        </div>
      </div>

      <Card className="rounded-2xl shadow-soft">
        <CardHeader>
          <CardTitle className="text-base">Appearance</CardTitle>
          <CardDescription>Choose how Task Align looks to you.</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={s.theme}
            onValueChange={(v) => setS({ ...s, theme: v as typeof s.theme })}
            className="grid gap-3 sm:grid-cols-3"
          >
            {[
              { v: "light", label: "Light", icon: Sun },
              { v: "dark", label: "Dark", icon: Moon },
              { v: "system", label: "System Default", icon: Monitor },
            ].map((t) => {
              const active = s.theme === t.v;
              return (
                <Label
                  key={t.v}
                  htmlFor={`theme-${t.v}`}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-all",
                    active ? "border-primary bg-primary/5" : "border-border hover:border-primary/40",
                  )}
                >
                  <RadioGroupItem value={t.v} id={`theme-${t.v}`} className="sr-only" />
                  <span className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg",
                    active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                  )}>
                    <t.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{t.label}</p>
                    <p className="text-xs text-muted-foreground">{t.label} theme</p>
                  </div>
                </Label>
              );
            })}
          </RadioGroup>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Bell className="h-4 w-4 text-primary" /> Notifications
          </CardTitle>
          <CardDescription>Decide what we should ping you about.</CardDescription>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          {[
            { k: "emailNotif" as const, t: "Email Notifications", d: "Receive important updates by email." },
            { k: "pushNotif" as const, t: "Push Notifications", d: "Real-time alerts in your browser." },
            { k: "assignmentAlerts" as const, t: "Assignment Alerts", d: "Notify when assignments are generated or updated." },
          ].map((row) => (
            <div key={row.k} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
              <div>
                <p className="text-sm font-semibold">{row.t}</p>
                <p className="text-xs text-muted-foreground">{row.d}</p>
              </div>
              <Switch
                checked={s[row.k]}
                onCheckedChange={(v) => setS({ ...s, [row.k]: v })}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="rounded-2xl shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-4 w-4 text-primary" /> Optimization
            </CardTitle>
            <CardDescription>Default mode for new assignments.</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={s.optimization}
              onValueChange={(v) => setS({ ...s, optimization: v as typeof s.optimization })}
              className="space-y-2"
            >
              {[
                { v: "cost", label: "Cost Minimization", d: "Minimize total assignment cost." },
                { v: "profit", label: "Profit Maximization", d: "Maximize total profit/value." },
              ].map((o) => {
                const active = s.optimization === o.v;
                return (
                  <Label
                    key={o.v}
                    htmlFor={`opt-${o.v}`}
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition-all",
                      active ? "border-primary bg-primary/5" : "border-border hover:border-primary/40",
                    )}
                  >
                    <RadioGroupItem value={o.v} id={`opt-${o.v}`} className="mt-1" />
                    <div>
                      <p className="text-sm font-semibold">{o.label}</p>
                      <p className="text-xs text-muted-foreground">{o.d}</p>
                    </div>
                  </Label>
                );
              })}
            </RadioGroup>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Globe className="h-4 w-4 text-primary" /> Language
            </CardTitle>
            <CardDescription>Choose your preferred language.</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={s.language} onValueChange={(v) => setS({ ...s, language: v })}>
              <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
