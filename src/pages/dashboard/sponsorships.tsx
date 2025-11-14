import React, { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { useSponsorships } from "@/hooks/useSponsorships";
import { useSponsorEvents } from "@/hooks/useSponsorEvents";
import { useSponsorshipEnquiries } from "@/hooks/useSponsorshipEnquiries";
import {
  CreditCard,
  DollarSign,
  BarChart3,
  Target,
  Search,
  ClipboardList,
  Send,
  Package,
  MapPin,
  Calendar,
  Eye,
  MessageCircle,
  CheckCircle,
  XCircle,
  Clock,
  Upload,
  Users,
  Mail,
  Check,
  X,
  TrendingUp,
  PartyPopper,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { Event, SponsorshipPackage } from "@/types";
import { SponsorshipEnquiry } from "@/hooks/useSponsorshipEnquiries";
import toast from "react-hot-toast";
import { useMessaging } from "@/hooks/useMessaging";

// Create a stable empty filters object to prevent re-renders
const EMPTY_FILTERS = {};

const SponsorshipsDashboardPage: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { sponsorships, loading: sponsorshipsLoading } = useSponsorships();
  const { events, loading: eventsLoading } = useSponsorEvents(EMPTY_FILTERS);
  const { enquiries, submitEnquiry, fetchEnquiries, uploadPaymentProof } =
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

  // Add states for payment flow
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedEnquiryForPayment, setSelectedEnquiryForPayment] =
    useState<SponsorshipEnquiry | null>(null);
  const [uploadingPayment, setUploadingPayment] = useState(false);
  const [paymentProofUrl, setPaymentProofUrl] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "active":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "payment_pending":
        return "bg-orange-100 text-orange-800";
      case "payment_uploaded":
        return "bg-blue-100 text-blue-800";
      case "payment_verified":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Handle opening payment upload modal
  const handleUploadPaymentProof = (enquiry: SponsorshipEnquiry) => {
    setSelectedEnquiryForPayment(enquiry);
    setShowPaymentModal(true);
  };

  // Handle payment proof upload
  const handlePaymentProofUpload = async (uploadResult: {
    url: string;
    original_filename?: string;
  }) => {
    if (!selectedEnquiryForPayment || !uploadResult.url) return;

    setUploadingPayment(true);
    try {
      await uploadPaymentProof(
        selectedEnquiryForPayment.id!,
        uploadResult.url,
        uploadResult.original_filename || "payment_proof"
      );

      setPaymentProofUrl(uploadResult.url);
      toast.success("Payment proof uploaded successfully!");

      // Close modal
      setShowPaymentModal(false);
      setSelectedEnquiryForPayment(null);
      setPaymentProofUrl("");
    } catch (error) {
      console.error("Error uploading payment proof:", error);
      toast.error("Failed to upload payment proof");
    } finally {
      setUploadingPayment(false);
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

  // Alternative function for messaging organizer when we have enquiry data
  const handleMessageOrganizerFromEnquiry = async (
    enquiry: SponsorshipEnquiry
  ) => {
    if (!user) {
      toast.error("Please log in to send messages");
      return;
    }

    try {
      console.log("Creating chat from enquiry:", enquiry);

      // Show loading toast while creating chat
      const loadingToast = toast.loading("Creating conversation...");

      // Try to get event and organizer info from Firestore
      const { doc, getDoc } = await import("firebase/firestore");
      const { db } = await import("@/lib/firebase/config");

      const eventDoc = await getDoc(doc(db, "events", enquiry.eventId));
      if (!eventDoc.exists()) {
        toast.dismiss(loadingToast);
        toast.error("Event not found");
        return;
      }

      const eventData = eventDoc.data();
      if (!eventData.organizerId) {
        toast.dismiss(loadingToast);
        toast.error("Event organizer information not available");
        return;
      }

      const chatId = await findOrCreateChatForEnquiry(
        eventData.organizerId,
        user.uid,
        "Event Organizer", // Default name - will be fetched by the messaging system
        user.displayName || "Sponsor",
        "", // Organizer email - will be fetched by the messaging system
        user.email || "",
        enquiry.id || "",
        enquiry.eventTitle,
        enquiry.eventId
      );

      toast.dismiss(loadingToast);
      console.log("Chat created successfully:", chatId);
      toast.success("Conversation started successfully!");

      // Navigate to messages page with the chat opened
      router.push(`/dashboard/messages?chat=${chatId}`);
    } catch (error) {
      console.error("Error creating chat from enquiry:", error);

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
      // First try to find the event in the loaded events
      let event = events.find((e) => e.id === eventId);

      // If event not found in loaded events, try to fetch it directly from Firestore
      if (!event) {
        console.log(
          "Event not found in loaded events, fetching from Firestore..."
        );
        try {
          const { doc, getDoc } = await import("firebase/firestore");
          const { db } = await import("@/lib/firebase/config");

          const eventDoc = await getDoc(doc(db, "events", eventId));
          if (eventDoc.exists()) {
            event = { id: eventDoc.id, ...eventDoc.data() } as Event;
            console.log("Event fetched from Firestore:", event);
          }
        } catch (fetchError) {
          console.error("Error fetching event from Firestore:", fetchError);
        }
      }

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
    (s) =>
      s.status === "active" ||
      s.status === "approved" ||
      s.status === "completed"
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
                  <div className="text-2xl mr-3 text-blue-600">
                    <CreditCard size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">My Sponsorships</p>
                    <p className="text-xl font-bold text-gray-900">
                      {activeSponsorship.length +
                        enquiries.filter((e) => e.status === "completed")
                          .length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="text-2xl mr-3 text-green-600">
                    <DollarSign size={24} />
                  </div>
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
                  <div className="text-2xl mr-3 text-purple-600">
                    <BarChart3 size={24} />
                  </div>
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
                  <div className="text-2xl mr-3 text-orange-600">
                    <Target size={24} />
                  </div>
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
                  <Search size={16} className="inline mr-1" />
                  Discover Events (
                  {(() => {
                    const availableEvents = events.filter((event) => {
                      const isAlreadySponsor =
                        event.sponsors &&
                        event.sponsors.some(
                          (sponsor) => sponsor.sponsorId === user?.uid
                        );
                      const hasPendingEnquiry = enquiries.some(
                        (enquiry) => enquiry.eventId === event.id
                      );
                      return !isAlreadySponsor && !hasPendingEnquiry;
                    });
                    return availableEvents.length;
                  })()}
                  )
                </button>
                <button
                  onClick={() => setActiveTab("current")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "current"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <ClipboardList size={16} className="inline mr-1" />
                  My Sponsorships (
                  {sponsorships.length +
                    enquiries.filter((e) => e.status === "completed").length}
                  )
                </button>
                <button
                  onClick={() => setActiveTab("submitted")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "submitted"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Send size={16} className="inline mr-1" />
                  Submitted (
                  {enquiries.filter((e) => e.status !== "completed").length})
                </button>
              </nav>
            </div>

            <div className="p-6">
              {/* Current Sponsorships Tab */}
              {activeTab === "current" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900">
                      My Sponsorships
                    </h2>
                  </div>

                  {(() => {
                    const completedEnquiries = enquiries.filter(
                      (enquiry) => enquiry.status === "completed"
                    );
                    const totalItems =
                      sponsorships.length + completedEnquiries.length;

                    if (totalItems === 0) {
                      return (
                        <div className="text-center py-12">
                          <div className="text-6xl mb-4 text-gray-400 flex justify-center">
                            <CreditCard size={64} />
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No sponsorships yet
                          </h3>
                          <p className="text-gray-600 mb-6">
                            Start sponsoring events to grow your brand and reach
                            new audiences
                          </p>
                          <Button onClick={() => setActiveTab("discover")}>
                            Browse Available Events
                          </Button>
                        </div>
                      );
                    }

                    return (
                      <div className="space-y-4">
                        {/* Show completed enquiries first */}
                        {completedEnquiries.map((enquiry) => (
                          <Card
                            key={`completed-${enquiry.id}`}
                            className="hover:shadow-md transition-shadow"
                          >
                            <CardContent className="p-6">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-4">
                                    <div>
                                      <h3 className="text-lg font-semibold text-gray-900">
                                        {enquiry.eventTitle}
                                      </h3>
                                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                        <span className="flex items-center">
                                          <Package size={14} className="mr-1" />
                                          {enquiry.packageName}
                                        </span>
                                        {enquiry.proposedAmount && (
                                          <span className="flex items-center">
                                            <DollarSign
                                              size={14}
                                              className="mr-1"
                                            />
                                            {enquiry.proposedAmount.toLocaleString()}
                                          </span>
                                        )}
                                        <span
                                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                            "completed"
                                          )}`}
                                        >
                                          <CheckCircle
                                            size={14}
                                            className="mr-1"
                                          />
                                          Completed
                                        </span>
                                      </div>
                                      {enquiry.organizerResponse && (
                                        <p className="text-sm text-gray-600 mt-2">
                                          Organizer: {enquiry.organizerResponse}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}

                        {/* Show regular sponsorships */}
                        {sponsorships.map((sponsorship) => (
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
                                        <span className="flex items-center">
                                          <Package size={14} className="mr-1" />
                                          {sponsorship.packageName}
                                        </span>
                                        <span className="flex items-center">
                                          <MapPin size={14} className="mr-1" />
                                          {sponsorship.location}
                                        </span>
                                        <span className="flex items-center">
                                          <Calendar
                                            size={14}
                                            className="mr-1"
                                          />
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
                                      <span className="text-gray-600">
                                        Reach:{" "}
                                      </span>
                                      <span className="font-medium">
                                        {sponsorship.reach.toLocaleString()}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">
                                        Leads:{" "}
                                      </span>
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
                                              sponsorship.amount /
                                              sponsorship.leads
                                            ).toFixed(2)}
                                          </span>
                                        </div>
                                      )}
                                  </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                  <Button variant="outline" size="sm">
                                    <BarChart3 size={16} className="mr-1" />
                                    Analytics
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <Eye size={16} className="mr-1" />
                                    View
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
                                    <MessageCircle size={16} className="mr-1" />
                                    Message Organizer
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    );
                  })()}
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

                  {enquiries.filter((e) => e.status !== "completed").length ===
                  0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4 text-gray-400 flex justify-center">
                        <ClipboardList size={64} />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No pending enquiries
                      </h3>
                      <p className="text-gray-600">
                        Your pending sponsorship applications will appear here.
                        Completed sponsorships are shown in &quot;My
                        Sponsorships&quot;.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {enquiries
                        .filter((enquiry) => enquiry.status !== "completed")
                        .map((enquiry) => (
                          <Card key={enquiry.id}>
                            <CardContent className="p-6">
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                    {enquiry.eventTitle}
                                  </h3>
                                  <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <span className="flex items-center">
                                      <Calendar size={14} className="mr-1" />
                                      {enquiry.submittedAt
                                        .toDate()
                                        .toLocaleDateString()}
                                    </span>
                                    <span className="flex items-center">
                                      <Package size={14} className="mr-1" />
                                      {enquiry.packageName}
                                    </span>
                                    {enquiry.proposedAmount && (
                                      <span className="flex items-center">
                                        <DollarSign
                                          size={14}
                                          className="mr-1"
                                        />
                                        {enquiry.proposedAmount.toLocaleString()}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                      enquiry.status
                                    )}`}
                                  >
                                    {enquiry.status === "pending" && (
                                      <>
                                        <Clock
                                          size={12}
                                          className="mr-1 inline"
                                        />
                                        Pending
                                      </>
                                    )}
                                    {enquiry.status === "accepted" && (
                                      <>
                                        <CheckCircle
                                          size={12}
                                          className="mr-1 inline"
                                        />
                                        Accepted
                                      </>
                                    )}
                                    {enquiry.status === "rejected" && (
                                      <>
                                        <XCircle
                                          size={12}
                                          className="mr-1 inline"
                                        />
                                        Rejected
                                      </>
                                    )}
                                    {enquiry.status === "under_review" && (
                                      <>
                                        <Search
                                          size={12}
                                          className="mr-1 inline"
                                        />
                                        Under Review
                                      </>
                                    )}
                                    {enquiry.status === "payment_pending" && (
                                      <>
                                        <DollarSign
                                          size={12}
                                          className="mr-1 inline"
                                        />
                                        Payment Required
                                      </>
                                    )}
                                    {enquiry.status === "payment_uploaded" && (
                                      <>
                                        <Upload
                                          size={12}
                                          className="mr-1 inline"
                                        />
                                        Payment Uploaded
                                      </>
                                    )}
                                    {enquiry.status === "payment_verified" && (
                                      <>
                                        <CheckCircle
                                          size={12}
                                          className="mr-1 inline"
                                        />
                                        Payment Verified
                                      </>
                                    )}
                                    {enquiry.status === "completed" && (
                                      <>
                                        <PartyPopper
                                          size={12}
                                          className="mr-1 inline"
                                        />
                                        Completed
                                      </>
                                    )}
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
                                  {/* Payment Flow Actions */}
                                  {enquiry.status === "accepted" && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        handleUploadPaymentProof(enquiry)
                                      }
                                      className="text-green-600 border-green-200 hover:bg-green-50"
                                    >
                                      <DollarSign size={16} className="mr-1" />
                                      Upload Payment Proof
                                    </Button>
                                  )}

                                  {enquiry.status === "payment_uploaded" && (
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm text-blue-600 flex items-center">
                                        <CheckCircle
                                          size={16}
                                          className="mr-1"
                                        />
                                        Payment proof uploaded - Awaiting
                                        verification
                                      </span>
                                    </div>
                                  )}

                                  {enquiry.status === "payment_verified" && (
                                    <span className="text-sm text-green-600 font-medium flex items-center">
                                      <PartyPopper size={16} className="mr-1" />
                                      Payment verified! You are now a sponsor.
                                    </span>
                                  )}

                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      console.log(
                                        "Message organizer clicked for enquiry:",
                                        {
                                          eventId: enquiry.eventId,
                                          eventTitle: enquiry.eventTitle,
                                          enquiryId: enquiry.id,
                                          availableEvents: events.length,
                                        }
                                      );
                                      handleMessageOrganizerFromEnquiry(
                                        enquiry
                                      );
                                    }}
                                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                  >
                                    <MessageCircle size={16} className="mr-1" />
                                    Message Organizer
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
                                    <Eye size={16} className="mr-1" />
                                    View Details
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

                  {(() => {
                    // Filter out events where the current user is already involved
                    const availableEvents = events.filter((event) => {
                      // Check if current user is already in the sponsors array
                      const isAlreadySponsor =
                        event.sponsors &&
                        event.sponsors.some(
                          (sponsor) => sponsor.sponsorId === user?.uid
                        );

                      // Check if user has pending enquiry for this event
                      const hasPendingEnquiry = enquiries.some(
                        (enquiry) => enquiry.eventId === event.id
                      );

                      return !isAlreadySponsor && !hasPendingEnquiry;
                    });

                    if (eventsLoading) {
                      return (
                        <div className="text-center py-12">
                          <div className="text-gray-600">Loading events...</div>
                        </div>
                      );
                    }

                    if (availableEvents.length === 0) {
                      return (
                        <div className="text-center py-12">
                          <div className="text-6xl mb-4 text-gray-400 flex justify-center">
                            <PartyPopper size={64} />
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {events.length === 0
                              ? "No events available"
                              : "No new events to discover"}
                          </h3>
                          <p className="text-gray-600">
                            {events.length === 0
                              ? "Check back later for new sponsorship opportunities"
                              : "You've already engaged with all available events! Check your 'My Sponsorships' and 'Submitted' tabs, or check back later for new events."}
                          </p>
                        </div>
                      );
                    }

                    return (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {availableEvents.map((event) => (
                          <Card key={event.id}>
                            <CardContent className="p-0">
                              {/* Event Image */}
                              {event.imageUrl && (
                                <div className="relative h-48 w-full rounded-t-lg overflow-hidden">
                                  <Image
                                    src={event.imageUrl}
                                    alt={event.title}
                                    fill
                                    className="object-cover"
                                  />
                                  <div className="absolute top-4 right-4">
                                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-800 rounded-full text-xs font-medium shadow-sm">
                                      {event.category}
                                    </span>
                                  </div>
                                </div>
                              )}

                              <div className="p-6">
                                <div className="mb-4">
                                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    {event.title}
                                  </h3>
                                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                    <span className="flex items-center">
                                      <Calendar size={14} className="mr-1" />
                                      {event.startDate
                                        .toDate()
                                        .toLocaleDateString()}
                                    </span>
                                    <span className="flex items-center">
                                      <MapPin size={14} className="mr-1" />
                                      {event.location.city},{" "}
                                      {event.location.country}
                                    </span>
                                    <span className="flex items-center">
                                      <Users size={14} className="mr-1" />
                                      {event.attendeeCount
                                        ? event.attendeeCount.toLocaleString()
                                        : "TBD"}{" "}
                                      attendees
                                    </span>
                                    {!event.imageUrl && (
                                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                        {event.category}
                                      </span>
                                    )}
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
                                                handleDirectMessageOrganizer(
                                                  event
                                                )
                                              }
                                              className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                            >
                                              <MessageCircle
                                                size={14}
                                                className="mr-1"
                                              />
                                              Message
                                            </Button>
                                            <Button
                                              size="sm"
                                              onClick={() =>
                                                handleSendEnquiry(event, pkg)
                                              }
                                            >
                                              <Mail
                                                size={14}
                                                className="mr-1"
                                              />
                                              Send Enquiry
                                            </Button>
                                          </div>
                                        </div>

                                        <div className="space-y-1">
                                          {pkg.benefits &&
                                            pkg.benefits.map(
                                              (benefit, index) => (
                                                <div
                                                  key={index}
                                                  className="flex items-center text-sm text-gray-600"
                                                >
                                                  <span className="text-green-500 mr-2">
                                                    <Check size={16} />
                                                  </span>
                                                  {benefit}
                                                </div>
                                              )
                                            )}
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>

          {/* ROI Summary - only show when on current sponsorships tab */}
          {activeTab === "current" && activeSponsorship.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <TrendingUp size={20} className="mr-2" />
                  ROI Summary
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
                    <X size={16} />
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
                      className="w-full p-3 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full p-3 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      {submittingEnquiry ? (
                        "Sending..."
                      ) : (
                        <>
                          <Mail size={16} className="mr-1" />
                          Send Enquiry
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowEnquiryModal(false)}
                      className="flex-1 text-gray-700 hover:bg-gray-100"
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
                    <X size={16} />
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
                      className="w-full p-3 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      {sendingMessage ? (
                        "Sending..."
                      ) : (
                        <>
                          <MessageCircle size={16} className="mr-1" />
                          Send Message
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowMessageModal(false);
                        setMessageText("");
                        setSelectedEventForMessage(null);
                      }}
                      className="flex-1 text-gray-700 hover:bg-gray-100"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Upload Modal */}
        {showPaymentModal && selectedEnquiryForPayment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Upload Payment Proof
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {selectedEnquiryForPayment.eventTitle} -{" "}
                      {selectedEnquiryForPayment.packageName}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowPaymentModal(false);
                      setSelectedEnquiryForPayment(null);
                      setPaymentProofUrl("");
                    }}
                  >
                    <X size={16} />
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Payment Details */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">
                      Payment Details:
                    </h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Event: {selectedEnquiryForPayment.eventTitle}</div>
                      <div>
                        Package: {selectedEnquiryForPayment.packageName}
                      </div>
                      <div>
                        Amount: $
                        {(
                          selectedEnquiryForPayment.finalAmount ||
                          selectedEnquiryForPayment.proposedAmount ||
                          0
                        ).toLocaleString()}
                      </div>
                      <div>Status: Payment Required</div>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-medium text-blue-900 mb-2 flex items-center">
                      <ClipboardList size={16} className="mr-1" />
                      Instructions:
                    </h3>
                    <div className="text-sm text-blue-800 space-y-1">
                      <div>
                        1. Make payment using the details provided by the
                        organizer
                      </div>
                      <div>
                        2. Upload a screenshot or photo of your payment receipt
                      </div>
                      <div>
                        3. The organizer will verify your payment and confirm
                        your sponsorship
                      </div>
                    </div>
                  </div>

                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Proof *
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                      <ImageUpload
                        onUpload={handlePaymentProofUpload}
                        placeholder="Click to upload payment proof (receipt, screenshot, etc.)"
                        className="w-full"
                        uploadPreset="events_preset"
                      />

                      {paymentProofUrl && (
                        <div className="mt-4">
                          <div className="text-sm text-green-600 flex items-center">
                            <CheckCircle size={16} className="mr-1" />
                            Payment proof uploaded successfully!
                          </div>
                          <Image
                            src={paymentProofUrl}
                            alt="Payment proof"
                            width={300}
                            height={200}
                            className="mt-2 max-w-xs rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Accepted formats: JPG, PNG, PDF. Max size: 10MB
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4 pt-4">
                    <Button
                      onClick={() => {
                        if (paymentProofUrl) {
                          setShowPaymentModal(false);
                          setSelectedEnquiryForPayment(null);
                          setPaymentProofUrl("");
                        }
                      }}
                      disabled={uploadingPayment || !paymentProofUrl}
                      className="flex-1"
                    >
                      {uploadingPayment ? (
                        "Uploading..."
                      ) : paymentProofUrl ? (
                        <>
                          <CheckCircle size={16} className="mr-1" />
                          Complete Upload
                        </>
                      ) : (
                        <>
                          <Upload size={16} className="mr-1" />
                          Upload Payment Proof
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowPaymentModal(false);
                        setSelectedEnquiryForPayment(null);
                        setPaymentProofUrl("");
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
