import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function Brand() {
  return (
    <Link className="brand" href="/" aria-label="SESSIONPROOF home">
      <span className="brand-mark" aria-hidden="true">
        S
      </span>
      SESSIONPROOF
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="site-header">
      <Brand />
      <nav aria-label="Primary navigation">
        <Link href="/#how-it-works">How it works</Link>
        <Link href="/pricing">Pricing</Link>
        <Link href="/trust">Trust</Link>
        <Link className="nav-action" href="/demo">
          Guided demo <ArrowRight aria-hidden="true" size={15} />
        </Link>
      </nav>
    </header>
  );
}
