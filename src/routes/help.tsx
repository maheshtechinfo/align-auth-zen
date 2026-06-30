import { createFileRoute } from "@tanstack/react-router";
import {
  BookOpen,
  HelpCircle,
  Mail,
  Phone,
  ChevronRight,
  LifeBuoy,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/help")({
  component: HelpPage,
});

const helpCards = [
  { title: "Documentation", desc: "Read the complete user guide.", icon: BookOpen, gradient: "from-violet-500 to-fuchsia-500", cta: "Read User Guide" },
  { title: "FAQs", desc: "Frequently asked questions.", icon: HelpCircle, gradient: "from-indigo-500 to-purple-500", cta: "Browse FAQs" },
];

const quickHelp = [
  { q: "How to Create an Assignment", a: "Click Create Assignment from the sidebar, pick a type, fill basic details, add resources & tasks, enter the matrix, and review." },
  { q: "How to Upload Matrix", a: "Open Step 3 (Resources & Tasks), switch to the Bulk Upload tab, and drag your Excel file. We validate rows and show a sample preview." },
  { q: "How the Hungarian Algorithm Works", a: "Task Align performs row and column reduction, then finds the minimum-cost (or maximum-profit) one-to-one assignment between resources and tasks." },
  { q: "How to Generate Reports", a: "After optimization, click Export from the Result screen to download a PDF or Excel report. All reports appear in Report History." },
];

function HelpPage() {
  return (
    <DashboardShell>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Help & Guide</h1>
        <p className="text-sm text-muted-foreground">
          Everything you need to get the most out of Task Align.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {helpCards.map((c) => (
          <Card key={c.title} className="group overflow-hidden rounded-2xl border-0 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-elevated">
            <div className={`h-1 w-full bg-gradient-to-r ${c.gradient}`} />
            <CardContent className="p-6">
              <span className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${c.gradient} text-white shadow-glow`}>
                <c.icon className="h-6 w-6" />
              </span>
              <p className="text-base font-semibold">{c.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
              <Button variant="ghost" className="mt-4 h-9 rounded-lg px-2 text-sm text-primary hover:text-primary">
                {c.cta} <ChevronRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="rounded-2xl shadow-soft lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Quick Help</CardTitle>
            <CardDescription>Answers to the most common questions.</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {quickHelp.map((h, i) => (
                <AccordionItem key={h.q} value={`q-${i}`}>
                  <AccordionTrigger className="text-left text-sm font-semibold">
                    {h.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    {h.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Contact Support</CardTitle>
            <CardDescription>We typically respond within 24 hours.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <a
              href="mailto:support@taskalign.com"
              className="flex items-center gap-3 rounded-xl border border-border p-3 transition-colors hover:bg-muted/50"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Mail className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-semibold">support@taskalign.com</p>
              </div>
            </a>
            <a
              href="tel:+919876543210"
              className="flex items-center gap-3 rounded-xl border border-border p-3 transition-colors hover:bg-muted/50"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Phone className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="text-sm font-semibold">+91-98765 43210</p>
              </div>
            </a>
            <Button className="w-full rounded-xl">
              <LifeBuoy className="h-4 w-4" /> Open a ticket
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
