import type { VerifyLinkResponse, VerdictStatus } from "@/types/verification";

const VERDICT_STATUSES: readonly VerdictStatus[] = ["safe", "warning", "critical"];

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api")
  .trim()
  .replace(/\/+$/, "");

const VERIFY_ENDPOINT_PATH = (process.env.NEXT_PUBLIC_API_PATH ?? "/verify-link").trim();

const REQUEST_TIMEOUT_MS = 15000;

export class VerificationError extends Error {
  kind: "network" | "timeout" | "server" | "malformed" | "config" | "cancelled";
  status?: number;
  constructor(
    message: string,
    kind: "network" | "timeout" | "server" | "malformed" | "config" | "cancelled",
    status?: number,
  ) {
    super(message);
    this.name = "VerificationError";
    this.kind = kind;
    this.status = status;
  }
}

export function isApiConfigured(): boolean {
  return API_BASE_URL.length > 0;
}

export function isMockModeEnabled(): boolean {
  return process.env.NODE_ENV !== "production" && process.env.NEXT_PUBLIC_MOCK_MODE === "true";
}

export async function analyzeUrl(url: string, signal?: AbortSignal): Promise<VerifyLinkResponse> {
  if (!isApiConfigured()) {
    throw new VerificationError(
      "The analysis service is not configured. Set NEXT_PUBLIC_API_URL to the backend endpoint base URL.",
      "config",
    );
  }

  const endpoint = `${API_BASE_URL}${VERIFY_ENDPOINT_PATH.startsWith("/") ? VERIFY_ENDPOINT_PATH : `/${VERIFY_ENDPOINT_PATH}`}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort("timeout"), REQUEST_TIMEOUT_MS);

  const abortHandler = () => controller.abort("cancelled");
  if (signal) {
    if (signal.aborted) controller.abort("cancelled");
    else signal.addEventListener("abort", abortHandler, { once: true });
  }

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ url }),
      signal: controller.signal,
    });
  } catch {
    clearTimeout(timeoutId);
    if (signal) signal.removeEventListener("abort", abortHandler);
    if (controller.signal.aborted) {
      const reason = controller.signal.reason;
      if (reason === "timeout") {
        throw new VerificationError("The analysis request timed out. Please try again.", "timeout");
      }
      throw new VerificationError("The analysis request was cancelled.", "cancelled");
    }
    throw new VerificationError(
      "Unable to reach the analysis service. Check your connection and try again.",
      "network",
    );
  }

  clearTimeout(timeoutId);
  if (signal) signal.removeEventListener("abort", abortHandler);

  if (!response.ok) {
    throw new VerificationError(
      `The analysis service returned an error (HTTP ${response.status}).`,
      "server",
      response.status,
    );
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new VerificationError("The analysis service returned an invalid response.", "malformed");
  }

  return parseVerificationResponse(data);
}

export function parseVerificationResponse(data: unknown): VerifyLinkResponse {
  if (typeof data !== "object" || data === null) {
    throw new VerificationError("The analysis response is malformed.", "malformed");
  }
  const obj = data as Record<string, unknown>;

  if (typeof obj.target_url !== "string" || obj.target_url.length === 0) {
    throw new VerificationError("The analysis response is missing a valid target URL.", "malformed");
  }
  if (typeof obj.analyzed_domain !== "string" || obj.analyzed_domain.length === 0) {
    throw new VerificationError("The analysis response is missing a valid analyzed domain.", "malformed");
  }
  if (typeof obj.status !== "string" || !VERDICT_STATUSES.includes(obj.status as VerdictStatus)) {
    throw new VerificationError("The analysis response contains an unsupported status.", "malformed");
  }
  if (!Array.isArray(obj.threat_flags) || !obj.threat_flags.every((x) => typeof x === "string")) {
    throw new VerificationError("The analysis response contains invalid threat indicators.", "malformed");
  }
  const aiAnalysis = typeof obj.ai_analysis === "string" ? obj.ai_analysis : "";

  const trustScore = typeof obj.trust_score === "number" ? obj.trust_score : undefined;

  return {
    target_url: obj.target_url,
    analyzed_domain: obj.analyzed_domain,
    trust_score: trustScore,
    status: obj.status as VerdictStatus,
    threat_flags: obj.threat_flags as string[],
    ai_analysis: aiAnalysis,
  };
}
