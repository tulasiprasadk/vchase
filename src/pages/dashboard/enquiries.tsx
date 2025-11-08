import React, { useState } from "react";
import Head from "next/head";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import {
  useOrganizerEnquiries,
  OrganizerEnquiry,
} from "@/hooks/useOrganizerEnquiries";
import { useEvents } from "@/hooks/useEvents";
import { useAuth } from "@/context/AuthContext";
import {
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  MessageSquare,
  Search,
  MoreHorizontal,
} from "lucide-react";

const EnquiriesManagementPage: React.FC = () => {
  const { user } = useAuth();
  const { enquiries, loading, updateEnquiryStatus } = useOrganizerEnquiries();
  const { events } = useEvents();

  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedEvent, setSelectedEvent] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [responseModal, setResponseModal] = useState<{
    enquiry: OrganizerEnquiry;
    action: "accept" | "reject" | "review";
  } | null>(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Filter organizer's events
  const organizerEvents = events.filter(
    (event) => event.organizerId === user?.uid
  );

  // Filter enquiries for organizer's events
  const organizerEnquiries = enquiries.filter((enquiry) =>
    organizerEvents.some((event) => event.id === enquiry.eventId)
  );

  // Apply filters
  const filteredEnquiries = organizerEnquiries.filter((enquiry) => {
    const matchesStatus =
      selectedStatus === "all" || enquiry.status === selectedStatus;
    const matchesEvent =
      selectedEvent === "all" || enquiry.eventId === selectedEvent;
    const matchesSearch =
      enquiry.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.eventTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.contactEmail.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesEvent && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "under_review":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "accepted":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      case "under_review":
        return <Eye className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const handleStatusUpdate = async (
    enquiryId: string,
    status: "accepted" | "rejected" | "under_review",
    response?: string
  ) => {
    setSubmitting(true);
    try {
      await updateEnquiryStatus(enquiryId, status, response);
      setResponseModal(null);
      setResponseMessage("");
    } catch (error) {
      console.error("Error updating enquiry:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const openResponseModal = (
    enquiry: OrganizerEnquiry,
    action: "accept" | "reject" | "review"
  ) => {
    setResponseModal({ enquiry, action });
    setResponseMessage("");
  };

  if (loading) {
    return (
      <ProtectedRoute requireAuth={true} allowedRoles={["organizer"]}>
        <DashboardLayout title="Sponsorship Enquiries">
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-600">Loading enquiries...</div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireAuth={true} allowedRoles={["organizer"]}>
      <Head>
        <title>Sponsorship Enquiries - EventSponsor</title>
        <meta
          name="description"
          content="Manage sponsorship enquiries and applications"
        />
      </Head>
      <DashboardLayout title="Sponsorship Enquiries">
        <div className="space-y-6">
          {/* Header with Stats */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Sponsorship Enquiries
                </h1>
                <p className="text-gray-600">
                  Manage and respond to sponsorship applications
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <MessageSquare className="h-5 w-5 text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="text-xl font-bold text-gray-900">
                      {organizerEnquiries.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-yellow-600 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-xl font-bold text-yellow-600">
                      {
                        organizerEnquiries.filter((e) => e.status === "pending")
                          .length
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <Eye className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Under Review</p>
                    <p className="text-xl font-bold text-blue-600">
                      {
                        organizerEnquiries.filter(
                          (e) => e.status === "under_review"
                        ).length
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Accepted</p>
                    <p className="text-xl font-bold text-green-600">
                      {
                        organizerEnquiries.filter(
                          (e) => e.status === "accepted"
                        ).length
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <XCircle className="h-5 w-5 text-red-600 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Rejected</p>
                    <p className="text-xl font-bold text-red-600">
                      {
                        organizerEnquiries.filter(
                          (e) => e.status === "rejected"
                        ).length
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search by company, event, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="under_review">Under Review</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>

              {/* Event Filter */}
              <select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Events</option>
                {organizerEvents.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Enquiries List */}
          <div className="space-y-4">
            {filteredEnquiries.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No enquiries found
                </h3>
                <p className="text-gray-600">
                  {organizerEnquiries.length === 0
                    ? "You haven't received any sponsorship enquiries yet."
                    : "No enquiries match your current filters."}
                </p>
              </div>
            ) : (
              filteredEnquiries.map((enquiry) => (
                <Card key={enquiry.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {enquiry.companyName}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(
                              enquiry.status
                            )}`}
                          >
                            {getStatusIcon(enquiry.status)}
                            {enquiry.status.charAt(0).toUpperCase() +
                              enquiry.status.slice(1).replace("_", " ")}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>Event: {enquiry.eventTitle}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4" />
                              <span>Package: {enquiry.packageName}</span>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              <span>{enquiry.contactEmail}</span>
                            </div>
                            {enquiry.contactPhone && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                <span>{enquiry.contactPhone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="text-xs text-gray-500">
                        Submitted:{" "}
                        {enquiry.submittedAt.toDate().toLocaleDateString()}
                      </div>
                    </div>

                    {enquiry.message && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                          Message:
                        </h4>
                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                          {enquiry.message}
                        </p>
                      </div>
                    )}

                    {enquiry.organizerResponse && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                          Your Response:
                        </h4>
                        <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                          {enquiry.organizerResponse}
                        </p>
                        {enquiry.responseDate && (
                          <p className="text-xs text-gray-500 mt-2">
                            Responded on{" "}
                            {enquiry.responseDate.toDate().toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        {enquiry.proposedAmount && (
                          <span>
                            Proposed: ${enquiry.proposedAmount.toLocaleString()}
                          </span>
                        )}
                        <span>ID: {enquiry.id?.slice(-8)}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {enquiry.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-blue-600 border-blue-200 hover:bg-blue-50"
                              onClick={() =>
                                openResponseModal(enquiry, "review")
                              }
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Review
                            </Button>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() =>
                                openResponseModal(enquiry, "accept")
                              }
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() =>
                                openResponseModal(enquiry, "reject")
                              }
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}

                        {enquiry.status === "under_review" && (
                          <>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() =>
                                openResponseModal(enquiry, "accept")
                              }
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() =>
                                openResponseModal(enquiry, "reject")
                              }
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            // Could add detailed view modal
                            console.log("View details:", enquiry.id);
                          }}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Response Modal */}
        {responseModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {responseModal.action === "accept"
                        ? "Accept"
                        : responseModal.action === "reject"
                        ? "Reject"
                        : "Review"}{" "}
                      Enquiry
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {responseModal.enquiry.companyName} -{" "}
                      {responseModal.enquiry.eventTitle}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setResponseModal(null)}
                  >
                    ✕
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Response Message{" "}
                      {responseModal.action !== "review" && "*"}
                    </label>
                    <textarea
                      value={responseMessage}
                      onChange={(e) => setResponseMessage(e.target.value)}
                      rows={4}
                      className="w-full p-3 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={
                        responseModal.action === "accept"
                          ? "Thank you for your interest! We're pleased to accept your sponsorship proposal..."
                          : responseModal.action === "reject"
                          ? "Thank you for your interest. Unfortunately, we cannot accept your proposal at this time..."
                          : "Thank you for your enquiry. We are currently reviewing your proposal and will get back to you soon..."
                      }
                      required={responseModal.action !== "review"}
                    />
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <Button
                      onClick={() => {
                        const status =
                          responseModal.action === "accept"
                            ? "accepted"
                            : responseModal.action === "reject"
                            ? "rejected"
                            : "under_review";
                        handleStatusUpdate(
                          responseModal.enquiry.id!,
                          status,
                          responseMessage || undefined
                        );
                      }}
                      disabled={
                        submitting ||
                        (responseModal.action !== "review" &&
                          !responseMessage.trim())
                      }
                      className="flex-1"
                    >
                      {submitting
                        ? "Processing..."
                        : responseModal.action === "accept"
                        ? "Accept Enquiry"
                        : responseModal.action === "reject"
                        ? "Reject Enquiry"
                        : "Mark Under Review"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setResponseModal(null)}
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

export default EnquiriesManagementPage;
