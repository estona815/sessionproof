import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

// A per-request CSP nonce cannot be attached to statically cached HTML.
// Force dynamic rendering so Next.js propagates the nonce set in src/proxy.ts.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "SESSIONPROOF — Confirm the credits before the release",
    template: "%s — SESSIONPROOF",
  },
  description:
    "Evidence-linked music credit operations for independent creators and small release teams.",
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html data-scroll-behavior="smooth" lang="en">
      <body>{children}</body>
    </html>
  );
}
