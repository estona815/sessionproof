"use client";

import { Check, LoaderCircle } from "lucide-react";
import { type FormEvent, useState } from "react";

export function PilotForm() {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus(null);
    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      role: String(form.get("role") ?? ""),
      projectSummary: String(form.get("projectSummary") ?? ""),
      retentionDays: Number(form.get("retentionDays")),
      processingConsent: form.get("processingConsent") === "on",
      disclaimerAccepted: form.get("disclaimerAccepted") === "on",
    };
    try {
      const response = await fetch("/api/pilot/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-sessionproof-request": "1" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { saved?: boolean; message?: string; error?: string };
      if (!response.ok) throw new Error(data.error ?? "The application could not be validated.");
      setStatus(
        data.saved
          ? "Application received in the private pilot queue."
          : (data.message ?? "Application preview complete. No data was retained."),
      );
      if (data.saved) event.currentTarget.reset();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Submission failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="pilot-form" onSubmit={submit}>
      <label>
        Name
        <input autoComplete="name" maxLength={100} name="name" required />
      </label>
      <label>
        Email
        <input autoComplete="email" maxLength={254} name="email" required type="email" />
      </label>
      <label>
        Your role
        <select defaultValue="" name="role" required>
          <option disabled value="">
            Select one
          </option>
          <option value="artist">Artist</option>
          <option value="producer">Producer</option>
          <option value="writer">Songwriter</option>
          <option value="engineer">Engineer</option>
          <option value="manager">Manager</option>
          <option value="label">Small label</option>
          <option value="other">Other</option>
        </select>
      </label>
      <label>
        What needs review?
        <textarea
          maxLength={1500}
          minLength={20}
          name="projectSummary"
          placeholder="Describe the release, source types, contributor count, and unresolved credit question. Do not paste private source text here."
          required
          rows={6}
        />
      </label>
      <label>
        Requested retention
        <select defaultValue="30" name="retentionDays">
          <option value="7">7 days</option>
          <option value="30">30 days</option>
          <option value="90">90 days</option>
        </select>
      </label>
      <label className="check-label">
        <input name="processingConsent" required type="checkbox" />
        <span>
          I consent to processing the materials I intentionally submit for this release review and
          confirm I am authorized to provide them.
        </span>
      </label>
      <label className="check-label">
        <input name="disclaimerAccepted" required type="checkbox" />
        <span>
          I understand that SESSIONPROOF organizes records and does not determine ownership, provide
          legal advice, or clear samples.
        </span>
      </label>
      <button className="button primary" disabled={loading} type="submit">
        {loading ? <LoaderCircle className="spin" size={16} /> : <Check size={16} />}
        Validate pilot application
      </button>
      {status ? (
        <p className="form-status" aria-live="polite">
          {status}
        </p>
      ) : null}
    </form>
  );
}
