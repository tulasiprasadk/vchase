import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  type DocumentData,
  type FirestoreDataConverter,
  type QueryConstraint,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./config";

const missingConfigMessage =
  "Firebase Firestore is not configured. Ensure NEXT_PUBLIC_FIREBASE_* env variables are set.";

type FirestoreResult<T> = {
  data?: T;
  error: string | null;
};

const ensureDb = () => {
  if (!db) {
    throw new Error(missingConfigMessage);
  }
  return db;
};

const unwrapError = (err: unknown, fallback: string) =>
  err instanceof Error ? err.message : fallback;

export const createDocument = async <T extends DocumentData>(
  collectionName: string,
  data: T
): Promise<FirestoreResult<{ id: string }>> => {
  try {
    const instance = ensureDb();
    const colRef = collection(instance, collectionName);
    const docRef = await addDoc(colRef, {
      ...data,
      createdAt: data?.createdAt ?? serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { data: { id: docRef.id }, error: null };
  } catch (error) {
    if (error instanceof Error && error.message === missingConfigMessage) {
      return { data: undefined, error: error.message };
    }
    return {
      data: undefined,
      error: unwrapError(error, "Unable to create document."),
    };
  }
};

export const setDocument = async <T extends DocumentData>(
  collectionName: string,
  id: string,
  data: T
): Promise<FirestoreResult<true>> => {
  try {
    const instance = ensureDb();
    const ref = doc(instance, collectionName, id);
    await setDoc(ref, {
      ...data,
      createdAt: data?.createdAt ?? serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { data: true, error: null };
  } catch (error) {
    if (error instanceof Error && error.message === missingConfigMessage) {
      return { data: undefined, error: error.message };
    }
    return {
      data: undefined,
      error: unwrapError(error, "Unable to save document."),
    };
  }
};

export const updateDocument = async (
  collectionName: string,
  id: string,
  data: DocumentData
): Promise<FirestoreResult<true>> => {
  try {
    const instance = ensureDb();
    const ref = doc(instance, collectionName, id);
    await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
    return { data: true, error: null };
  } catch (error) {
    if (error instanceof Error && error.message === missingConfigMessage) {
      return { data: undefined, error: error.message };
    }
    return {
      data: undefined,
      error: unwrapError(error, "Unable to update document."),
    };
  }
};

export const deleteDocument = async (
  collectionName: string,
  id: string
): Promise<FirestoreResult<true>> => {
  try {
    const instance = ensureDb();
    const ref = doc(instance, collectionName, id);
    await deleteDoc(ref);
    return { data: true, error: null };
  } catch (error) {
    if (error instanceof Error && error.message === missingConfigMessage) {
      return { data: undefined, error: error.message };
    }
    return {
      data: undefined,
      error: unwrapError(error, "Unable to delete document."),
    };
  }
};

export const getDocument = async <T = DocumentData>(
  collectionName: string,
  id: string,
  converter?: FirestoreDataConverter<T>
): Promise<FirestoreResult<T | null>> => {
  try {
    const instance = ensureDb();
    const baseRef = doc(instance, collectionName, id);
    const snap = converter
      ? await getDoc(baseRef.withConverter(converter))
      : await getDoc(baseRef);
    let payload: T | null = null;
    if (snap.exists()) {
      if (converter) {
        payload = (snap.data() as T) ?? null;
      } else {
        const rawData = snap.data() as T | undefined;
        payload = rawData ?? null;
      }
    }
    return {
      data: payload,
      error: null,
    };
  } catch (error) {
    if (error instanceof Error && error.message === missingConfigMessage) {
      return { data: undefined, error: error.message };
    }
    return {
      data: undefined,
      error: unwrapError(error, "Unable to fetch document."),
    };
  }
};

export const getCollection = async <T = DocumentData>(
  collectionName: string
): Promise<FirestoreResult<T[]>> => {
  try {
    const instance = ensureDb();
    const colRef = collection(instance, collectionName);
    const snapshot = await getDocs(colRef);
    const items = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as T[];
    return { data: items, error: null };
  } catch (error) {
    if (error instanceof Error && error.message === missingConfigMessage) {
      return { data: undefined, error: error.message };
    }
    return {
      data: undefined,
      error: unwrapError(error, "Unable to fetch collection."),
    };
  }
};

export const saveFormData = createDocument;

export const subscribeToCollection = <T = DocumentData>(
  collectionName: string,
  callback: (items: T[]) => void,
  constraints: QueryConstraint[] = []
): Unsubscribe | null => {
  try {
    const instance = ensureDb();
    const colRef = collection(instance, collectionName);
    const source =
      constraints.length > 0 ? query(colRef, ...constraints) : colRef;

    return onSnapshot(
      source,
      (snapshot) => {
        const items = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        })) as T[];
        callback(items);
      },
      (error) => {
        console.error(
          `Unable to subscribe to collection "${collectionName}":`,
          error
        );
      }
    );
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === missingConfigMessage
    ) {
      console.warn(
        `[firebase] subscribeToCollection skipped: ${error.message}`
      );
    } else {
      console.error(
        `Unable to subscribe to collection "${collectionName}":`,
        error
      );
    }
    return null;
  }
};
