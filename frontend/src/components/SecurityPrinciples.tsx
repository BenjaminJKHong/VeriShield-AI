import { ListChecks, Sparkles, MessageSquareWarning } from "lucide-react";

const PRINCIPLES = [
  {
    icon: ShieldIcon,
    title: "Security-focused analysis",
    description: "Verdicts are based on signals returned by the analysis service, not on client-side assumptions.",
  },
  {
    icon: ListChecks,
    title: "Transparent threat indicators",
    description: "Detected indicators are shown as returned, without relabeling or embellishment.",
  },
  {
    icon: Sparkles,
    title: "AI-assisted explanations",
    description: "AI text helps interpret results, but it is treated as untrusted and displayed as plain text.",
  },
  {
    icon: MessageSquareWarning,
    title: "Clear communication of uncertainty",
    description: "A safe result is never presented as a guarantee. Users are encouraged to verify independently.",
  },
];

function ShieldIcon(props: { className?: string }) {
  return <svg className={props.className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
}

export default function SecurityPrinciples() {
  return (
    <section id="security" className="border-t border-border/60 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">Security principles</p>
          <h2 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">Built to be cautious and clear</h2>
          <p className="mt-3 text-sm text-muted sm:text-base">
            The interface favors transparency over confidence. It does not claim certifications, compliance, or
            integrations that have not been verified.
          </p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {PRINCIPLES.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.title} className="rounded-2xl border border-border bg-card p-6">
                <Icon className="h-6 w-6 text-accent" />
                <h3 className="mt-3 text-base font-semibold text-foreground">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{p.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
