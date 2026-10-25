import { AlertTriangle } from "lucide-react";
import type { VerdictStatus } from "@/types/verification";

interface ThreatListProps {
  items: string[];
  status: VerdictStatus;
}

const statusStyles: Record<VerdictStatus, string> = {
  safe: "border-safe/30 bg-safe/5 text-safe",
  warning: "border-warning/30 bg-warning/5 text-warning",
  critical: "border-critical/30 bg-critical/5 text-critical",
};

export default function ThreatList({ items, status }: ThreatListProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-surface/60 p-4 text-sm text-muted">
        No threat indicators were returned by the analysis service.
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li
          key={`${index}-${item}`}
          className={`flex items-start gap-3 rounded-lg border px-3 py-2 text-sm ${statusStyles[status]}`}
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="break-words text-foreground/90">{item}</span>
        </li>
      ))}
    </ul>
  );
}
