"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, AlertTriangle, ShieldAlert, Copy, Check } from "lucide-react";
import type { VerifyLinkResponse } from "@/types/verification";
import ThreatList from "./ThreatList";

interface VerdictCardProps {
  response: VerifyLinkResponse;
  submittedUrl?: string;
}

const CONFIG = {
  safe: {
    label: "Appears Safe",
    icon: ShieldCheck,
    accent: "text-safe",
    border: "border-safe/40",
    bg: "bg-safe/10",
    ring: "ring-safe/20",
    message:
      "No relevant threats were reported by the available analysis. This does not guarantee the URL is completely harmless.",
  },
  warning: {
    label: "Suspicious Activity Detected",
    icon: AlertTriangle,
    accent: "text-warning",
    border: "border-warning/40",
    bg: "bg-warning/10",
    ring: "ring-warning/20",
    message: "Review the detected indicators carefully before proceeding.",
  },
  critical: {
    label: "High-Risk Threat Detected",
    icon: ShieldAlert,
    accent: "text-critical",
    border: "border-critical/40",
    bg: "bg-critical/10",
    ring: "ring-critical/20",
    message: "Avoid this link until it has been independently verified.",
  },
} as const;

export default function VerdictCard({ response, submittedUrl }: VerdictCardProps) {
  const [copied, setCopied] = useState(false);
  const config = CONFIG[response.status];
  const Icon = config.icon;

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(id);
  }, [copied]);

  const handleCopy = async () => {
    const text = `URL: ${response.target_url}\nDomain: ${response.analyzed_domain}\nStatus: ${config.label}\nAnalysis: ${response.ai_analysis || "No analysis text provided."}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <article
      className={`rounded-2xl border ${config.border} ${config.bg} p-6 shadow-lg ring-1 ${config.ring}`}
      aria-labelledby="verdict-heading"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${config.border} bg-background/60 ${config.accent}`}>
            <Icon className="h-6 w-6" aria-hidden="true" />
          </span>
          <div>
            <h2 id="verdict-heading" className={`text-xl font-bold ${config.accent}`}>
              {config.label}
            </h2>
            <p className="mt-1 text-sm text-foreground/80">{config.message}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-2 self-start rounded-lg border border-border bg-background/60 px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          aria-live="polite"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-safe" aria-hidden="true" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" aria-hidden="true" />
              Copy details
            </>
          )}
        </button>
      </div>

      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
        <div className="rounded-lg border border-border/60 bg-background/40 p-3">
          <dt className="text-xs font-medium uppercase tracking-wide text-muted">Analyzed URL</dt>
          <dd className="mt-1 break-all font-mono text-xs text-foreground">{response.target_url}</dd>
        </div>
        <div className="rounded-lg border border-border/60 bg-background/40 p-3">
          <dt className="text-xs font-medium uppercase tracking-wide text-muted">Analyzed domain</dt>
          <dd className="mt-1 break-all font-mono text-xs text-foreground">{response.analyzed_domain}</dd>
        </div>
      </dl>

      {/* Trust Score Display */}
      <div className={`mt-4 rounded-xl border p-4 ${config.border} bg-background/40`}>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-muted">Trust Score</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className={`text-3xl font-extrabold ${config.accent}`}>
                {response.trust_score !== undefined ? response.trust_score : "—"}
              </span>
              <span className="text-sm text-muted">/ 100</span>
            </div>
          </div>
          <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${config.border} ${config.bg} ${config.accent}`}>
            {config.label}
          </span>
        </div>
        {response.trust_score !== undefined ? (
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-border/60">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                response.status === "safe"
                  ? "bg-safe"
                  : response.status === "warning"
                  ? "bg-warning"
                  : "bg-critical"
              }`}
              style={{ width: `${Math.min(100, Math.max(0, response.trust_score))}%` }}
            />
          </div>
        ) : null}
      </div>

      {submittedUrl && submittedUrl !== response.target_url ? (
        <p className="mt-3 text-xs text-muted">
          Submitted URL differed from the analyzed URL returned by the service.
        </p>
      ) : null}

      {/* AI Analysis below the score */}
      <div className="mt-5 rounded-xl border border-border/60 bg-background/40 p-4">
        <h3 className="text-sm font-semibold text-foreground">AI Analysis</h3>
        <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-foreground/90">
          {response.ai_analysis && response.ai_analysis.trim().length > 0
            ? response.ai_analysis
            : "No analysis text was provided by the service."}
        </p>
      </div>

      <div className="mt-5">
        <h3 className="text-sm font-semibold text-foreground">Threat indicators</h3>
        <div className="mt-2">
          <ThreatList items={response.threat_flags} status={response.status} />
        </div>
      </div>
    </article>
  );
}
