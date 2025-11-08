import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  Timestamp,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export interface Sponsorship {
  id: string;
  eventId: string;
  eventTitle: string;
  packageId: string;
  packageName: string;
  amount: number;
  status: "pending" | "approved" | "rejected" | "completed" | "active";
  eventDate: Timestamp;
  location: string;
  reach: number;
  leads: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  organizerId: string;
  sponsorId: string;
}

export const useSponsorships = () => {
  const { user } = useAuth();
  const [sponsorships, setSponsorships] = useState<Sponsorship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    console.log("🔥 Fetching sponsorships for user:", user.uid);

    const database = db;
    if (!database) {
      console.warn("[useSponsorships] Firebase is not configured.");
      setLoading(false);
      return;
    }

    const sponsorshipsRef = collection(database, "sponsorshipApplications");
    const q = query(
      sponsorshipsRef,
      where("sponsorId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        console.log(
          "📊 Sponsorships snapshot received:",
          snapshot.docs.length,
          "documents"
        );

        const sponsorshipData = snapshot.docs.map((doc) => {
          const data = doc.data();
          console.log("📄 Sponsorship data:", doc.id, data);

          return {
            id: doc.id,
            ...data,
            eventDate: data.eventDate || Timestamp.now(),
            createdAt: data.createdAt || Timestamp.now(),
            updatedAt: data.updatedAt || Timestamp.now(),
            reach: data.reach || 0,
            leads: data.leads || 0,
          } as Sponsorship;
        });

        console.log("✅ Processed sponsorships:", sponsorshipData.length);
        setSponsorships(sponsorshipData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching sponsorships:", error);
        toast.error("Failed to fetch sponsorships");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  return {
    sponsorships,
    loading,
  };
};
