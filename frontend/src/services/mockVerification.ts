import type { VerifyLinkResponse } from "@/types/verification";

export const MOCK_SAFE: VerifyLinkResponse = {
  target_url: "https://example.com/welcome",
  analyzed_domain: "example.com",
  status: "safe",
  threat_flags: [],
  ai_analysis:
    "No relevant threat indicators were returned by the available analysis for this URL. This is a demonstration result only.",
};

export const MOCK_WARNING: VerifyLinkResponse = {
  target_url: "https://login-example-security-check.example.net/account",
  analyzed_domain: "login-example-security-check.example.net",
  status: "warning",
  threat_flags: [
    "Domain recently registered",
    "URL contains keywords commonly associated with credential harvesting",
    "Redirect chain includes an untrusted intermediate host",
  ],
  ai_analysis:
    "Several indicators commonly associated with suspicious activity were reported. Review the listed indicators carefully before proceeding. This is a demonstration result only.",
};

export const MOCK_CRITICAL: VerifyLinkResponse = {
  target_url: "https://secure-bank-verification.example.invalid/login",
  analyzed_domain: "secure-bank-verification.example.invalid",
  status: "critical",
  threat_flags: [
    "Known phishing pattern detected in URL structure",
    "Domain impersonates a financial institution",
    "TLS certificate anomalies reported",
    "Multiple suspicious redirects detected",
  ],
  ai_analysis:
    "Multiple high-risk indicators were reported. Avoid visiting this link until it has been independently verified. This is a demonstration result only.",
};

export const MOCK_RESPONSES: Record<string, VerifyLinkResponse> = {
  safe: MOCK_SAFE,
  warning: MOCK_WARNING,
  critical: MOCK_CRITICAL,
};
