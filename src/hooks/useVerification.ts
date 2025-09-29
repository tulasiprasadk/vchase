import { useState, useEffect } from "react";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { VerificationRequest } from "@/types";
import toast from "react-hot-toast";

export const useVerification = () => {
  const [verificationRequests, setVerificationRequests] = useState<
    VerificationRequest[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch all verification requests (for admin)
  const fetchVerificationRequests = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, "verificationRequests"),
        orderBy("requestedAt", "desc")
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const requests = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as VerificationRequest[];

        setVerificationRequests(requests);
        setLoading(false);
      });

      return unsubscribe;
    } catch (error) {
      console.error("Error fetching verification requests:", error);
      setLoading(false);
    }
  };

  // Fetch verification requests for a specific user
  const fetchUserVerificationRequest = async (userId: string) => {
    try {
      const q = query(
        collection(db, "verificationRequests"),
        where("userId", "==", userId),
        orderBy("requestedAt", "desc")
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as VerificationRequest[];
    } catch (error) {
      console.error("Error fetching user verification request:", error);
      return [];
    }
  };

  // Submit verification request
  const submitVerificationRequest = async (
    userId: string,
    requestData: Omit<
      VerificationRequest,
      "id" | "requestedAt" | "status" | "createdAt" | "updatedAt"
    >
  ) => {
    try {
      setSubmitting(true);

      const verificationRequest: Omit<VerificationRequest, "id"> = {
        ...requestData,
        userId,
        status: "pending",
        requestedAt: Timestamp.now(),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const docRef = await addDoc(
        collection(db, "verificationRequests"),
        verificationRequest
      );

      // Update user's verification status
      await updateDoc(doc(db, "users", userId), {
        verificationStatus: "pending",
        verificationRequestId: docRef.id,
        updatedAt: Timestamp.now(),
      });

      toast.success("Verification request submitted successfully!");
      return docRef.id;
    } catch (error) {
      console.error("Error submitting verification request:", error);
      toast.error("Failed to submit verification request");
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  // Approve verification request (admin only)
  const approveVerification = async (
    requestId: string,
    adminId: string,
    notes?: string
  ) => {
    try {
      const requestRef = doc(db, "verificationRequests", requestId);
      const request = verificationRequests.find((r) => r.id === requestId);

      if (!request) throw new Error("Verification request not found");

      // Update verification request
      await updateDoc(requestRef, {
        status: "approved",
        reviewedAt: Timestamp.now(),
        reviewedBy: adminId,
        reviewNotes: notes || "",
        updatedAt: Timestamp.now(),
      });

      // Update user profile
      await updateDoc(doc(db, "users", request.userId), {
        isVerified: true,
        verificationStatus: "approved",
        verifiedAt: Timestamp.now(),
        verifiedBy: adminId,
        updatedAt: Timestamp.now(),
      });

      toast.success("Verification approved successfully!");
    } catch (error) {
      console.error("Error approving verification:", error);
      toast.error("Failed to approve verification");
      throw error;
    }
  };

  // Reject verification request (admin only)
  const rejectVerification = async (
    requestId: string,
    adminId: string,
    notes: string
  ) => {
    try {
      const requestRef = doc(db, "verificationRequests", requestId);
      const request = verificationRequests.find((r) => r.id === requestId);

      if (!request) throw new Error("Verification request not found");

      // Update verification request
      await updateDoc(requestRef, {
        status: "rejected",
        reviewedAt: Timestamp.now(),
        reviewedBy: adminId,
        reviewNotes: notes,
        updatedAt: Timestamp.now(),
      });

      // Update user profile
      await updateDoc(doc(db, "users", request.userId), {
        isVerified: false,
        verificationStatus: "rejected",
        updatedAt: Timestamp.now(),
      });

      toast.success("Verification rejected");
    } catch (error) {
      console.error("Error rejecting verification:", error);
      toast.error("Failed to reject verification");
      throw error;
    }
  };

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    fetchVerificationRequests().then((unsub) => {
      unsubscribe = unsub;
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return {
    verificationRequests,
    loading,
    submitting,
    submitVerificationRequest,
    approveVerification,
    rejectVerification,
    fetchUserVerificationRequest,
    refetch: fetchVerificationRequests,
  };
};
