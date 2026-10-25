"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import SearchForm from "@/components/SearchForm";
import LoadingState from "@/components/LoadingState";
import VerdictCard from "@/components/VerdictCard";
import HowItWorks from "@/components/HowItWorks";
import SecurityPrinciples from "@/components/SecurityPrinciples";
import PrivacyNotice from "@/components/PrivacyNotice";
import Footer from "@/components/Footer";
import { analyzeUrl, isApiConfigured, isMockModeEnabled, VerificationError } from "@/services/verification";
import { MOCK_RESPONSES } from "@/services/mockVerification";
import type { VerifyLinkResponse, VerdictStatus } from "@/types/verification";

const MOCK_STATUSES: VerdictStatus[] = ["safe", "warning", "critical"];

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<VerifyLinkResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submittedUrl, setSubmittedUrl] = useState<string | null>(null);
  const [mockStatus, setMockStatus] = useState<VerdictStatus>("safe");

  const latestRequestRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);

  const mockMode = isMockModeEnabled();
  const isDev = process.env.NODE_ENV !== "production";

  const runAnalysis = useCallback(
    async (url: string) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const requestId = ++latestRequestRef.current;
      setIsLoading(true);
      setError(null);
      setResult(null);
      setSubmittedUrl(url);

      try {
        let response: VerifyLinkResponse;
        if (mockMode) {
          await new Promise((resolve) => setTimeout(resolve, 900));
          if (controller.signal.aborted) return;
          response = MOCK_RESPONSES[mockStatus];
        } else {
          response = await analyzeUrl(url, controller.signal);
        }
        if (requestId !== latestRequestRef.current) return;
        if (controller.signal.aborted) return;
        setResult(response);
      } catch (e) {
        if (requestId !== latestRequestRef.current) return;
        if (controller.signal.aborted) return;
        const message =
          e instanceof VerificationError
            ? e.message
            : "An unexpected error occurred while analyzing the URL.";
        setError(message);
      } finally {
        if (requestId === latestRequestRef.current) {
          setIsLoading(false);
        }
      }
    },
    [mockMode, mockStatus],
  );

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const handleRetry = () => {
    if (submittedUrl) runAnalysis(submittedUrl);
  };

  return (
    <div id="home" className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.12),transparent_60%)]" />
          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                  INTELLIGENT LINK PROTECTION
                </span>
                <h1 className="mt-5 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                  Check Before You Trust.
                </h1>
                <p className="mt-4 text-lg text-muted sm:text-xl">
                  Analyze suspicious links with AI-powered security intelligence before you click.
                </p>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
                  VeriShield AI inspects a submitted URL and returns a verdict, an AI-assisted explanation, and
                  the threat indicators reported by the analysis service. Client-side validation only checks
                  structure; it is not a security verdict.
                </p>
              </div>

              <div
                id="analyzer"
                className="rounded-2xl border border-border bg-card p-6 shadow-xl sm:p-8"
              >
                <div className="mb-5">
                  <h2 className="text-lg font-semibold text-foreground">Analyze a link</h2>
                  <p className="mt-1 text-sm text-muted">
                    Paste a URL to receive a security assessment.
                  </p>
                </div>

                {mockMode ? (
                  <div className="mb-4 rounded-lg border border-warning/40 bg-warning/10 px-3 py-2 text-xs text-warning">
                    Demonstration mode is enabled. Results are labeled mock data and are not real security assessments.
                  </div>
                ) : null}

                {!mockMode && !isApiConfigured() ? (
                  <div className="mb-4 rounded-lg border border-critical/40 bg-critical/10 px-3 py-2 text-xs text-critical">
                    The analysis service is not configured. Set NEXT_PUBLIC_API_URL to enable real analysis.
                  </div>
                ) : null}

                {isDev && mockMode ? (
                  <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-muted">Preview verdict:</span>
                    {MOCK_STATUSES.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setMockStatus(s)}
                        className={`rounded-md border px-2.5 py-1 font-medium transition-colors ${
                          mockStatus === s
                            ? "border-accent bg-accent/20 text-accent"
                            : "border-border text-muted hover:text-foreground"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                ) : null}

                <SearchForm onSubmit={runAnalysis} isLoading={isLoading} />

                <div className="mt-6" aria-live="polite">
                  {isLoading ? <LoadingState /> : null}
                  {!isLoading && result ? <VerdictCard response={result} submittedUrl={submittedUrl ?? undefined} /> : null}
                  {!isLoading && error ? (
                    <div
                      role="alert"
                      className="rounded-2xl border border-critical/40 bg-critical/10 p-5"
                    >
                      <p className="text-sm font-semibold text-critical">Analysis failed</p>
                      <p className="mt-1 text-sm text-foreground/90">{error}</p>
                      <button
                        type="button"
                        onClick={handleRetry}
                        disabled={!submittedUrl}
                        className="mt-3 inline-flex items-center gap-2 rounded-lg border border-border bg-background/60 px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Retry
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </section>

        <HowItWorks />
        <SecurityPrinciples />
        <PrivacyNotice />
      </main>
      <Footer />
    </div>
  );
}
