import { useState, useEffect, useCallback } from "react";
import {
  collection,
  query,
  onSnapshot,
  doc,
  updateDoc,
  Timestamp,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export interface OrganizerEnquiry {
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

export interface EnquiryStats {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
  underReview: number;
}

export const useOrganizerEnquiries = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [enquiries, setEnquiries] = useState<OrganizerEnquiry[]>([]);
  const [stats, setStats] = useState<EnquiryStats>({
    total: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
    underReview: 0,
  });

  // Fetch enquiries for organizer's events
  const fetchEnquiries = useCallback(() => {
    if (!user) {
      setLoading(false);
      return () => {};
    }

    setLoading(true);

    const database = db;
    if (!database) {
      console.warn("[useOrganizerEnquiries] Firebase is not configured.");
      setLoading(false);
      return () => {};
    }

    // Query enquiries for events created by this organizer
    // First we need to get the organizer's events, then fetch enquiries for those events
    // For now, we'll fetch all enquiries and filter by organizer's events
    const enquiriesRef = collection(database, "enquiries");
    const q = query(enquiriesRef, orderBy("submittedAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        try {
          const allEnquiries = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as OrganizerEnquiry[];

          // Filter enquiries for events owned by this organizer
          // TODO: We should optimize this by querying events first, then enquiries
          // For now, we'll need to check event ownership in the component

          setEnquiries(allEnquiries);

          // Calculate stats
          const newStats = allEnquiries.reduce(
            (acc, enquiry) => {
              acc.total++;
              switch (enquiry.status) {
                case "pending":
                  acc.pending++;
                  break;
                case "accepted":
                  acc.accepted++;
                  break;
                case "rejected":
                  acc.rejected++;
                  break;
                case "under_review":
                  acc.underReview++;
                  break;
              }
              return acc;
            },
            { total: 0, pending: 0, accepted: 0, rejected: 0, underReview: 0 }
          );

          setStats(newStats);
          setLoading(false);
        } catch (error) {
          console.error("Error processing enquiries:", error);
          toast.error("Failed to load enquiries");
          setLoading(false);
        }
      },
      (error) => {
        console.error("Error fetching enquiries:", error);
        toast.error("Failed to fetch enquiries");
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user]);

  // Update enquiry status
  const updateEnquiryStatus = async (
    enquiryId: string,
    status: "accepted" | "rejected" | "under_review",
    response?: string
  ) => {
    if (!enquiryId) {
      toast.error("Invalid enquiry ID");
      return false;
    }

    try {
      const database = db;
      if (!database) {
        toast.error("Database is not configured.");
        return false;
      }

      const enquiryRef = doc(database, "enquiries", enquiryId);
      const updateData: {
        status: string;
        updatedAt: Timestamp;
        organizerResponse?: string;
        responseDate?: Timestamp;
      } = {
        status,
        updatedAt: Timestamp.now(),
      };

      if (response) {
        updateData.organizerResponse = response;
        updateData.responseDate = Timestamp.now();
      }

      await updateDoc(enquiryRef, updateData);

      toast.success(
        `Enquiry ${
          status === "accepted"
            ? "accepted"
            : status === "rejected"
            ? "rejected"
            : "updated"
        } successfully`
      );
      return true;
    } catch (error) {
      console.error("Error updating enquiry:", error);
      toast.error("Failed to update enquiry");
      return false;
    }
  };

  // Bulk update enquiries
  const bulkUpdateEnquiries = async (
    enquiryIds: string[],
    status: "accepted" | "rejected" | "under_review"
  ) => {
    try {
      const promises = enquiryIds.map((id) => updateEnquiryStatus(id, status));
      await Promise.all(promises);
      toast.success(`${enquiryIds.length} enquiries updated successfully`);
      return true;
    } catch (error) {
      console.error("Error bulk updating enquiries:", error);
      toast.error("Failed to update enquiries");
      return false;
    }
  };

  // Filter enquiries by event
  const getEnquiriesByEvent = (eventId: string) => {
    return enquiries.filter((enquiry) => enquiry.eventId === eventId);
  };

  // Filter enquiries by status
  const getEnquiriesByStatus = (status: string) => {
    return enquiries.filter((enquiry) => enquiry.status === status);
  };

  useEffect(() => {
    const unsubscribe = fetchEnquiries();
    return unsubscribe;
  }, [user, fetchEnquiries]);

  return {
    enquiries,
    stats,
    loading,
    updateEnquiryStatus,
    bulkUpdateEnquiries,
    getEnquiriesByEvent,
    getEnquiriesByStatus,
    refetch: fetchEnquiries,
  };
};
