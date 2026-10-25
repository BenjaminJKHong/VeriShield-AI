import { Info } from "lucide-react";

export default function PrivacyNotice() {
  return (
    <section className="border-t border-border/60 bg-surface/30 py-12 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-start gap-3">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
            <div>
              <h2 className="text-base font-semibold text-foreground">Privacy notice</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                URLs submitted for analysis may be processed by the service. Avoid submitting private,
                confidential, or sensitive links. This frontend does not store submitted URLs locally.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
