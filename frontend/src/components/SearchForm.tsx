"use client";

import { useState } from "react";
import { Link2, ArrowRight, Loader2 } from "lucide-react";
import { validateAndNormalizeUrl } from "@/lib/validateUrl";

interface SearchFormProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export default function SearchForm({ onSubmit, isLoading }: SearchFormProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoading) return;
    const result = validateAndNormalizeUrl(value);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError(null);
    onSubmit(result.url);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full" noValidate>
      <label htmlFor="url-input" className="mb-2 block text-sm font-medium text-foreground">
        URL to analyze
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted">
            <Link2 className="h-4 w-4" aria-hidden="true" />
          </span>
          <input
            id="url-input"
            name="url"
            type="url"
            inputMode="url"
            autoComplete="off"
            spellCheck={false}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (error) setError(null);
            }}
            placeholder="https://example.com"
            disabled={isLoading}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? "url-error" : "url-help"}
            className="h-12 w-full rounded-lg border border-border bg-surface pl-10 pr-4 text-sm text-foreground placeholder:text-muted/70 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-accent px-5 text-sm font-semibold text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Analyzing URL...
            </>
          ) : (
            <>
              Analyze Link
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </button>
      </div>
      <p id="url-help" className="mt-2 text-xs text-muted">
        Enter an http:// or https:// URL. A bare domain will be treated as https://.
      </p>
      {error ? (
        <p id="url-error" role="alert" className="mt-2 text-sm text-critical">
          {error}
        </p>
      ) : null}
    </form>
  );
}
