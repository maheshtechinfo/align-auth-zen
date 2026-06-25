import { Link } from "@tanstack/react-router";
import { CheckCircle2, Sparkles, Users2 } from "lucide-react";
import type { ReactNode } from "react";

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Brand panel */}
        <aside className="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between lg:p-12 bg-primary text-primary-foreground">
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.18), transparent 45%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.12), transparent 50%)",
            }}
          />
          <Link to="/" className="relative z-10 flex items-center gap-2 text-lg font-semibold tracking-tight">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
              <Sparkles className="h-5 w-5" />
            </div>
            Task Align
          </Link>

          <div className="relative z-10 space-y-6">
            <h2 className="text-4xl font-semibold leading-tight tracking-tight">
              Align your team.<br />Assign with clarity.
            </h2>
            <p className="max-w-md text-base text-white/80">
              The modern resource assignment system trusted by enterprise teams to
              plan, track and ship work — without the spreadsheet chaos.
            </p>
            <ul className="space-y-3 text-sm text-white/90">
              {[
                "Real-time resource allocation",
                "Skill-based smart matching",
                "Cross-project visibility",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" /> {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative z-10 flex items-center gap-3 text-sm text-white/80">
            <Users2 className="h-4 w-4" />
            Trusted by 4,000+ teams worldwide
          </div>
        </aside>

        {/* Form panel */}
        <main className="flex flex-col items-center justify-center px-6 py-12 sm:px-12">
          <div className="w-full max-w-md">
            <Link to="/" className="mb-8 flex items-center gap-2 text-base font-semibold lg:hidden">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Sparkles className="h-4 w-4" />
              </div>
              Task Align
            </Link>

            <div className="mb-8">
              <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
              {subtitle && (
                <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
              )}
            </div>

            {children}

            {footer && <div className="mt-8 text-center text-sm text-muted-foreground">{footer}</div>}
          </div>
        </main>
      </div>
    </div>
  );
}
