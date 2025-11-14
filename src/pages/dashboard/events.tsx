import React, { useState } from "react";
import Head from "next/head";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { EventForm } from "@/components/EventForm";
import { useEvents, CreateEventData, UpdateEventData } from "@/hooks/useEvents";
import { Event } from "@/types";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Users,
  Calendar,
  MapPin,
  Grid3X3,
  CalendarDays,
  Send,
  Archive,
} from "lucide-react";
import toast from "react-hot-toast";
import { Timestamp } from "firebase/firestore";

const EventsDashboardPage: React.FC = () => {
  const { events, loading, createEvent, updateEvent, deleteEvent } =
    useEvents();
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [viewMode, setViewMode] = useState<"cards" | "calendar">("cards");

  const handleCreateEvent = async (data: CreateEventData) => {
    try {
      await createEvent(data);
      setShowForm(false);
      toast.success("Event created successfully!");
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const handleUpdateEvent = async (data: UpdateEventData) => {
    if (!editingEvent?.id) return;

    try {
      await updateEvent({ ...data, id: editingEvent.id });
      setEditingEvent(null);
      toast.success("Event updated successfully!");
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEvent(eventId);
        toast.success("Event deleted successfully!");
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    }
  };

  const handlePublishEvent = async (eventId: string, currentStatus: string) => {
    const newStatus = currentStatus === "published" ? "draft" : "published";
    const actionText = newStatus === "published" ? "publish" : "unpublish";

    // Find the event to validate before publishing
    const event = events.find((e) => e.id === eventId);

    if (newStatus === "published" && event) {
      // Validate event has required information for publishing
      const errors = [];

      if (!event.title?.trim()) errors.push("Title is required");
      if (!event.description?.trim()) errors.push("Description is required");
      if (!event.startDate) errors.push("Start date is required");
      if (!event.location) errors.push("Location is required");
      if (!event.category?.trim()) errors.push("Category is required");
      if (
        !event.sponsorshipPackages ||
        event.sponsorshipPackages.length === 0
      ) {
        errors.push("At least one sponsorship package is required");
      }

      if (errors.length > 0) {
        toast.error(`Cannot publish event. Missing: ${errors.join(", ")}`);
        return;
      }
    }

    if (window.confirm(`Are you sure you want to ${actionText} this event?`)) {
      try {
        await updateEvent({ id: eventId, status: newStatus });
        toast.success(`Event ${actionText}ed successfully!`);

        if (newStatus === "published") {
          toast.success("🎉 Your event is now live and visible to sponsors!");
        }
      } catch (error) {
        console.error(`Error ${actionText}ing event:`, error);
        toast.error(`Failed to ${actionText} event`);
      }
    }
  };

  const formatDate = (timestamp: Timestamp | null) => {
    if (!timestamp) return "No date";
    try {
      return new Date(timestamp.toDate()).toLocaleDateString();
    } catch {
      return "Invalid date";
    }
  };

  const getLocationString = (location: Event["location"]) => {
    if (typeof location === "string") return location;
    if (location?.venue) return `${location.venue}, ${location.city}`;
    return "No location";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Calendar view component
  const CalendarView = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const calendarEvents = React.useMemo(() => {
      const eventsByDate: { [key: string]: Event[] } = {};
      events.forEach((event) => {
        if (event.startDate) {
          const dateKey = new Date(event.startDate.toDate()).toDateString();
          if (!eventsByDate[dateKey]) {
            eventsByDate[dateKey] = [];
          }
          eventsByDate[dateKey].push(event);
        }
      });
      return eventsByDate;
    }, []);

    const getDaysInMonth = (date: Date) => {
      const year = date.getFullYear();
      const month = date.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      const startingDayOfWeek = firstDay.getDay();

      const days = [];

      // Add empty cells for days before the first day of the month
      for (let i = 0; i < startingDayOfWeek; i++) {
        days.push(null);
      }

      // Add days of the month
      for (let day = 1; day <= daysInMonth; day++) {
        days.push(new Date(year, month, day));
      }

      return days;
    };

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const navigateMonth = (direction: "prev" | "next") => {
      setCurrentDate((prev) => {
        const newDate = new Date(prev);
        if (direction === "prev") {
          newDate.setMonth(newDate.getMonth() - 1);
        } else {
          newDate.setMonth(newDate.getMonth() + 1);
        }
        return newDate;
      });
    };

    const days = getDaysInMonth(currentDate);

    return (
      <div className="bg-white rounded-lg shadow">
        {/* Calendar Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="text-blue-600 border-blue-300 hover:bg-blue-50"
              onClick={() => navigateMonth("prev")}
            >
              ←
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-green-600 border-green-300 hover:bg-green-50"
              onClick={() => setCurrentDate(new Date())}
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-blue-600 border-blue-300 hover:bg-blue-50"
              onClick={() => navigateMonth("next")}
            >
              →
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="p-4">
          {/* Week days header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="p-2 text-center text-sm font-medium text-gray-500"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const dateKey = day?.toDateString();
              const dayEvents = dateKey ? calendarEvents[dateKey] || [] : [];

              return (
                <div
                  key={index}
                  className={`min-h-24 p-1 border border-gray-200 ${
                    day ? "bg-white hover:bg-gray-50" : "bg-gray-50"
                  } ${
                    day && day.toDateString() === new Date().toDateString()
                      ? "bg-blue-50 border-blue-200"
                      : ""
                  }`}
                >
                  {day && (
                    <>
                      <div className="text-sm font-medium text-gray-900 mb-1">
                        {day.getDate()}
                      </div>
                      {dayEvents.map((event) => (
                        <div
                          key={event.id}
                          className={`text-xs p-1 rounded mb-1 truncate cursor-pointer hover:opacity-80 ${
                            event.status === "published"
                              ? "bg-green-100 text-green-800"
                              : event.status === "draft"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                          title={`${event.title} - ${getLocationString(
                            event.location
                          )}`}
                          onClick={() => setEditingEvent(event)}
                        >
                          {event.title}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Show loading state
  if (loading) {
    return (
      <ProtectedRoute requireAuth={true} allowedRoles={["organizer"]}>
        <DashboardLayout title="My Events">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <span className="ml-4 text-gray-600">Loading events...</span>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  // Show form when creating or editing
  if (showForm || editingEvent) {
    return (
      <ProtectedRoute requireAuth={true} allowedRoles={["organizer"]}>
        <Head>
          <title>
            {editingEvent ? "Edit Event" : "Create Event"} - EventSponsor
          </title>
        </Head>
        <DashboardLayout title={editingEvent ? "Edit Event" : "Create Event"}>
          <EventForm
            event={editingEvent || undefined}
            onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent}
            onCancel={() => {
              setShowForm(false);
              setEditingEvent(null);
            }}
            isSubmitting={false}
          />
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireAuth={true} allowedRoles={["organizer"]}>
      <Head>
        <title>My Events - EventSponsor</title>
        <meta name="description" content="Manage your events" />
      </Head>
      <DashboardLayout title="My Events">
        <div className="space-y-6">
          {/* Header with action button and view toggle */}
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-600">
                Manage your events and track their performance
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {/* View Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("cards")}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === "cards"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4 mr-2" />
                  Cards
                </button>
                <button
                  onClick={() => setViewMode("calendar")}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === "calendar"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <CalendarDays className="w-4 h-4 mr-2" />
                  Calendar
                </button>
              </div>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create New Event
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Calendar className="w-8 h-8 mr-4 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">Total Events</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {events.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="w-8 h-8 mr-4 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">Max Capacity</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {events.reduce(
                        (sum, event) => sum + (event.maxAttendees || 0),
                        0
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Eye className="w-8 h-8 mr-4 text-purple-500" />
                  <div>
                    <p className="text-sm text-gray-600">Published Events</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {
                        events.filter((event) => event.status === "published")
                          .length
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <MapPin className="w-8 h-8 mr-4 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-600">Draft Events</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {
                        events.filter((event) => event.status === "draft")
                          .length
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Events Display */}
          {viewMode === "calendar" ? (
            <CalendarView />
          ) : (
            <div className="space-y-4">
              {events.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No events yet
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Get started by creating your first event
                    </p>
                    <Button onClick={() => setShowForm(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Event
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                events.map((event) => (
                  <Card key={event.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {event.title}
                              </h3>
                              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                <span className="flex items-center">
                                  <MapPin className="w-4 h-4 mr-1" />
                                  {getLocationString(event.location)}
                                </span>
                                <span className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  {formatDate(event.startDate)}
                                </span>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                    event.status
                                  )}`}
                                >
                                  {event.status.charAt(0).toUpperCase() +
                                    event.status.slice(1)}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-8 mt-4 text-sm">
                            <div>
                              <span className="text-gray-600">
                                Max Capacity:{" "}
                              </span>
                              <span className="font-medium text-gray-900">
                                {event.maxAttendees || "Unlimited"}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">Category: </span>
                              <span className="font-medium text-gray-900">
                                {event.category}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">Tags: </span>
                              <span className="font-medium text-gray-900">
                                {event.tags.length > 0
                                  ? event.tags.join(", ")
                                  : "None"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-blue-600 hover:bg-blue-50"
                            onClick={() => setEditingEvent(event)}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className={
                              event.status === "published"
                                ? "text-orange-600 hover:bg-orange-50"
                                : "text-green-600 hover:bg-green-50"
                            }
                            onClick={() =>
                              handlePublishEvent(event.id!, event.status)
                            }
                          >
                            {event.status === "published" ? (
                              <>
                                <Archive className="w-4 h-4 mr-1" />
                                Unpublish
                              </>
                            ) : (
                              <>
                                <Send className="w-4 h-4 mr-1" />
                                Publish
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:bg-red-50"
                            onClick={() => handleDeleteEvent(event.id!)}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

          {/* Empty state */}
          {events.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No events yet
              </h3>
              <p className="text-gray-600 mb-6">
                Create your first event to start connecting with sponsors
              </p>
              <Button onClick={() => setShowForm(true)}>
                Create Your First Event
              </Button>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default EventsDashboardPage;
