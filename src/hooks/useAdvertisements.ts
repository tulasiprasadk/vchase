import { useState, useEffect } from "react";
import {
  collection,
  query,
  onSnapshot,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Advertisement } from "@/types";

interface UseAdvertisementsReturn {
  advertisements: Advertisement[];
  loading: boolean;
  error: string | null;
  getAdsByPosition: (position: Advertisement["position"]) => Advertisement[];
  getActiveAds: () => Advertisement[];
}

export const useAdvertisements = (): UseAdvertisementsReturn => {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, "advertisements"),
      where("isActive", "==", true),
      orderBy("order", "asc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const ads = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Advertisement[];

        // Filter out expired ads
        const now = Timestamp.now();
        const activeAds = ads.filter((ad) => {
          if (ad.endDate && ad.endDate.toMillis() < now.toMillis()) {
            return false;
          }
          if (ad.startDate && ad.startDate.toMillis() > now.toMillis()) {
            return false;
          }
          return true;
        });

        setAdvertisements(activeAds);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error fetching advertisements:", err);
        setError("Failed to load advertisements");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const getAdsByPosition = (
    position: Advertisement["position"]
  ): Advertisement[] => {
    return advertisements.filter((ad) => ad.position === position);
  };

  const getActiveAds = (): Advertisement[] => {
    return advertisements;
  };

  return {
    advertisements,
    loading,
    error,
    getAdsByPosition,
    getActiveAds,
  };
};
