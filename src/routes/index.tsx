import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Task Align — Resource Assignment System" },
      { name: "description", content: "Align your team and assign resources with clarity." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-2xl rounded-3xl border border-border bg-card p-10 text-center shadow-elevated">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-glow">
          <Sparkles className="h-7 w-7" />
        </div>
        <h1 className="text-4xl font-semibold tracking-tight">Task Align</h1>
        <p className="mt-3 text-base text-muted-foreground">
          The modern resource assignment system for high-performing teams.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild className="h-11 rounded-xl px-6 font-semibold shadow-glow">
            <Link to="/login">
              Log in <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-11 rounded-xl px-6 font-semibold">
            <Link to="/register">Create account</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
