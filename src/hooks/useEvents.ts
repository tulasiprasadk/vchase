import { useState, useEffect, useCallback } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Event, SponsorshipPackage } from "@/types";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export interface CreateEventData {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: {
    venue: string;
    address: string;
    city: string;
    country: string;
  };
  category: string;
  tags: string[];
  imageUrl?: string;
  website?: string;
  maxAttendees?: number;
  status: "draft" | "published";
  sponsorshipPackages?: SponsorshipPackage[];
  requirements?: {
    minBudget?: number;
    sponsorshipTypes?: string[];
  };
}

export interface UpdateEventData extends Partial<CreateEventData> {
  id: string;
}

interface UseEventsReturn {
  events: Event[];
  loading: boolean;
  error: string | null;
  createEvent: (eventData: CreateEventData) => Promise<Event | null>;
  updateEvent: (eventData: UpdateEventData) => Promise<boolean>;
  deleteEvent: (eventId: string) => Promise<boolean>;
  refreshEvents: () => Promise<void>;
}

export const useEvents = (): UseEventsReturn => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchEvents = useCallback(async () => {
    if (!user) {
      setLoading(false);
      setEvents([]);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const eventsCollection = collection(db, "events");
      const q = query(
        eventsCollection,
        where("organizerId", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      const eventsData: Event[] = [];

      querySnapshot.forEach((doc) => {
        eventsData.push({
          id: doc.id,
          ...doc.data(),
        } as Event);
      });

      setEvents(eventsData);
      setLoading(false);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch events";
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
      setEvents([]);
    }
  }, [user]);

  const createEvent = async (
    eventData: CreateEventData
  ): Promise<Event | null> => {
    if (!user) {
      toast.error("You must be logged in to create events");
      return null;
    }

    try {
      console.log("🔍 useEvents: Creating event with data:", {
        title: eventData.title,
        sponsorshipPackagesCount: eventData.sponsorshipPackages?.length || 0,
        sponsorshipPackages: eventData.sponsorshipPackages,
        requirements: eventData.requirements,
      });

      const eventId = `event_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      const now = Timestamp.now();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newEventData: any = {
        id: eventId,
        title: eventData.title,
        description: eventData.description,
        startDate: Timestamp.fromDate(eventData.startDate),
        endDate: Timestamp.fromDate(eventData.endDate),
        location: eventData.location,
        category: eventData.category,
        tags: eventData.tags,
        status: eventData.status,
        organizerId: user.uid,
        createdAt: now,
        updatedAt: now,
        attendeeCount: 0,
        sponsorshipPackages: eventData.sponsorshipPackages || [],
        requirements: eventData.requirements || {},
      };

      // Only add optional fields if they exist
      if (eventData.imageUrl) {
        newEventData.imageUrl = eventData.imageUrl;
      }
      if (eventData.website) {
        newEventData.website = eventData.website;
      }
      if (eventData.maxAttendees) {
        newEventData.maxAttendees = eventData.maxAttendees;
      }

      const eventDoc = doc(db, "events", eventId);
      await setDoc(eventDoc, newEventData);

      console.log("✅ useEvents: Event created successfully:", {
        eventId,
        sponsorshipPackagesCount: newEventData.sponsorshipPackages?.length || 0,
        sponsorshipPackages: newEventData.sponsorshipPackages,
      });

      const newEvent = newEventData as Event;

      setEvents((prev) => [newEvent, ...prev]);
      toast.success("Event created successfully!");
      return newEvent;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create event";
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    }
  };

  const updateEvent = async (eventData: UpdateEventData): Promise<boolean> => {
    if (!user) {
      toast.error("You must be logged in to update events");
      return false;
    }

    try {
      const { id, ...updateData } = eventData;
      const eventDoc = doc(db, "events", id);

      // Convert dates to Timestamps if present
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updatePayload: Record<string, any> = {
        ...updateData,
        updatedAt: Timestamp.now(),
      };

      if (updateData.startDate) {
        updatePayload.startDate = Timestamp.fromDate(updateData.startDate);
      }
      if (updateData.endDate) {
        updatePayload.endDate = Timestamp.fromDate(updateData.endDate);
      }

      await updateDoc(eventDoc, updatePayload);

      // Update local state
      setEvents((prev) =>
        prev.map((event) =>
          event.id === id ? { ...event, ...updatePayload } : event
        )
      );

      toast.success("Event updated successfully!");
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update event";
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    }
  };

  const deleteEvent = async (eventId: string): Promise<boolean> => {
    if (!user) {
      toast.error("You must be logged in to delete events");
      return false;
    }

    try {
      const eventDoc = doc(db, "events", eventId);
      await deleteDoc(eventDoc);

      setEvents((prev) => prev.filter((event) => event.id !== eventId));
      toast.success("Event deleted successfully!");
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete event";
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    }
  };

  const refreshEvents = useCallback(async () => {
    await fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    if (user) {
      fetchEvents();
    } else {
      setEvents([]);
      setLoading(false);
      setError(null);
    }
  }, [user, fetchEvents]);

  return {
    events,
    loading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
    refreshEvents,
  };
};
