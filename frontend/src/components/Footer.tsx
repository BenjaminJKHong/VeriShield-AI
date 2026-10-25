import { ShieldCheck } from "lucide-react";

const YEAR = new Date().getFullYear();

const LINKS = [
  { href: "#home", label: "Home" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#security", label: "Security" },
  { href: "#analyzer", label: "Analyze a Link" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-accent" aria-hidden="true" />
              <span className="text-sm font-semibold text-foreground">VeriShield AI</span>
            </div>
            <p className="mt-2 text-sm text-muted">
              AI-powered security intelligence for safer digital decisions.
            </p>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-muted transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
        <p className="mt-8 text-xs text-muted">
          Security disclaimer: Analysis results are informational and depend on available backend integrations.
          A safe result does not guarantee a link is harmless. Verify independently before trusting any link.
        </p>
        <p className="mt-4 text-xs text-muted">© {YEAR} VeriShield AI. All rights reserved.</p>
      </div>
    </footer>
  );
}
