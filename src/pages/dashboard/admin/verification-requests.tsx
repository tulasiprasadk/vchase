import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useVerification } from "@/hooks/useVerification";
import { VerificationRequest } from "@/types";
import {
  CheckCircle,
  XCircle,
  Eye,
  FileText,
  Building,
  Calendar,
  X,
} from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import VerifiedBadge from "@/components/ui/VerifiedBadge";
import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

const VerificationRequestsPage: React.FC = () => {
  const { user } = useAuth();
  const {
    verificationRequests,
    loading,
    approveVerification,
    rejectVerification,
  } = useVerification();
  const [selectedRequest, setSelectedRequest] =
    useState<VerificationRequest | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [reviewAction, setReviewAction] = useState<"approve" | "reject">(
    "approve"
  );

  const pendingRequests = verificationRequests.filter(
    (req) => req.status === "pending"
  );
  const reviewedRequests = verificationRequests.filter(
    (req) => req.status !== "pending"
  );

  const handleReviewAction = (
    request: VerificationRequest,
    action: "approve" | "reject"
  ) => {
    setSelectedRequest(request);
    setReviewAction(action);
    setShowReviewModal(true);
  };

  const handleViewDetails = (request: VerificationRequest) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const submitReview = async () => {
    if (!selectedRequest || !user) return;

    try {
      if (reviewAction === "approve") {
        await approveVerification(selectedRequest.id!, user.uid, reviewNotes);
      } else {
        await rejectVerification(selectedRequest.id!, user.uid, reviewNotes);
      }

      setShowReviewModal(false);
      setSelectedRequest(null);
      setReviewNotes("");
    } catch (error) {
      console.error("Error reviewing verification request:", error);
    }
  };

  const RequestCard: React.FC<{ request: VerificationRequest }> = ({
    request,
  }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold">
              {request.userInfo.firstName} {request.userInfo.lastName}
            </h3>
            <p className="text-gray-600">{request.userInfo.email}</p>
            <div className="flex items-center mt-2">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  request.userType === "organizer"
                    ? "bg-purple-100 text-purple-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {request.userType}
              </span>
              <VerifiedBadge
                verificationStatus={request.status}
                size="sm"
                className="ml-2"
              />
            </div>
          </div>

          <div className="text-sm text-gray-500">
            <div className="flex items-center">
              <Calendar size={14} className="mr-1" />
              {request.requestedAt.toDate().toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center">
            <Building size={16} className="mr-2" />
            <span className="text-sm">
              {request.userInfo.company || "No company"}
            </span>
          </div>

          <div className="flex items-center">
            <FileText size={16} className="mr-2" />
            <span className="text-sm">
              {request.documents.length} documents uploaded
            </span>
          </div>

          {request.businessInfo && (
            <div className="text-sm text-gray-600">
              <strong>Business:</strong> {request.businessInfo.businessName}(
              {request.businessInfo.businessType})
            </div>
          )}

          {request.organizerInfo && (
            <div className="text-sm text-gray-600">
              <strong>Experience:</strong>{" "}
              {request.organizerInfo.yearsOfExperience} years,
              {request.organizerInfo.previousEvents.length} previous events
            </div>
          )}

          {request.sponsorInfo && (
            <div className="text-sm text-gray-600">
              <strong>Budget:</strong> {request.sponsorInfo.sponsorshipBudget},
              Company size: {request.sponsorInfo.companySize}
            </div>
          )}

          {request.reviewNotes && (
            <div className="text-sm bg-gray-50 p-2 rounded">
              <strong>Review Notes:</strong> {request.reviewNotes}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-4 pt-4 border-t">
          <button
            onClick={() => handleViewDetails(request)}
            className="flex items-center text-blue-600 hover:text-blue-700"
          >
            <Eye size={16} className="mr-1" />
            View Details
          </button>

          {request.status === "pending" && (
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleReviewAction(request, "reject")}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <XCircle size={14} className="mr-1" />
                Reject
              </Button>
              <Button
                size="sm"
                onClick={() => handleReviewAction(request, "approve")}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle size={14} className="mr-1" />
                Approve
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <ProtectedRoute requireAuth={true} allowedRoles={["admin"]}>
        <DashboardLayout title="Verification Requests">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireAuth={true} allowedRoles={["admin"]}>
      <DashboardLayout title="Verification Requests">
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-800">
                {pendingRequests.length}
              </div>
              <div className="text-sm text-yellow-600">Pending Requests</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-800">
                {reviewedRequests.filter((r) => r.status === "approved").length}
              </div>
              <div className="text-sm text-green-600">Approved</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-800">
                {reviewedRequests.filter((r) => r.status === "rejected").length}
              </div>
              <div className="text-sm text-red-600">Rejected</div>
            </div>
          </div>

          {/* Pending Requests */}
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Pending Requests ({pendingRequests.length})
            </h2>

            {pendingRequests.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No pending verification requests
              </div>
            ) : (
              <div className="grid gap-4">
                {pendingRequests.map((request) => (
                  <RequestCard key={request.id} request={request} />
                ))}
              </div>
            )}
          </div>

          {/* Reviewed Requests */}
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Reviewed Requests ({reviewedRequests.length})
            </h2>

            {reviewedRequests.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No reviewed requests yet
              </div>
            ) : (
              <div className="grid gap-4">
                {reviewedRequests.map((request) => (
                  <RequestCard key={request.id} request={request} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Review Modal */}
        {showReviewModal && selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  {reviewAction === "approve" ? "Approve" : "Reject"}{" "}
                  Verification
                </h3>
                <button
                  onClick={() => {
                    setShowReviewModal(false);
                    setSelectedRequest(null);
                    setReviewNotes("");
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>

              <p className="text-gray-600 mb-4">
                {reviewAction === "approve"
                  ? "Are you sure you want to approve this verification request?"
                  : "Please provide a reason for rejecting this request."}
              </p>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {reviewAction === "approve"
                    ? "Approval Notes (Optional)"
                    : "Rejection Reason *"}
                </label>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder={
                    reviewAction === "approve"
                      ? "Add any notes about the approval..."
                      : "Explain why this request is being rejected..."
                  }
                  required={reviewAction === "reject"}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowReviewModal(false);
                    setSelectedRequest(null);
                    setReviewNotes("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={submitReview}
                  disabled={reviewAction === "reject" && !reviewNotes.trim()}
                  className={
                    reviewAction === "approve"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  }
                >
                  {reviewAction === "approve" ? "Approve" : "Reject"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Details Modal */}
        {showDetailsModal && selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  Verification Request Details
                </h3>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedRequest(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                {/* User Info */}
                <div>
                  <h4 className="font-medium mb-2">User Information</h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <p>
                      <strong>Name:</strong>{" "}
                      {selectedRequest.userInfo.firstName}{" "}
                      {selectedRequest.userInfo.lastName}
                    </p>
                    <p>
                      <strong>Email:</strong> {selectedRequest.userInfo.email}
                    </p>
                    <p>
                      <strong>Type:</strong> {selectedRequest.userType}
                    </p>
                    <p>
                      <strong>Company:</strong>{" "}
                      {selectedRequest.userInfo.company || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Business Info */}
                {selectedRequest.businessInfo && (
                  <div>
                    <h4 className="font-medium mb-2">Business Information</h4>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <p>
                        <strong>Business Name:</strong>{" "}
                        {selectedRequest.businessInfo.businessName}
                      </p>
                      <p>
                        <strong>Type:</strong>{" "}
                        {selectedRequest.businessInfo.businessType}
                      </p>
                      <p>
                        <strong>Address:</strong>{" "}
                        {selectedRequest.businessInfo.businessAddress}
                      </p>
                      <p>
                        <strong>Phone:</strong>{" "}
                        {selectedRequest.businessInfo.businessPhone}
                      </p>
                      {selectedRequest.businessInfo.businessWebsite && (
                        <p>
                          <strong>Website:</strong>
                          <a
                            href={selectedRequest.businessInfo.businessWebsite}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline ml-1"
                          >
                            {selectedRequest.businessInfo.businessWebsite}
                          </a>
                        </p>
                      )}
                      <p>
                        <strong>Description:</strong>{" "}
                        {selectedRequest.businessInfo.businessDescription}
                      </p>
                    </div>
                  </div>
                )}

                {/* Organizer Info */}
                {selectedRequest.organizerInfo && (
                  <div>
                    <h4 className="font-medium mb-2">Organizer Experience</h4>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <p>
                        <strong>Years of Experience:</strong>{" "}
                        {selectedRequest.organizerInfo.yearsOfExperience}
                      </p>
                      <p>
                        <strong>Organization Type:</strong>{" "}
                        {selectedRequest.organizerInfo.organizationType}
                      </p>
                      <p>
                        <strong>Previous Events:</strong>
                      </p>
                      <ul className="list-disc list-inside ml-4">
                        {selectedRequest.organizerInfo.previousEvents.map(
                          (event, index) => (
                            <li key={index}>{event}</li>
                          )
                        )}
                      </ul>
                      {selectedRequest.organizerInfo.portfolio && (
                        <p>
                          <strong>Portfolio:</strong>
                          <a
                            href={selectedRequest.organizerInfo.portfolio}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline ml-1"
                          >
                            {selectedRequest.organizerInfo.portfolio}
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Sponsor Info */}
                {selectedRequest.sponsorInfo && (
                  <div>
                    <h4 className="font-medium mb-2">
                      Sponsorship Information
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <p>
                        <strong>Budget:</strong>{" "}
                        {selectedRequest.sponsorInfo.sponsorshipBudget}
                      </p>
                      <p>
                        <strong>Company Size:</strong>{" "}
                        {selectedRequest.sponsorInfo.companySize}
                      </p>
                      <p>
                        <strong>Industry Focus:</strong>{" "}
                        {selectedRequest.sponsorInfo.industryFocus.join(", ")}
                      </p>
                      <p>
                        <strong>Sponsorship Goals:</strong>{" "}
                        {selectedRequest.sponsorInfo.sponsorshipGoals.join(
                          ", "
                        )}
                      </p>
                      {selectedRequest.sponsorInfo.website && (
                        <p>
                          <strong>Website:</strong>
                          <a
                            href={selectedRequest.sponsorInfo.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline ml-1"
                          >
                            {selectedRequest.sponsorInfo.website}
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Documents */}
                <div>
                  <h4 className="font-medium mb-2">Uploaded Documents</h4>
                  <div className="space-y-2">
                    {selectedRequest.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded"
                      >
                        <div className="flex items-center">
                          <FileText size={16} className="mr-2" />
                          <span className="text-sm">{doc.filename}</span>
                        </div>
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 text-sm"
                        >
                          View
                        </a>
                      </div>
                    ))}
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

export default VerificationRequestsPage;
