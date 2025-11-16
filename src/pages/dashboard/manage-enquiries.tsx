import React, { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { useAuth } from "@/context/AuthContext";
import {
  useSponsorshipEnquiries,
  SponsorshipEnquiry,
} from "@/hooks/useSponsorshipEnquiries";
import toast from "react-hot-toast";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

const ManageEnquiriesPage: React.FC = () => {
  const { user } = useAuth();
  const { updateEnquiryStatus, addSponsorToEvent } = useSponsorshipEnquiries();

  const [enquiries, setEnquiries] = useState<SponsorshipEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] =
    useState<SponsorshipEnquiry | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [responseNotes, setResponseNotes] = useState("");

  // Fetch enquiries for organizer's events
  useEffect(() => {
    if (!user) return;

    const fetchOrganizerEnquiries = async () => {
      try {
        // First get events owned by this organizer
        const eventsQuery = query(
          collection(db, "events"),
          where("organizerId", "==", user.uid)
        );

        const unsubscribeEvents = onSnapshot(eventsQuery, (eventsSnapshot) => {
          const eventIds = eventsSnapshot.docs.map((doc) => doc.id);

          if (eventIds.length === 0) {
            setEnquiries([]);
            setLoading(false);
            return;
          }

          // Then get enquiries for these events
          const enquiriesQuery = query(
            collection(db, "enquiries"),
            where("eventId", "in", eventIds)
          );

          const unsubscribeEnquiries = onSnapshot(
            enquiriesQuery,
            (enquiriesSnapshot) => {
              const organizerEnquiries = enquiriesSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              })) as SponsorshipEnquiry[];

              // Sort by most recent first
              const sortedEnquiries = organizerEnquiries.sort(
                (a, b) => b.submittedAt.toMillis() - a.submittedAt.toMillis()
              );

              setEnquiries(sortedEnquiries);
              setLoading(false);
            }
          );

          return unsubscribeEnquiries;
        });

        return unsubscribeEvents;
      } catch (error) {
        console.error("Error fetching organizer enquiries:", error);
        setLoading(false);
      }
    };

    const unsubscribe = fetchOrganizerEnquiries();
    return () => {
      if (unsubscribe) {
        unsubscribe.then((unsub) => unsub && unsub());
      }
    };
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
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

  const handleEnquiryAction = async (
    enquiryId: string,
    action: "accept" | "reject" | "verify_payment",
    enquiry?: SponsorshipEnquiry
  ) => {
    setActionLoading(enquiryId);

    try {
      if (action === "accept") {
        await updateEnquiryStatus(enquiryId, "accepted", responseNotes);
        toast.success(
          "Enquiry accepted! Sponsor will be notified to upload payment proof."
        );
      } else if (action === "reject") {
        await updateEnquiryStatus(enquiryId, "rejected", responseNotes);
        toast.success("Enquiry rejected.");
      } else if (action === "verify_payment" && enquiry) {
        await updateEnquiryStatus(enquiryId, "payment_verified", responseNotes);
        // Add sponsor to event
        await addSponsorToEvent(enquiry);
        toast.success("Payment verified! Sponsor added to the event.");
      }

      setResponseNotes("");
      setShowDetailsModal(false);
      setSelectedEnquiry(null);
    } catch (error) {
      console.error("Error updating enquiry:", error);
      toast.error("Failed to update enquiry");
    } finally {
      setActionLoading(null);
    }
  };

  const openDetailsModal = (enquiry: SponsorshipEnquiry) => {
    setSelectedEnquiry(enquiry);
    setShowDetailsModal(true);
  };

  if (loading) {
    return (
      <ProtectedRoute requireAuth={true} allowedRoles={["organizer"]}>
        <DashboardLayout title="Manage Enquiries">
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
        <title>Manage Enquiries - EventSponsor</title>
        <meta
          name="description"
          content="Manage sponsorship enquiries for your events"
        />
      </Head>
      <DashboardLayout title="Manage Enquiries">
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Sponsorship Enquiries
            </h1>
            <p className="text-gray-600">
              Review and manage sponsorship requests for your events
            </p>
          </div>

          {enquiries.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="text-gray-400 text-6xl mb-4">📧</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No enquiries yet
                </h3>
                <p className="text-gray-600">
                  Sponsorship enquiries for your events will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {enquiries.map((enquiry) => (
                <Card key={enquiry.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {enquiry.companyName}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              enquiry.status
                            )}`}
                          >
                            {enquiry.status === "pending" &&
                              "⏳ Pending Review"}
                            {enquiry.status === "accepted" && "✅ Accepted"}
                            {enquiry.status === "rejected" && "❌ Rejected"}
                            {enquiry.status === "payment_uploaded" &&
                              "📤 Payment Uploaded"}
                            {enquiry.status === "payment_verified" &&
                              "✅ Payment Verified"}
                            {enquiry.status === "completed" && "🎉 Completed"}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                          <div>
                            <strong>Event:</strong> {enquiry.eventTitle}
                          </div>
                          <div>
                            <strong>Package:</strong> {enquiry.packageName}
                          </div>
                          <div>
                            <strong>Contact:</strong> {enquiry.contactEmail}
                          </div>
                          <div>
                            <strong>Amount:</strong> ₹
                            {(enquiry.proposedAmount || 0).toLocaleString()}
                          </div>
                        </div>

                        {enquiry.message && (
                          <div className="mb-4">
                            <strong className="text-sm text-gray-700">
                              Message:
                            </strong>
                            <p className="text-sm text-gray-600 mt-1 bg-gray-50 p-3 rounded">
                              {enquiry.message}
                            </p>
                          </div>
                        )}

                        {enquiry.paymentProofUrl && (
                          <div className="mb-4">
                            <strong className="text-sm text-gray-700">
                              Payment Proof:
                            </strong>
                            <div className="mt-2">
                              <Image
                                src={enquiry.paymentProofUrl}
                                alt="Payment proof"
                                width={200}
                                height={150}
                                className="rounded-lg border cursor-pointer"
                                onClick={() =>
                                  window.open(enquiry.paymentProofUrl, "_blank")
                                }
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                Click to view full size
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDetailsModal(enquiry)}
                        >
                          👁️ View Details
                        </Button>

                        {enquiry.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() =>
                                handleEnquiryAction(enquiry.id!, "accept")
                              }
                              disabled={actionLoading === enquiry.id}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              {actionLoading === enquiry.id
                                ? "..."
                                : "✅ Accept"}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleEnquiryAction(enquiry.id!, "reject")
                              }
                              disabled={actionLoading === enquiry.id}
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              {actionLoading === enquiry.id
                                ? "..."
                                : "❌ Reject"}
                            </Button>
                          </>
                        )}

                        {enquiry.status === "payment_uploaded" && (
                          <Button
                            size="sm"
                            onClick={() =>
                              handleEnquiryAction(
                                enquiry.id!,
                                "verify_payment",
                                enquiry
                              )
                            }
                            disabled={actionLoading === enquiry.id}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            {actionLoading === enquiry.id
                              ? "Processing..."
                              : "✅ Verify Payment"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Details Modal */}
          {showDetailsModal && selectedEnquiry && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Enquiry Details
                    </h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowDetailsModal(false)}
                    >
                      ✕
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Company Name
                        </label>
                        <p className="text-gray-900">
                          {selectedEnquiry.companyName}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Contact Email
                        </label>
                        <p className="text-gray-900">
                          {selectedEnquiry.contactEmail}
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Response Notes (Optional)
                      </label>
                      <textarea
                        value={responseNotes}
                        onChange={(e) => setResponseNotes(e.target.value)}
                        rows={4}
                        className="w-full p-3 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Add notes for the sponsor (optional)..."
                      />
                    </div>

                    <div className="flex gap-4 pt-4">
                      {selectedEnquiry.status === "pending" && (
                        <>
                          <Button
                            onClick={() =>
                              handleEnquiryAction(selectedEnquiry.id!, "accept")
                            }
                            disabled={actionLoading === selectedEnquiry.id}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            {actionLoading === selectedEnquiry.id
                              ? "Processing..."
                              : "✅ Accept Enquiry"}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() =>
                              handleEnquiryAction(selectedEnquiry.id!, "reject")
                            }
                            disabled={actionLoading === selectedEnquiry.id}
                            className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                          >
                            {actionLoading === selectedEnquiry.id
                              ? "Processing..."
                              : "❌ Reject Enquiry"}
                          </Button>
                        </>
                      )}

                      {selectedEnquiry.status === "payment_uploaded" && (
                        <Button
                          onClick={() =>
                            handleEnquiryAction(
                              selectedEnquiry.id!,
                              "verify_payment",
                              selectedEnquiry
                            )
                          }
                          disabled={actionLoading === selectedEnquiry.id}
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                        >
                          {actionLoading === selectedEnquiry.id
                            ? "Processing..."
                            : "✅ Verify Payment & Add Sponsor"}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default ManageEnquiriesPage;
