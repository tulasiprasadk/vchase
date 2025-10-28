import admin from "firebase-admin";

/**
 * Initialize and return the firebase-admin instance.
 *
 * This helper attempts to initialize using the following order:
 * 1. SERVICE_ACCOUNT_JSON env var (full JSON string)
 * 2. Application Default Credentials (admin.credential.applicationDefault())
 *
 * Throws a clear error if no credentials are available.
 */
export function initFirebaseAdmin() {
  if (admin.apps.length) return admin;

  if (process.env.SERVICE_ACCOUNT_JSON) {
    const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_JSON);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
  } else {
    // Try ADC (this will work if GOOGLE_APPLICATION_CREDENTIALS is set or
    // when running on GCP with service account attached).
    try {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      });
    } catch {
      throw new Error(
        "No Firebase admin credentials found. Set SERVICE_ACCOUNT_JSON or ensure Application Default Credentials are available (e.g. set GOOGLE_APPLICATION_CREDENTIALS)"
      );
    }
  }

  return admin;
}

export default admin;
