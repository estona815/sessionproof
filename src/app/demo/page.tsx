import type { Metadata } from "next";
import Link from "next/link";

import { GuidedDemo } from "@/components/guided-demo";
import { Brand } from "@/components/site-header";

export const metadata: Metadata = { title: "Guided Demo" };

export default function DemoPage() {
  return (
    <main className="demo-page">
      <div className="demo-brandbar">
        <Brand />
        <p>Fictional data · deterministic fixture · no account required</p>
        <Link href="/trust">Trust & limitations</Link>
      </div>
      <GuidedDemo />
    </main>
  );
}
