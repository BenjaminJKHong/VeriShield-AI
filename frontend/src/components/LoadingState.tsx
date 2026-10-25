"use client";

import { Radar } from "lucide-react";

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message }: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="rounded-2xl border border-border bg-card p-6"
    >
      <div className="flex items-center gap-4">
        <div className="relative h-12 w-12 shrink-0">
          <div className="absolute inset-0 rounded-full border border-accent/30" />
          <div className="absolute inset-1 rounded-full border-2 border-accent/20 border-t-accent animate-spin motion-reduce:animate-none" />
          <div className="absolute inset-0 flex items-center justify-center text-accent">
            <Radar className="h-5 w-5 animate-pulse motion-reduce:animate-none" aria-hidden="true" />
          </div>
        </div>
        <div>
          <p className="text-base font-semibold text-foreground">Analyzing URL...</p>
          <p className="mt-1 text-sm text-muted">
            {message ?? "Checking the analysis service and waiting for the security assessment."}
          </p>
        </div>
      </div>
      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-surface">
        <div className="h-full w-1/3 animate-[scan_1.6s_ease-in-out_infinite] motion-reduce:animate-none rounded-full bg-accent/70" />
      </div>
    </div>
  );
}
