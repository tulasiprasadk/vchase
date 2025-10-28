# Fixing CORS errors for Firebase Storage uploads

If your browser upload (Firebase client SDK or direct PUT to signed URLs) produces a CORS error, the root cause is usually that your Cloud Storage bucket does not have a CORS configuration allowing your web origin and the upload headers/methods that the SDK uses.

This repo includes a sample CORS file at `tools/storage-cors.json`. The common fix is to set that CORS policy on your bucket.

1. Quick steps (recommended)

- Install Google Cloud SDK (provides `gsutil`) if you don't have it. On macOS you can use Homebrew:

```bash
brew install --cask google-cloud-sdk
# then run `gcloud init` to authenticate if necessary
```

- Apply the CORS configuration (replace `YOUR_BUCKET_NAME`):

```bash
gsutil cors set tools/storage-cors.json gs://YOUR_BUCKET_NAME
```

Example: for the Firebase bucket `my-project.appspot.com`:

```bash
gsutil cors set tools/storage-cors.json gs://my-project.appspot.com
```

2. What the sample policy does

- Allows origins: `http://localhost:3000` (development) and `https://your-production-domain.com` (replace with your real production domain).
- Allows methods: GET, HEAD, PUT, POST, OPTIONS (covers both REST & resumable uploads used by the Firebase JS SDK).
- Exposes/accepts headers commonly required by resumable uploads (`x-goog-resumable`) and auth/content headers.
- Sets `maxAgeSeconds` to 3600 to reduce preflight frequency.

3. Alternative: Console UI

You can also configure CORS from the GCP Console: Storage → Buckets → Click your bucket → Settings → CORS configuration → Edit and paste the JSON.

4. Why this is needed

- The Firebase Storage JS SDK uses resumable uploads which issue preflight (OPTIONS) requests and send headers like `x-goog-resumable`. If the bucket CORS policy doesn't allow those request headers or the origin, the browser blocks the upload with a CORS error.

5. Quick verification (after applying)

```bash
# Replace origin and URL as appropriate
curl -i -X OPTIONS \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  https://storage.googleapis.com/YOUR_BUCKET_NAME
```

You should get CORS response headers like `Access-Control-Allow-Origin` and `Access-Control-Allow-Methods`.

6. Notes

- If you rely on signed URLs or a server endpoint that returns an upload URL, CORS still applies for direct browser uploads to the GCS endpoint.
- Keep allowed origins minimal in production (use your exact production domain). Don't leave wide open `*` unless you intentionally want public access and accept the risks.

If you want, I can:

- Commit a tailored `tools/storage-cors.json` for your production hostname and run a quick verification command here (if you provide the bucket name), or
- Add an admin UI hint that explains whether client uploads are enabled and points to the CORS docs.
