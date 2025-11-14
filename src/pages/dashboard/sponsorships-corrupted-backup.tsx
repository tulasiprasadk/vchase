import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { useSponsorships } from "@/hooks/useSponsorships";
import { useSponsorEvents } from "@/hooks/useSponsorEvents";
import { useSponsorshipEnquiries } from "@/hooks/useSponsorshipEnquiries";
import { useAuth } from "@/context/AuthContext";
import { Event, SponsorshipPackage } from "@/types";
import toast from "react-hot-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";

// Create a stable empty filters object to prevent re-renders
const EMPTY_FILTERS = {};

const SponsorshipsDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { sponsorships, loading: sponsorshipsLoading } = useSponsorships();
  const { events, loading: eventsLoading } = useSponsorEvents(EMPTY_FILTERS);
  const { submitEnquiry } = useSponsorshipEnquiries();

  const [activeTab, setActiveTab] = useState<"current" | "discover">("current");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedPackage, setSelectedPackage] =
    useState<SponsorshipPackage | null>(null);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [enquiryMessage, setEnquiryMessage] = useState("");
  const [companyInfo, setCompanyInfo] = useState("");
  const [submittingEnquiry, setSubmittingEnquiry] = useState(false);

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
        <title>My Sponsorships - EventSponsor</title>
        <meta
          name="description"
          content="Manage your sponsorships and track ROI"
        />
      </Head>
      <DashboardLayout title="My Sponsorships">
        <div className="space-y-6">
          {/* Header with action button */}
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-600">
                Track your sponsorships and measure their impact
              </p>
            </div>
            <Link href="/dashboard/browse-events">
              <Button>🔍 Browse Events</Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="text-2xl mr-4">💳</div>
                  <div>
                    <p className="text-sm text-gray-600">Active Sponsorships</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {activeSponsorship.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="text-2xl mr-4">💰</div>
                  <div>
                    <p className="text-sm text-gray-600">Total Investment</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${totalInvestment.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="text-2xl mr-4">📊</div>
                  <div>
                    <p className="text-sm text-gray-600">Total Reach</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {totalReach.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="text-2xl mr-4">🎯</div>
                  <div>
                    <p className="text-sm text-gray-600">Total Leads</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {totalLeads}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sponsorships List */}
          <div className="space-y-4">
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
                            <span>📦 {sponsorship.packageName}</span>
                            <span>📍 {sponsorship.location}</span>
                            <span>
                              📅{" "}
                              {new Date(
                                typeof sponsorship.eventDate === "object" &&
                                sponsorship.eventDate !== null &&
                                "toDate" in sponsorship.eventDate
                                  ? (
                                      sponsorship.eventDate as {
                                        toDate: () => Date;
                                      }
                                    ).toDate()
                                  : sponsorship.eventDate
                              ).toLocaleDateString()}
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                sponsorship.status
                              )}`}
                            >
                              {sponsorship.status.charAt(0).toUpperCase() +
                                sponsorship.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-8 mt-4 text-sm">
                        <div>
                          <span className="text-gray-600">Investment: </span>
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
                        {sponsorship.reach > 0 && (
                          <div>
                            <span className="text-gray-600">
                              Cost per Lead:{" "}
                            </span>
                            <span className="font-medium">
                              $
                              {(sponsorship.amount / sponsorship.leads).toFixed(
                                2
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        📊 Analytics
                      </Button>
                      {sponsorship.status === "pending" && (
                        <Button variant="outline" size="sm">
                          ✏️ Edit
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        👁️ View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* ROI Summary Card */}
          {activeSponsorship.length > 0 && (
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

          {/* Empty state */}
          {sponsorships.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💳</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No sponsorships yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start sponsoring events to grow your brand and reach new
                audiences
              </p>
              <Link href="/dashboard/browse-events">
                <Button>Browse Available Events</Button>
              </Link>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default SponsorshipsDashboardPage;
