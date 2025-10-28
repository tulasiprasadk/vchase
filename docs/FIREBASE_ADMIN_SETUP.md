# Firebase Admin Setup (server-side uploads)

This project uses the Firebase Admin SDK for server-side uploads to Firebase Storage (advertisements). To run the admin APIs locally or in production you must provide admin credentials.

Recommended environment variables (local development with Next.js):

- `SERVICE_ACCOUNT_JSON` (string) — the full JSON contents of a service account key. Example (do not commit):

```bash
# .env.local
SERVICE_ACCOUNT_JSON='{"type":"service_account","project_id":"...",...}'
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
```

OR

- `GOOGLE_APPLICATION_CREDENTIALS` — path to a service account JSON file. When set, the initializer will try Application Default Credentials.

Also required (client-side env vars already used by the app):

- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` — your storage bucket name (e.g. `my-project.appspot.com`).

Notes

- The server initializer tries `SERVICE_ACCOUNT_JSON` first and falls back to Application Default Credentials. If neither is available it will throw a clear error.
- In production, prefer setting `GOOGLE_APPLICATION_CREDENTIALS` or configuring ADC on your hosting provider (e.g., GCP service account).
- If you want admins to upload from the browser directly, you can instead configure Security Rules (see `storage.rules`) and set custom claims for admin users, but server-side uploads are safer for restricted paths.

Quick test

- Start the dev server and call the health endpoint:

```bash
curl -s http://localhost:3000/api/admin/health | jq
```

You should see `{ ok: true, initialized: true, bucket: "your-bucket" }`. If `ok` is false, the `detail` field will contain the initialization error message.

Calling admin APIs with an ID token

To call the admin endpoints you must send a Firebase ID token from an authenticated admin user in the Authorization header.

Example (obtain token in your browser app):

```js
// client-side (browser)
const token = await firebase.auth().currentUser.getIdToken();
// send with fetch
await fetch("/api/admin/upload-ad", {
  method: "POST",
  headers: { Authorization: `Bearer ${token}` },
  body: formData, // include file in formData
});
```

Curl example (replace <ID_TOKEN>):

```bash
curl -H "Authorization: Bearer <ID_TOKEN>" -F "file=@/path/to/image.jpg" http://localhost:3000/api/admin/upload-ad
```

The token must belong to a user who has the custom claim `role` set to `admin` or `super_admin`.

Skipping server-side token verification

If you prefer to control access via Firebase Storage rules (so clients upload directly), you can disable server-side token checks on the admin API by setting:

```bash
# opt-in (dev only)
SKIP_ADMIN_API_AUTH=true
```

Warning: enabling this flag means the `/api/admin/upload-ad` and `/api/admin/delete-ad` endpoints will not verify the caller; only rely on this if your Storage rules enforce the required protection (for example, checking `request.auth.token.role`). Use with caution in production.
