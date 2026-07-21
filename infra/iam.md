# IAM plan

Create `sessionproof-runtime@PROJECT_ID.iam.gserviceaccount.com`. Grant only:

- `roles/run.invoker` where needed for runtime-to-runtime access
- `roles/aiplatform.user`
- `roles/datastore.user`
- `roles/storage.objectUser` on the single private project bucket
- `roles/secretmanager.secretAccessor` on named secrets only
- `roles/logging.logWriter`

Do not grant Owner, Editor, Storage Admin, or project-wide Secret Manager Admin. Keep human deployer and runtime identities separate. Verify effective IAM with policy troubleshooting before production.
