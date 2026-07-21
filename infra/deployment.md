# Cloud Run deployment

Prerequisites: authenticated `gcloud`, eligible billed project, Artifact Registry repository `sessionproof`, enabled Run/Build/Artifact Registry/Vertex AI/Firestore/Storage/Secret Manager APIs, private bucket, runtime service account, budget alerts.

```bash
export SESSIONPROOF_PROJECT="your-project-id"
export SESSIONPROOF_REGION="us-central1"
gcloud config set project "$SESSIONPROOF_PROJECT"
gcloud builds submit --config cloudbuild.yaml --region "$SESSIONPROOF_REGION" .
```

After deployment, set an explicit current structured-output model:

```bash
gcloud run services update sessionproof \
  --region "$SESSIONPROOF_REGION" \
  --set-env-vars "GEMINI_MODEL=RECHECK_CURRENT_STABLE_MODEL,APP_ORIGIN=https://YOUR_SERVICE_URL"
```

Apply Firestore indexes and bucket lifecycle/CORS separately. Never place credentials in build arguments or committed env files.

Verification: HTTPS, `/api/health`, `/api/readiness`, no-login demo, upload allowlist, live Gemini extraction, Firestore, Storage signed URL/delete, confirmation isolation, PDF, mobile/incognito, response CSP/security headers, cold start, rate limits, and deletion. Capture redacted evidence.

Rollback:

```bash
gcloud run revisions list --service sessionproof --region "$SESSIONPROOF_REGION"
gcloud run services update-traffic sessionproof --region "$SESSIONPROOF_REGION" --to-revisions PREVIOUS_REVISION=100
```

No production deployment has been performed from this repository.
