import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
  Query,
  DocumentData,
  WhereFilterOp,
  OrderByDirection,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "./config";

// Generic CRUD operations
export const createDocument = async (
  collectionName: string,
  data: Record<string, unknown>
) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return { id: docRef.id, error: null };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return { id: null, error: errorMessage };
  }
};

export const setDocument = async (
  collectionName: string,
  docId: string,
  data: Record<string, unknown>
) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return { error: null };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return { error: errorMessage };
  }
};

export const getDocument = async (collectionName: string, docId: string) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { data: { id: docSnap.id, ...docSnap.data() }, error: null };
    } else {
      return { data: null, error: "Document not found" };
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return { data: null, error: errorMessage };
  }
};

export const updateDocument = async (
  collectionName: string,
  docId: string,
  data: Record<string, unknown>
) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
    return { error: null };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return { error: errorMessage };
  }
};

export const deleteDocument = async (collectionName: string, docId: string) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    return { error: null };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return { error: errorMessage };
  }
};

export const getCollection = async (
  collectionName: string,
  conditions?: QueryConstraint[]
) => {
  try {
    const collectionRef = collection(db, collectionName);
    let q: Query<DocumentData> = collectionRef;

    if (conditions && conditions.length > 0) {
      q = query(collectionRef, ...conditions);
    }

    const querySnapshot = await getDocs(q);
    const documents = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { data: documents, error: null };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return { data: null, error: errorMessage };
  }
};

// Real-time listener
export const subscribeToCollection = (
  collectionName: string,
  callback: (data: DocumentData[]) => void,
  conditions?: QueryConstraint[]
) => {
  const collectionRef = collection(db, collectionName);
  let q: Query<DocumentData> = collectionRef;

  if (conditions && conditions.length > 0) {
    q = query(collectionRef, ...conditions);
  }

  return onSnapshot(q, (querySnapshot) => {
    const documents = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(documents);
  });
};

// Helper functions for common queries
export const queryWhere = (
  field: string,
  operator: WhereFilterOp,
  value: unknown
) => where(field, operator, value);
export const queryOrderBy = (
  field: string,
  direction: OrderByDirection = "asc"
) => orderBy(field, direction);
export const queryLimit = (limitCount: number) => limit(limitCount);

export { Timestamp, QueryConstraint };
