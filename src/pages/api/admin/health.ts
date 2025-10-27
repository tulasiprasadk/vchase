import type { NextApiRequest, NextApiResponse } from "next";
import { initFirebaseAdmin } from "@/lib/firebase/admin";

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const admin = initFirebaseAdmin();
    const bucketName =
      admin?.storage?.()?.bucket?.()?.name ||
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
      null;
    return res
      .status(200)
      .json({ ok: true, initialized: true, bucket: bucketName });
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    return res.status(200).json({ ok: false, initialized: false, detail });
  }
}
