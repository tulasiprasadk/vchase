import { useState } from "react";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  query,
  where,
  onSnapshot,
  Timestamp,
  arrayUnion,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export interface SponsorshipEnquiry {
  id?: string;
  eventId: string;
  sponsorId: string;
  packageId: string;
  packageName: string;
  eventTitle: string;
  companyName: string;
  contactEmail: string;
  contactPhone?: string;
  message?: string;
  proposedAmount?: number;
  status:
    | "pending"
    | "accepted"
    | "rejected"
    | "under_review"
    | "payment_pending"
    | "payment_uploaded"
    | "payment_verified"
    | "completed";
  submittedAt: Timestamp;
  updatedAt: Timestamp;
  organizerResponse?: string;
  responseDate?: Timestamp;
  // Payment flow fields
  paymentProofUrl?: string;
  paymentProofFileName?: string;
  paymentUploadedAt?: Timestamp;
  paymentVerifiedAt?: Timestamp;
  paymentVerificationNotes?: string;
  finalAmount?: number; // Actual amount agreed upon
}

export const useSponsorshipEnquiries = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [enquiries, setEnquiries] = useState<SponsorshipEnquiry[]>([]);

  // Submit a new enquiry
  const submitEnquiry = async (data: {
    eventId: string;
    packageId: string;
    packageName: string;
    eventTitle: string;
    companyName: string;
    contactEmail: string;
    contactPhone?: string;
    message?: string;
    proposedAmount?: number;
  }) => {
    if (!user) throw new Error("User not authenticated");

    setLoading(true);
    try {
      const database = db;
      if (!database) {
        throw new Error("Database is not configured.");
      }

      const enquiryData: Omit<SponsorshipEnquiry, "id"> = {
        ...data,
        sponsorId: user.uid,
        status: "pending",
        submittedAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(database, "enquiries"), enquiryData);
      toast.success("Enquiry submitted successfully!");
      return docRef.id;
    } catch (error) {
      console.error("Error submitting enquiry:", error);
      toast.error("Failed to submit enquiry");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's enquiries with real-time updates
  const fetchEnquiries = () => {
    if (!user) return () => {};

    const database = db;
    if (!database) {
      console.warn("[useSponsorshipEnquiries] Database not configured.");
      return () => {};
    }

    const enquiriesRef = collection(database, "enquiries");
    const q = query(enquiriesRef, where("sponsorId", "==", user.uid));

    return onSnapshot(
      q,
      (snapshot) => {
        const userEnquiries = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as SponsorshipEnquiry[];

        // Sort on client side to avoid composite index requirement
        const sortedEnquiries = userEnquiries.sort((a, b) => {
          return b.submittedAt.toMillis() - a.submittedAt.toMillis();
        });

        setEnquiries(sortedEnquiries);
      },
      (error) => {
        console.error("Error fetching enquiries:", error);
        toast.error("Failed to fetch enquiries");
      }
    );
  };

  // Upload payment proof
  const uploadPaymentProof = async (
    enquiryId: string,
    paymentProofUrl: string,
    fileName: string
  ) => {
    if (!user) throw new Error("User not authenticated");

    try {
      const database = db;
      if (!database) {
        throw new Error("Database is not configured.");
      }

      const enquiryRef = doc(database, "enquiries", enquiryId);
      await updateDoc(enquiryRef, {
        paymentProofUrl,
        paymentProofFileName: fileName,
        paymentUploadedAt: Timestamp.now(),
        status: "payment_uploaded",
        updatedAt: Timestamp.now(),
      });

      toast.success("Payment proof uploaded successfully!");
    } catch (error) {
      console.error("Error uploading payment proof:", error);
      toast.error("Failed to upload payment proof");
      throw error;
    }
  };

  // Update enquiry status (for organizers)
  const updateEnquiryStatus = async (
    enquiryId: string,
    status: SponsorshipEnquiry["status"],
    notes?: string,
    finalAmount?: number
  ) => {
    if (!user) throw new Error("User not authenticated");

    try {
      const database = db;
      if (!database) {
        throw new Error("Database is not configured.");
      }

      const updateData: Partial<SponsorshipEnquiry> = {
        status,
        updatedAt: Timestamp.now(),
        responseDate: Timestamp.now(),
      };

      if (notes) {
        updateData.organizerResponse = notes;
      }

      if (finalAmount !== undefined) {
        updateData.finalAmount = finalAmount;
      }

      if (status === "payment_verified") {
        updateData.paymentVerifiedAt = Timestamp.now();
        if (notes) {
          updateData.paymentVerificationNotes = notes;
        }
      }

      const enquiryRef = doc(database, "enquiries", enquiryId);
      await updateDoc(enquiryRef, updateData);

      const statusMessages: { [key: string]: string } = {
        accepted: "Enquiry accepted successfully!",
        rejected: "Enquiry rejected.",
        payment_pending: "Payment request sent to sponsor.",
        payment_verified: "Payment verified successfully!",
        completed: "Sponsorship completed!",
      };

      toast.success(statusMessages[status] || "Enquiry status updated!");
    } catch (error) {
      console.error("Error updating enquiry status:", error);
      toast.error("Failed to update enquiry status");
      throw error;
    }
  };

  // Add sponsor to event (called when payment is verified)
  const addSponsorToEvent = async (enquiry: SponsorshipEnquiry) => {
    if (!user) throw new Error("User not authenticated");

    try {
      const database = db;
      if (!database) {
        throw new Error("Database is not configured.");
      }

      // Create the sponsor record for the event
      const eventSponsor = {
        sponsorId: enquiry.sponsorId,
        enquiryId: enquiry.id!,
        packageId: enquiry.packageId,
        packageName: enquiry.packageName,
        companyName: enquiry.companyName,
        contactEmail: enquiry.contactEmail,
        amount: enquiry.finalAmount || enquiry.proposedAmount || 0,
        addedAt: Timestamp.now(),
        status: "active",
      };

      // Add sponsor to the event's sponsors array
      const eventRef = doc(database, "events", enquiry.eventId);
      await updateDoc(eventRef, {
        sponsors: arrayUnion(eventSponsor),
      });

      // Update enquiry status to completed
      const enquiryRef = doc(database, "enquiries", enquiry.id!);
      await updateDoc(enquiryRef, {
        status: "completed",
        updatedAt: Timestamp.now(),
      });

      toast.success("Sponsor added to event successfully!");
    } catch (error) {
      console.error("Error adding sponsor to event:", error);
      toast.error("Failed to add sponsor to event");
      throw error;
    }
  };

  return {
    enquiries,
    loading,
    submitEnquiry,
    fetchEnquiries,
    uploadPaymentProof,
    updateEnquiryStatus,
    addSponsorToEvent,
  };
};
