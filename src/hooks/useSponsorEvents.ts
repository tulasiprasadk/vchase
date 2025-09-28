import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  Timestamp,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Event } from "@/types";
import toast from "react-hot-toast";

export interface EventFilters {
  category?: string;
  location?: string;
  minBudget?: number;
  maxBudget?: number;
  search?: string;
}

export const useSponsorEvents = (filters?: EventFilters) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);

  // Fetch unique categories and locations for filters
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const eventsRef = collection(db, "events");
        const q = query(eventsRef, where("status", "==", "published"));
        const snapshot = await getDocs(q);

        const uniqueCategories = new Set<string>();
        const uniqueLocations = new Set<string>();

        snapshot.docs.forEach((doc) => {
          const event = doc.data() as Event;
          if (event.category) uniqueCategories.add(event.category);
          if (event.location) {
            if (typeof event.location === "string") {
              uniqueLocations.add(event.location);
            } else if (event.location && event.location.city) {
              uniqueLocations.add(event.location.city);
            }
          }
        });

        setCategories(Array.from(uniqueCategories).sort());
        setLocations(Array.from(uniqueLocations).sort());
      } catch (error) {
        console.error("Error fetching filter options:", error);
      }
    };

    fetchFilterOptions();
  }, []);

  // Fetch events with filters
  useEffect(() => {
    console.log(
      "🚀 useSponsorEvents: Starting to fetch events with filters:",
      filters
    );
    setLoading(true);

    const eventsRef = collection(db, "events");
    // Temporarily remove status filter to see all events
    const q = query(eventsRef);
    // const q = query(eventsRef, where("status", "==", "published"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        console.log(
          "📊 Events snapshot received:",
          snapshot.docs.length,
          "documents"
        );

        let filteredEvents = snapshot.docs.map((doc) => {
          const data = doc.data();
          console.log("📄 Event data:", doc.id, data);
          return {
            id: doc.id,
            ...data,
            startDate: data.startDate || null,
            endDate: data.endDate || null,
            createdAt: data.createdAt || Timestamp.now(),
            updatedAt: data.updatedAt || Timestamp.now(),
          } as Event;
        });

        // Apply filters
        if (filters) {
          filteredEvents = filteredEvents.filter((event) => {
            // Category filter
            if (filters.category && event.category !== filters.category) {
              return false;
            }

            // Location filter
            if (filters.location) {
              const eventLocation =
                typeof event.location === "string"
                  ? event.location
                  : (event.location && event.location.city) || "";
              if (
                !eventLocation
                  .toLowerCase()
                  .includes(filters.location.toLowerCase())
              ) {
                return false;
              }
            }

            // Budget filter (based on sponsorship packages)
            if (filters.minBudget || filters.maxBudget) {
              const packagePrices = (event.sponsorshipPackages &&
                event.sponsorshipPackages.map((pkg) => pkg.price || 0)) || [0];
              const minPrice = Math.min(...packagePrices);
              const maxPrice = Math.max(...packagePrices);

              if (filters.minBudget && maxPrice < filters.minBudget)
                return false;
              if (filters.maxBudget && minPrice > filters.maxBudget)
                return false;
            }

            // Search filter
            if (filters.search) {
              const searchTerm = filters.search.toLowerCase();
              return (
                event.title.toLowerCase().includes(searchTerm) ||
                event.description.toLowerCase().includes(searchTerm) ||
                (event.category &&
                  event.category.toLowerCase().includes(searchTerm)) ||
                event.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
              );
            }

            return true;
          });
        }

        // Filter out past events and sort by creation date (newest first)
        const now = new Date();
        console.log("🕐 Current date:", now);

        filteredEvents = filteredEvents
          .filter((event) => {
            if (!event.startDate) {
              console.log("⚠️ Event without startDate:", event.title);
              return true;
            }
            const eventDate = event.startDate.toDate();
            const isUpcoming = eventDate >= now;
            console.log(
              `📅 Event ${event.title}: ${eventDate} (upcoming: ${isUpcoming})`
            );
            return isUpcoming;
          })
          .sort((a, b) => {
            return b.createdAt.toMillis() - a.createdAt.toMillis();
          });

        console.log("✅ Final filtered events:", filteredEvents.length);
        console.log(
          "📋 Events:",
          filteredEvents.map((e) => ({
            id: e.id,
            title: e.title,
            status: e.status,
          }))
        );

        setEvents(filteredEvents);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching events:", error);
        toast.error("Failed to fetch events");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [filters]);

  return {
    events,
    loading,
    categories,
    locations,
  };
};
