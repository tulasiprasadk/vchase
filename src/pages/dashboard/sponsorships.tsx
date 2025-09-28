import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { useSponsorships } from "@/hooks/useSponsorships";
import { useSponsorEvents } from "@/hooks/useSponsorEvents";
import { useSponsorshipEnquiries } from "@/hooks/useSponsorshipEnquiries";

import { useAuth } from "@/context/AuthContext";
import { Event, SponsorshipPackage } from "@/types";
import toast from "react-hot-toast";
import { useMessaging } from "@/hooks/useMessaging";

// Create a stable empty filters object to prevent re-renders
const EMPTY_FILTERS = {};

const SponsorshipsDashboardPage: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { sponsorships, loading: sponsorshipsLoading } = useSponsorships();
  const { events, loading: eventsLoading } = useSponsorEvents(EMPTY_FILTERS);
  const { enquiries, submitEnquiry, fetchEnquiries } =
    useSponsorshipEnquiries();
  const { findOrCreateChatForEnquiry, sendMessage } = useMessaging();

  const [activeTab, setActiveTab] = useState<
    "current" | "submitted" | "discover"
  >("discover");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedPackage, setSelectedPackage] =
    useState<SponsorshipPackage | null>(null);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [enquiryMessage, setEnquiryMessage] = useState("");
  const [companyInfo, setCompanyInfo] = useState("");
  const [submittingEnquiry, setSubmittingEnquiry] = useState(false);

  // Add states for direct messaging
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [selectedEventForMessage, setSelectedEventForMessage] =
    useState<Event | null>(null);
  const [sendingMessage, setSendingMessage] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "active":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-purple-100 text-purple-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Fetch enquiries when component mounts
  useEffect(() => {
    if (user) {
      const unsubscribe = fetchEnquiries();
      return unsubscribe;
    }
  }, [user, fetchEnquiries]);

  const handleSendEnquiry = async (event: Event, pkg: SponsorshipPackage) => {
    if (!user) {
      toast.error("Please log in to send enquiry");
      return;
    }

    setSelectedEvent(event);
    setSelectedPackage(pkg);
    setShowEnquiryModal(true);
  };

  const handleEnquirySubmit = async () => {
    if (!selectedEvent || !selectedPackage || !user) return;

    setSubmittingEnquiry(true);
    try {
      const enquiryData = {
        eventId: selectedEvent.id!,
        eventTitle: selectedEvent.title,
        packageId: selectedPackage.id,
        packageName: selectedPackage.name,
        companyName: companyInfo,
        contactEmail: user.email || "",
        message: enquiryMessage,
      };

      await submitEnquiry(enquiryData);

      setShowEnquiryModal(false);
      setSelectedEvent(null);
      setSelectedPackage(null);
      setEnquiryMessage("");
      setCompanyInfo("");
      toast.success("Enquiry submitted successfully!");
    } catch {
      toast.error("Failed to submit enquiry");
    } finally {
      setSubmittingEnquiry(false);
    }
  };

  const handleMessageOrganizerByEvent = async (
    eventId: string,
    eventTitle: string,
    enquiryId?: string
  ) => {
    if (!user) {
      toast.error("Please log in to send messages");
      return;
    }

    try {
      // Find the event to get organizer information
      const event = events.find((e) => e.id === eventId);
      if (!event) {
        toast.error("Event information not found");
        console.error("Event not found with ID:", eventId);
        console.log(
          "Available events:",
          events.map((e) => ({ id: e.id, title: e.title }))
        );
        return;
      }

      if (!event.organizerId) {
        toast.error("Event organizer information not available");
        console.error("Event missing organizerId:", event);
        return;
      }

      console.log("Creating chat with organizer:", {
        eventId,
        organizerId: event.organizerId,
        sponsorId: user.uid,
        eventTitle,
      });

      // Show loading toast while creating chat
      const loadingToast = toast.loading("Creating conversation...");

      const chatId = await findOrCreateChatForEnquiry(
        event.organizerId,
        user.uid,
        "Event Organizer", // Default name - will be fetched by the messaging system
        user.displayName || "Sponsor",
        "", // Organizer email - will be fetched by the messaging system
        user.email || "",
        enquiryId || "",
        eventTitle,
        eventId // Pass the eventId as well
      );

      toast.dismiss(loadingToast);
      console.log("Chat created successfully:", chatId);
      toast.success("Conversation started successfully!");

      // Navigate to messages page with the chat opened
      router.push(`/dashboard/messages?chat=${chatId}`);
    } catch (error) {
      console.error("Error creating chat:", error);

      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes("User not authenticated")) {
          toast.error("Please log in to send messages");
        } else if (error.message.includes("Could not fetch user information")) {
          toast.error(
            "Could not find organizer information. Please try again later."
          );
        } else {
          toast.error(`Failed to start conversation: ${error.message}`);
        }
      } else {
        toast.error("Failed to start conversation. Please try again.");
      }
    }
  };

  // Direct message sending function for organizers
  const handleDirectMessageOrganizer = async (event: Event) => {
    if (!user) {
      toast.error("Please log in to send messages");
      return;
    }

    setSelectedEventForMessage(event);
    setShowMessageModal(true);
  };

  const sendDirectMessage = async () => {
    if (!selectedEventForMessage || !messageText.trim() || !user) return;

    setSendingMessage(true);
    try {
      // Create or find chat first
      const chatId = await findOrCreateChatForEnquiry(
        selectedEventForMessage.organizerId,
        user.uid,
        "Event Organizer",
        user.displayName || "Sponsor",
        "",
        user.email || "",
        "",
        selectedEventForMessage.title,
        selectedEventForMessage.id
      );

      // Send the actual message
      await sendMessage(chatId, messageText.trim());

      toast.success("Message sent successfully!");

      // Reset form and close modal
      setMessageText("");
      setShowMessageModal(false);
      setSelectedEventForMessage(null);

      // Navigate to messages page
      router.push(`/dashboard/messages?chat=${chatId}`);
    } catch (error) {
      console.error("Error sending direct message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSendingMessage(false);
    }
  };

  const activeSponsorship = sponsorships.filter(
    (s) => s.status === "active" || s.status === "approved"
  );
  const totalInvestment = sponsorships.reduce((sum, s) => sum + s.amount, 0);
  const totalReach = sponsorships.reduce((sum, s) => sum + s.reach, 0);
  const totalLeads = sponsorships.reduce((sum, s) => sum + s.leads, 0);

  // Show loading state
  if (sponsorshipsLoading) {
    return (
      <ProtectedRoute requireAuth={true} allowedRoles={["sponsor"]}>
        <DashboardLayout title="Sponsorships">
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-600">Loading sponsorships...</div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireAuth={true} allowedRoles={["sponsor"]}>
      <Head>
        <title>Sponsorships - EventSponsor</title>
        <meta
          name="description"
          content="Manage your sponsorships and discover new opportunities"
        />
      </Head>
      <DashboardLayout title="Sponsorships">
        <div className="space-y-6">
          {/* Header with Stats */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Your Sponsorship Hub
                </h1>
                <p className="text-gray-600">
                  Manage current sponsorships and discover new opportunities
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="text-2xl mr-3">💳</div>
                  <div>
                    <p className="text-sm text-gray-600">Active Sponsorships</p>
                    <p className="text-xl font-bold text-gray-900">
                      {activeSponsorship.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="text-2xl mr-3">💰</div>
                  <div>
                    <p className="text-sm text-gray-600">Total Investment</p>
                    <p className="text-xl font-bold text-gray-900">
                      ${totalInvestment.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="text-2xl mr-3">📊</div>
                  <div>
                    <p className="text-sm text-gray-600">Total Reach</p>
                    <p className="text-xl font-bold text-gray-900">
                      {totalReach.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="text-2xl mr-3">🎯</div>
                  <div>
                    <p className="text-sm text-gray-600">Total Leads</p>
                    <p className="text-xl font-bold text-gray-900">
                      {totalLeads}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab("discover")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "discover"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  🔍 Discover Events ({events.length})
                </button>
                <button
                  onClick={() => setActiveTab("current")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "current"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  📋 My Sponsorships ({sponsorships.length})
                </button>
                <button
                  onClick={() => setActiveTab("submitted")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "submitted"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  📤 Submitted ({enquiries.length})
                </button>
              </nav>
            </div>

            <div className="p-6">
              {/* Current Sponsorships Tab */}
              {activeTab === "current" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Current Sponsorships
                    </h2>
                  </div>

                  {sponsorships.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">💳</div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No sponsorships yet
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Start sponsoring events to grow your brand and reach new
                        audiences
                      </p>
                      <Button onClick={() => setActiveTab("discover")}>
                        Browse Available Events
                      </Button>
                    </div>
                  ) : (
                    sponsorships.map((sponsorship) => (
                      <Card key={sponsorship.id}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-4">
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900">
                                    {sponsorship.eventTitle}
                                  </h3>
                                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                    <span>📦 {sponsorship.packageName}</span>
                                    <span>📍 {sponsorship.location}</span>
                                    <span>
                                      📅{" "}
                                      {sponsorship.eventDate
                                        .toDate()
                                        .toLocaleDateString()}
                                    </span>
                                    <span
                                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                        sponsorship.status
                                      )}`}
                                    >
                                      {sponsorship.status
                                        .charAt(0)
                                        .toUpperCase() +
                                        sponsorship.status.slice(1)}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center space-x-8 mt-4 text-sm">
                                <div>
                                  <span className="text-gray-600">
                                    Investment:{" "}
                                  </span>
                                  <span className="font-medium text-green-600">
                                    ${sponsorship.amount.toLocaleString()}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Reach: </span>
                                  <span className="font-medium">
                                    {sponsorship.reach.toLocaleString()}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Leads: </span>
                                  <span className="font-medium">
                                    {sponsorship.leads}
                                  </span>
                                </div>
                                {sponsorship.reach > 0 &&
                                  sponsorship.leads > 0 && (
                                    <div>
                                      <span className="text-gray-600">
                                        Cost per Lead:{" "}
                                      </span>
                                      <span className="font-medium">
                                        $
                                        {(
                                          sponsorship.amount / sponsorship.leads
                                        ).toFixed(2)}
                                      </span>
                                    </div>
                                  )}
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="sm">
                                📊 Analytics
                              </Button>
                              <Button variant="outline" size="sm">
                                👁️ View
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleMessageOrganizerByEvent(
                                    sponsorship.eventId,
                                    sponsorship.eventTitle,
                                    sponsorship.id
                                  )
                                }
                                className="text-blue-600 border-blue-200 hover:bg-blue-50"
                              >
                                💬 Message Organizer
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              )}

              {/* Submitted Enquiries Tab */}
              {activeTab === "submitted" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Submitted Sponsorship Enquiries
                    </h2>
                    <p className="text-sm text-gray-600">
                      Track your sponsorship applications and their status
                    </p>
                  </div>

                  {enquiries.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">📋</div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No enquiries submitted yet
                      </h3>
                      <p className="text-gray-600">
                        Your sponsorship applications will appear here once
                        submitted
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {enquiries.map((enquiry) => (
                        <Card key={enquiry.id}>
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                  {enquiry.eventTitle}
                                </h3>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                  <span>
                                    📅{" "}
                                    {enquiry.submittedAt
                                      .toDate()
                                      .toLocaleDateString()}
                                  </span>
                                  <span>💰 {enquiry.packageName}</span>
                                  {enquiry.proposedAmount && (
                                    <span>
                                      💵 $
                                      {enquiry.proposedAmount.toLocaleString()}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    enquiry.status === "pending"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : enquiry.status === "accepted"
                                      ? "bg-green-100 text-green-800"
                                      : enquiry.status === "rejected"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {enquiry.status === "pending" && "⏳ Pending"}
                                  {enquiry.status === "accepted" &&
                                    "✅ Accepted"}
                                  {enquiry.status === "rejected" &&
                                    "❌ Rejected"}
                                  {enquiry.status === "under_review" &&
                                    "🔍 Under Review"}
                                </span>
                              </div>
                            </div>

                            {enquiry.message && (
                              <div className="mb-4">
                                <h4 className="text-sm font-medium text-gray-900 mb-2">
                                  Your Message:
                                </h4>
                                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                                  {enquiry.message}
                                </p>
                              </div>
                            )}

                            {enquiry.organizerResponse && (
                              <div className="mb-4">
                                <h4 className="text-sm font-medium text-gray-900 mb-2">
                                  Organizer Response:
                                </h4>
                                <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                                  {enquiry.organizerResponse}
                                </p>
                                {enquiry.responseDate && (
                                  <p className="text-xs text-gray-500 mt-2">
                                    Responded on{" "}
                                    {enquiry.responseDate
                                      .toDate()
                                      .toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                            )}

                            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span>
                                  Enquiry ID:{" "}
                                  {enquiry.id ? enquiry.id.slice(-8) : "N/A"}
                                </span>
                                <span>Company: {enquiry.companyName}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {enquiry.status === "accepted" && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-green-600 border-green-200 hover:bg-green-50"
                                  >
                                    💰 Proceed to Payment
                                  </Button>
                                )}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleMessageOrganizerByEvent(
                                      enquiry.eventId,
                                      enquiry.eventTitle,
                                      enquiry.id
                                    )
                                  }
                                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                >
                                  💬 Message Organizer
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    // Could add a view details modal here
                                    console.log(
                                      "View enquiry details:",
                                      enquiry.id
                                    );
                                  }}
                                >
                                  👁️ View Details
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Discover Events Tab */}
              {activeTab === "discover" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Available Events to Sponsor
                    </h2>
                    <p className="text-sm text-gray-600">
                      Find perfect sponsorship opportunities for your brand
                    </p>
                  </div>

                  {eventsLoading ? (
                    <div className="text-center py-12">
                      <div className="text-gray-600">Loading events...</div>
                    </div>
                  ) : events.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">🔍</div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No events available
                      </h3>
                      <p className="text-gray-600">
                        Check back later for new sponsorship opportunities
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {events.map((event) => (
                        <Card key={event.id}>
                          <CardContent className="p-6">
                            <div className="mb-4">
                              <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {event.title}
                              </h3>
                              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                <span>
                                  📅{" "}
                                  {event.startDate
                                    .toDate()
                                    .toLocaleDateString()}
                                </span>
                                <span>
                                  📍 {event.location.city},{" "}
                                  {event.location.country}
                                </span>
                                <span>
                                  👥{" "}
                                  {event.attendeeCount
                                    ? event.attendeeCount.toLocaleString()
                                    : "TBD"}{" "}
                                  attendees
                                </span>
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                  {event.category}
                                </span>
                              </div>
                            </div>

                            <p className="text-gray-700 mb-4 line-clamp-2">
                              {event.description}
                            </p>

                            <div className="space-y-3">
                              <h4 className="font-medium text-gray-900">
                                Sponsorship Packages:
                              </h4>
                              {event.sponsorshipPackages &&
                                event.sponsorshipPackages.map((pkg) => (
                                  <div
                                    key={pkg.id}
                                    className="border border-gray-200 rounded-lg p-4"
                                  >
                                    <div className="flex justify-between items-start mb-2">
                                      <div>
                                        <h5 className="font-medium text-gray-900">
                                          {pkg.name}
                                        </h5>
                                        <p className="text-2xl font-bold text-green-600">
                                          ${pkg.price.toLocaleString()}
                                        </p>
                                      </div>
                                      <div className="flex space-x-2">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() =>
                                            handleDirectMessageOrganizer(event)
                                          }
                                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                        >
                                          💬 Message
                                        </Button>
                                        <Button
                                          size="sm"
                                          onClick={() =>
                                            handleSendEnquiry(event, pkg)
                                          }
                                        >
                                          📧 Send Enquiry
                                        </Button>
                                      </div>
                                    </div>

                                    <div className="space-y-1">
                                      {pkg.benefits &&
                                        pkg.benefits.map((benefit, index) => (
                                          <div
                                            key={index}
                                            className="flex items-center text-sm text-gray-600"
                                          >
                                            <span className="text-green-500 mr-2">
                                              ✓
                                            </span>
                                            {benefit}
                                          </div>
                                        ))}
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ROI Summary - only show when on current sponsorships tab */}
          {activeTab === "current" && activeSponsorship.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  📈 ROI Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {totalReach > 0
                        ? `$${((totalInvestment / totalReach) * 1000).toFixed(
                            2
                          )}`
                        : "N/A"}
                    </div>
                    <div className="text-sm text-gray-600">
                      Cost per 1K Impressions
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {totalLeads > 0
                        ? `$${(totalInvestment / totalLeads).toFixed(2)}`
                        : "N/A"}
                    </div>
                    <div className="text-sm text-gray-600">Cost per Lead</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      324%
                    </div>
                    <div className="text-sm text-gray-600">Estimated ROI</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Enquiry Modal */}
        {showEnquiryModal && selectedEvent && selectedPackage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Send Sponsorship Enquiry
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {selectedEvent.title} - {selectedPackage.name}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowEnquiryModal(false)}
                  >
                    ✕
                  </Button>
                </div>

                <div className="space-y-4">
                  {/* Package Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">
                      Package Details:
                    </h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Package: {selectedPackage.name}</div>
                      <div>
                        Price: ${selectedPackage.price.toLocaleString()}
                      </div>
                      <div>Event: {selectedEvent.title}</div>
                      <div>
                        Date:{" "}
                        {selectedEvent.startDate.toDate().toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Company Information */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Information *
                    </label>
                    <textarea
                      value={companyInfo}
                      onChange={(e) => setCompanyInfo(e.target.value)}
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tell us about your company, industry, and why you're interested in sponsoring this event..."
                      required
                    />
                  </div>

                  {/* Custom Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Message
                    </label>
                    <textarea
                      value={enquiryMessage}
                      onChange={(e) => setEnquiryMessage(e.target.value)}
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Any specific requirements, questions, or additional information you'd like to share..."
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4 pt-4">
                    <Button
                      onClick={handleEnquirySubmit}
                      disabled={submittingEnquiry || !companyInfo.trim()}
                      className="flex-1"
                    >
                      {submittingEnquiry ? "Sending..." : "📧 Send Enquiry"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowEnquiryModal(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Direct Message Modal */}
        {showMessageModal && selectedEventForMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Send Message to Organizer
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {selectedEventForMessage.title}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowMessageModal(false);
                      setMessageText("");
                      setSelectedEventForMessage(null);
                    }}
                  >
                    ✕
                  </Button>
                </div>

                <div className="space-y-4">
                  {/* Event Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">
                      Event Details:
                    </h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Event: {selectedEventForMessage.title}</div>
                      <div>
                        Date:{" "}
                        {selectedEventForMessage.startDate
                          .toDate()
                          .toLocaleDateString()}
                      </div>
                      <div>Category: {selectedEventForMessage.category}</div>
                    </div>
                  </div>

                  {/* Message Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Message *
                    </label>
                    <textarea
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      rows={6}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Type your message to the event organizer here..."
                      required
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4 pt-4">
                    <Button
                      onClick={sendDirectMessage}
                      disabled={sendingMessage || !messageText.trim()}
                      className="flex-1"
                    >
                      {sendingMessage ? "Sending..." : "💬 Send Message"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowMessageModal(false);
                        setMessageText("");
                        setSelectedEventForMessage(null);
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default SponsorshipsDashboardPage;
