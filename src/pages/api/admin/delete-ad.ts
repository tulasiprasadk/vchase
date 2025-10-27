import type { NextApiRequest, NextApiResponse } from "next";
import { initFirebaseAdmin } from "@/lib/firebase/admin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST" && req.method !== "DELETE")
    return res.status(405).end();

  let admin;
  try {
    admin = initFirebaseAdmin();
  } catch (err) {
    console.error("Admin init error", err);
    const detail = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ error: "Server misconfigured", detail });
  }

  // Token verification can be skipped if you choose to control access via
  // Firebase Storage security rules. Set SKIP_ADMIN_API_AUTH=true in your
  // environment to opt-in to skipping server-side token checks.
  const skipAuth = process.env.SKIP_ADMIN_API_AUTH === "true";
  if (!skipAuth) {
    // Verify caller is an admin by checking Firebase ID token in Authorization header.
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
  }

  const { path } = req.body as { path?: string };
  if (!path) return res.status(400).json({ error: "Missing path" });

  try {
    const bucket = admin.storage().bucket();
    const file = bucket.file(path);
    await file.delete();
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Delete failed", err);
    const detail = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ error: "Delete failed", detail });
  }
}
