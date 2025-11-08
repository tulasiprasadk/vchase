import {
  onAuthStateChanged,
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  type Unsubscribe,
  type User,
  type UserCredential,
} from "firebase/auth";
import { auth } from "./config";

const missingConfigMessage =
  "Firebase auth is not configured. Ensure NEXT_PUBLIC_FIREBASE_* env variables are set.";

type AuthResult = {
  user: User | null;
  error: string | null;
  credential?: UserCredential | null;
};

export const onAuthStateChange = (
  callback: Parameters<typeof onAuthStateChanged>[1]
): Unsubscribe => {
  if (!auth) {
    console.warn(missingConfigMessage);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
};

export const signInWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<AuthResult> => {
  if (!auth) {
    return { user: null, error: missingConfigMessage };
  }
  try {
    const credential = await firebaseSignInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return { user: credential.user, error: null, credential };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unable to sign in with email.";
    return { user: null, error: message };
  }
};

export const signUpWithEmailAndPassword = async (
  email: string,
  password: string,
  displayName?: string
): Promise<AuthResult> => {
  if (!auth) {
    return { user: null, error: missingConfigMessage };
  }
  try {
    const credential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    if (displayName) {
      await updateProfile(credential.user, { displayName });
    }
    return { user: credential.user, error: null, credential };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unable to create account.";
    return { user: null, error: message };
  }
};

export const signInWithGoogle = async (): Promise<AuthResult> => {
  if (!auth) {
    return { user: null, error: missingConfigMessage };
  }
  if (typeof window === "undefined") {
    return {
      user: null,
      error: "Google sign-in is only available in the browser.",
    };
  }
  try {
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(auth, provider);
    return { user: credential.user, error: null, credential };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unable to sign in with Google.";
    return { user: null, error: message };
  }
};

export const signOutUser = async (): Promise<{ error: string | null }> => {
  if (!auth) {
    return { error: missingConfigMessage };
  }
  try {
    await signOut(auth);
    return { error: null };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unable to sign out.";
    return { error: message };
  }
};
