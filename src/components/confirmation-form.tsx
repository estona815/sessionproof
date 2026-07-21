"use client";

import { type FormEvent, useState } from "react";

export function ConfirmationForm() {
  const [status, setStatus] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/demo/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-sessionproof-request": "1" },
        body: JSON.stringify({
          contributorId: "contrib_lena",
          action: String(form.get("action") ?? "CONFIRM"),
        }),
      });
      const data = (await response.json()) as { message?: string; error?: string };
      if (!response.ok) throw new Error(data.error ?? "Response failed");
      setStatus(data.message ?? "Fixture response recorded.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Response failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="confirmation-form" onSubmit={submit}>
      <fieldset>
        <legend>Your response</legend>
        <label>
          <input defaultChecked name="action" type="radio" value="CONFIRM" /> Confirm
        </label>
        <label>
          <input name="action" type="radio" value="DISPUTE" /> Dispute
        </label>
        <label>
          <input name="action" type="radio" value="PROPOSE_CORRECTION" /> Propose correction
        </label>
      </fieldset>
      <button className="button primary" disabled={pending} type="submit">
        Record fixture acknowledgement
      </button>
      {status ? (
        <p className="form-status" aria-live="polite">
          {status}
        </p>
      ) : null}
    </form>
  );
}
