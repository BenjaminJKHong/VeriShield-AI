import { Link2, Search, ShieldCheck } from "lucide-react";

const STEPS = [
  {
    icon: Link2,
    title: "Submit a URL",
    description: "Paste the link you want to check. Only structurally valid http:// and https:// URLs are accepted.",
  },
  {
    icon: Search,
    title: "Analyze available security signals",
    description: "The backend evaluates available threat and reputation signals. Actual checks depend on configured integrations.",
  },
  {
    icon: ShieldCheck,
    title: "Review the security assessment",
    description: "Read the verdict, AI explanation, and threat indicators, then decide how to proceed with caution.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-border/60 bg-surface/40 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">How it works</p>
          <h2 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">Three steps to a clearer decision</h2>
          <p className="mt-3 text-sm text-muted sm:text-base">
            VeriShield AI helps you inspect links before you click. The depth of each check depends on the
            integrations enabled by the operator.
          </p>
        </div>
        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <li key={step.title} className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/15 text-accent">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="text-xs font-semibold text-muted">Step {index + 1}</span>
                </div>
                <h3 className="mt-4 text-base font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.description}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
