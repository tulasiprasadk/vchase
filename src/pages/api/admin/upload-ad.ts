/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import { initFirebaseAdmin } from "@/lib/firebase/admin";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  // Token verification can be skipped if you choose to control access via
  // Firebase Storage security rules. Set SKIP_ADMIN_API_AUTH=true in your
  // environment to opt-in to skipping server-side token checks.
  const skipAuth = process.env.SKIP_ADMIN_API_AUTH === "true";

  // Initialize admin only when we need server-side uploads/verification.
  // If SKIP_ADMIN_API_AUTH is true we assume clients will upload directly to
  // Storage (so server admin credentials are not required). In that case we
  // return a clear 501 instructing the caller to upload directly.
  let admin: any | undefined;
  if (!skipAuth) {
    try {
      admin = initFirebaseAdmin();
    } catch (err) {
      console.error("Admin init error", err);
      const detail = err instanceof Error ? err.message : String(err);
      return res.status(500).json({ error: "Server misconfigured", detail });
    }

    // Verify caller is an admin by checking Firebase ID token in Authorization header.
    // Expect: Authorization: Bearer <idToken>
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (
      !authHeader ||
      Array.isArray(authHeader) ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res
        .status(401)
        .json({ error: "Unauthorized: missing Authorization header" });
    }
    const idToken = authHeader.split(" ")[1];
    try {
      const decoded = await admin.auth().verifyIdToken(idToken);
      const decodedMap = decoded as { [key: string]: unknown };
      const role =
        typeof decodedMap.role === "string" ? decodedMap.role : undefined;
      if (role !== "admin" && role !== "super_admin") {
        return res.status(403).json({ error: "Forbidden: insufficient role" });
      }
    } catch (err) {
      console.error("Token verification failed", err);
      const detail = err instanceof Error ? err.message : String(err);
      return res
        .status(401)
        .json({ error: "Unauthorized: invalid token", detail });
    }
  } else {
    return res.status(501).json({
      error: "Server not configured for server-side upload",
      detail:
        "SKIP_ADMIN_API_AUTH=true is set and server-side admin credentials are not available. Upload directly to Firebase Storage or unset SKIP_ADMIN_API_AUTH and provide service account credentials.",
    });
  }

  // Use the callable API which is compatible with different module interop
  // shapes for formidable in bundled environments.
  const form = formidable({ multiples: false });

  const parseForm = () =>
    new Promise<{ fields: formidable.Fields; files: formidable.Files }>(
      (resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) return reject(err);
          resolve({ fields, files });
        });
      }
    );

  try {
    const { files } = await parseForm();
    const anyFiles = files as any;
    // prefer `file` key, otherwise take the first file
    let usedFile: any = (anyFiles.file as formidable.File) || undefined;
    if (!usedFile) {
      const firstKey = Object.keys(anyFiles)[0];
      if (firstKey) {
        usedFile = anyFiles[firstKey] as formidable.File;
      }
    }

    if (!usedFile) return res.status(400).json({ error: "No file uploaded" });

    // If formidable returned an array for this field, pick the first file
    if (Array.isArray(usedFile)) usedFile = usedFile[0];

    const tempPath = (usedFile as any).filepath || (usedFile as any).path;
    const originalName =
      (usedFile as any).originalFilename || (usedFile as any).name || "upload";
    const mime =
      (usedFile as any).mimetype || (usedFile as any).type || undefined;
    const destName = `advertisements/${Date.now()}_${originalName}`;

    try {
      const bucket = admin.storage().bucket();
      if (tempPath) {
        await bucket.upload(tempPath, {
          destination: destName,
          metadata: mime ? { contentType: mime } : undefined,
        });
      } else if ((usedFile as any).buffer) {
        // formidable may expose the file buffer in some configurations
        await bucket.file(destName).save((usedFile as any).buffer, {
          metadata: mime ? { contentType: mime } : undefined,
        });
      } else {
        // unknown shape — return helpful debug info
        return res.status(500).json({
          error: "Upload failed",
          detail: "Uploaded file missing temporary path and buffer",
          fileKeys: Object.keys(usedFile || {}).slice(0, 50),
        });
      }

      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${destName}`;

      // Clean temp file
      try {
        fs.unlinkSync(tempPath);
      } catch {
        // ignore cleanup errors
      }

      return res.status(200).json({ url: publicUrl, path: destName });
    } catch (e) {
      console.error("Upload failed", e);
      const detail = e instanceof Error ? e.message : String(e);
      return res.status(500).json({ error: "Upload failed", detail });
    }
  } catch (err) {
    console.error("Form parse error", err);
    const detail = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ error: "Upload parse error", detail });
  }
}
