#!/usr/bin/env bash
set -euo pipefail

: "${GOOGLE_CLOUD_PROJECT:?Set GOOGLE_CLOUD_PROJECT}"
: "${SESSIONPROOF_REGION:=us-central1}"
: "${GEMINI_MODEL:?Set GEMINI_MODEL after checking the current official model catalog}"

gcloud builds submit --project "$GOOGLE_CLOUD_PROJECT" --region "$SESSIONPROOF_REGION" --config cloudbuild.yaml .
SERVICE_URL="$(gcloud run services describe sessionproof --project "$GOOGLE_CLOUD_PROJECT" --region "$SESSIONPROOF_REGION" --format='value(status.url)')"
gcloud run services update sessionproof --project "$GOOGLE_CLOUD_PROJECT" --region "$SESSIONPROOF_REGION" --set-env-vars "GEMINI_MODEL=$GEMINI_MODEL,APP_ORIGIN=$SERVICE_URL"
printf '%s\n' "$SERVICE_URL"

