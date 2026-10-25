export type UrlValidationResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

const SCHEME_PATTERN = /^[a-zA-Z][a-zA-Z0-9+.-]*:/;

export function validateAndNormalizeUrl(raw: string): UrlValidationResult {
  const trimmed = raw.trim();

  if (trimmed.length === 0) {
    return { ok: false, error: "Please enter a URL to analyze." };
  }

  if (/\s/.test(trimmed)) {
    return { ok: false, error: "URLs cannot contain spaces." };
  }

  let candidate = trimmed;
  if (!SCHEME_PATTERN.test(trimmed)) {
    candidate = `https://${trimmed}`;
  }

  let parsed: URL;
  try {
    parsed = new URL(candidate);
  } catch {
    return { ok: false, error: "Please enter a valid URL." };
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { ok: false, error: "Only http:// and https:// URLs are supported." };
  }

  if (!parsed.hostname || parsed.hostname.length === 0) {
    return { ok: false, error: "Please enter a valid URL with a host name." };
  }

  return { ok: true, url: parsed.href };
}
