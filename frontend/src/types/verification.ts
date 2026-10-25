export type VerdictStatus = "safe" | "warning" | "critical";

export interface VerifyLinkResponse {
  target_url: string;
  analyzed_domain: string;
  status: VerdictStatus;
  threat_flags: string[];
  ai_analysis: string;
}

export interface AnalysisError {
  message: string;
  kind: "validation" | "network" | "timeout" | "server" | "malformed" | "config" | "cancelled";
}

export const VERDICT_STATUSES: readonly VerdictStatus[] = ["safe", "warning", "critical"];
