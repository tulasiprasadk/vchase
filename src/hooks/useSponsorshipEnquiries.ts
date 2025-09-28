import { useState } from "react";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  Timestamp,
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
  status: "pending" | "accepted" | "rejected" | "under_review";
  submittedAt: Timestamp;
  updatedAt: Timestamp;
  organizerResponse?: string;
  responseDate?: Timestamp;
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
      const enquiryData: Omit<SponsorshipEnquiry, "id"> = {
        ...data,
        sponsorId: user.uid,
        status: "pending",
        submittedAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, "enquiries"), enquiryData);
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

    const enquiriesRef = collection(db, "enquiries");
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

  return {
    enquiries,
    loading,
    submitEnquiry,
    fetchEnquiries,
  };
};
