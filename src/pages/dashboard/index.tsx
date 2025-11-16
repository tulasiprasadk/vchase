import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { useLayout } from "@/context/LayoutContext";
import { DashboardCard } from "@/components/ui/DashboardCard";
import { LayoutCustomizer } from "@/components/layout/LayoutCustomizer";
import { useOrganizerEnquiries } from "@/hooks/useOrganizerEnquiries";
import { useEvents } from "@/hooks/useEvents";
import { useSponsorshipEnquiries } from "@/hooks/useSponsorshipEnquiries";
import {
  Calendar,
  Handshake,
  Users,
  CreditCard,
  BarChart3,
  TrendingUp,
  UserCheck,
  Settings,
  ArrowRight,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { getCollection } from "@/lib/firebase/firestore";

// Rupee Icon Component - matches LucideIcon interface
const RupeeIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <span 
    className={`font-bold flex items-center justify-center ${className}`} 
    style={{ fontSize: '1.5em', lineHeight: 1, display: 'inline-flex' }}
  >
    ₹
  </span>
);

const DashboardPage: React.FC = () => {
  const { userProfile, user } = useAuth();
  const { settings } = useLayout();
  const router = useRouter();
  const [showLayoutCustomizer, setShowLayoutCustomizer] = useState(false);

  // Hooks for organizer data - always called regardless of user type
  const { enquiries } = useOrganizerEnquiries();
  const { events } = useEvents();

  // Hook for sponsor data - only used for sponsors but called unconditionally
  const { enquiries: sponsorEnquiries } = useSponsorshipEnquiries();
  const [totalUsersCount, setTotalUsersCount] = useState<number | null>(null);

  // Redirect sponsors to their main sponsorships page
  // This acts as a fallback for existing users and ensures sponsors always
  // land on their dedicated sponsorships dashboard
  useEffect(() => {
    if (userProfile && userProfile.userType === "sponsor") {
      router.replace("/dashboard/sponsorships");
    }
  }, [userProfile, router]);

  // Load total users count for admin dashboard
  useEffect(() => {
    let mounted = true;
    const loadUsers = async () => {
      const { data, error } = await getCollection("users");
      if (!mounted) return;
      if (!error) setTotalUsersCount((data || []).length);
    };
    loadUsers();
    return () => {
      mounted = false;
    };
  }, []);

  const getGridClasses = () => {
    const baseClasses = "gap-4 lg:gap-6";

    switch (settings.mode) {
      case "list":
        return `space-y-4 ${baseClasses}`;
      case "compact":
        return `grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 ${baseClasses}`;
      default: // grid
        return `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 ${baseClasses}`;
    }
  };

  const renderOrganizerDashboard = () => {
    // Filter organizer's events and enquiries
    const organizerEvents = events.filter(
      (event) => event.organizerId === user?.uid
    );
    const organizerEnquiries = enquiries.filter((enquiry) =>
      organizerEvents.some((event) => event.id === enquiry.eventId)
    );

    // Calculate actual metrics
    const activeEventsCount = organizerEvents.filter(
      (event) => event.status === "published"
    ).length;
    const acceptedEnquiries = organizerEnquiries.filter((enquiry) =>
      ["accepted"].includes(enquiry.status)
    );
    const uniqueSponsors = new Set(
      acceptedEnquiries.map((enquiry) => enquiry.sponsorId)
    ).size;
    const totalRevenue = acceptedEnquiries.reduce(
      (sum, enquiry) => sum + (enquiry.proposedAmount || 0),
      0
    );
    const totalAttendees = organizerEvents.reduce(
      (sum, event) => sum + (event.maxAttendees || 0),
      0
    );

    const cards = [
      {
        title: "Active Events",
        value: activeEventsCount,
        icon: Calendar,
        color: "blue",
        trend: { value: 12.5, isPositive: true },
      },
      {
        title: "Total Revenue",
        value: `₹${totalRevenue.toLocaleString()}`,
        icon: RupeeIcon,
        color: "green",
        trend: { value: 8.3, isPositive: true },
      },
      {
        title: "Sponsors",
        value: uniqueSponsors,
        icon: Handshake,
        color: "purple",
        trend: { value: 15.0, isPositive: true },
      },
      {
        title: "Total Capacity",
        value: totalAttendees.toLocaleString(),
        icon: Users,
        color: "indigo",
        trend: { value: 7.2, isPositive: true },
      },
    ];

    return (
      <div className="space-y-6">
        {settings.showMetrics && (
          <div className={getGridClasses()}>
            {cards.map((card, index) => (
              <DashboardCard key={index} {...card} />
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white p-4 lg:p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Recent Events
            </h3>
            <div className="space-y-3">
              {organizerEvents.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">No events created yet</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Create your first event to get started
                  </p>
                </div>
              ) : (
                organizerEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between border-b pb-2"
                  >
                    <span className="text-sm text-gray-600 truncate pr-2">
                      {event.title}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs rounded whitespace-nowrap ${
                        event.status === "published"
                          ? "bg-green-100 text-green-800"
                          : event.status === "draft"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {event.status
                        ? event.status.charAt(0).toUpperCase() +
                          event.status.slice(1)
                        : "Draft"}
                    </span>
                  </div>
                ))
              )}
              {organizerEvents.length > 3 && (
                <div className="text-center pt-2">
                  <Link
                    href="/dashboard/events"
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    +{organizerEvents.length - 3} more events
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-4 lg:p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Recent Sponsorship Enquiries
              </h3>
              <Link
                href="/dashboard/enquiries"
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                View All
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {organizerEnquiries.length === 0 ? (
                <div className="text-center py-8">
                  <CreditCard className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    No sponsorship enquiries yet
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Enquiries will appear here when sponsors apply to your
                    events
                  </p>
                </div>
              ) : (
                organizerEnquiries.slice(0, 3).map((enquiry) => (
                  <div
                    key={enquiry.id}
                    className="flex items-center justify-between border-b pb-2"
                  >
                    <span className="text-sm text-gray-600 truncate pr-2">
                      {enquiry.companyName} - {enquiry.packageName}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs rounded whitespace-nowrap ${
                        enquiry.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : enquiry.status === "accepted"
                          ? "bg-green-100 text-green-800"
                          : enquiry.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {enquiry.status.charAt(0).toUpperCase() +
                        enquiry.status.slice(1).replace("_", " ")}
                    </span>
                  </div>
                ))
              )}
              {organizerEnquiries.length > 3 && (
                <div className="text-center pt-2">
                  <Link
                    href="/dashboard/enquiries"
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    +{organizerEnquiries.length - 3} more enquiries
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSponsorDashboard = () => {
    // Calculate actual sponsor metrics
    const activeSponsorships = sponsorEnquiries.filter((enquiry) =>
      ["accepted", "payment_verified", "completed"].includes(enquiry.status)
    );
    const totalInvested = sponsorEnquiries.reduce(
      (sum, enquiry) =>
        sum + (enquiry.finalAmount || enquiry.proposedAmount || 0),
      0
    );
    const uniqueEvents = new Set(
      activeSponsorships.map((enquiry) => enquiry.eventId)
    ).size;

    // For reach and ROI, we'll keep placeholder calculations since we don't have event attendance data yet
    const estimatedReach = activeSponsorships.length * 200; // Rough estimate of 200 people per sponsorship

    const cards = [
      {
        title: "Active Sponsorships",
        value: activeSponsorships.length,
        icon: CreditCard,
        color: "blue",
        trend: { value: 6.2, isPositive: true },
      },
      {
        title: "Total Invested",
        value: `₹${totalInvested.toLocaleString()}`,
        icon: RupeeIcon,
        color: "green",
        trend: { value: 12.1, isPositive: true },
      },
      {
        title: "Events Sponsored",
        value: uniqueEvents,
        icon: BarChart3,
        color: "purple",
        trend: { value: 18.5, isPositive: true },
      },
      {
        title: "Est. Reach",
        value:
          estimatedReach > 1000
            ? `${(estimatedReach / 1000).toFixed(1)}K`
            : estimatedReach.toString(),
        icon: TrendingUp,
        color: "indigo",
        trend: { value: 24.3, isPositive: true },
      },
    ];

    return (
      <div className="space-y-6">
        {settings.showMetrics && (
          <div className={getGridClasses()}>
            {cards.map((card, index) => (
              <DashboardCard key={index} {...card} />
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white p-4 lg:p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Current Sponsorships
            </h3>
            <div className="space-y-3">
              {activeSponsorships.length === 0 ? (
                <div className="text-center py-8">
                  <CreditCard className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    No active sponsorships yet
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Browse events to find sponsorship opportunities
                  </p>
                </div>
              ) : (
                activeSponsorships.slice(0, 3).map((enquiry) => (
                  <div
                    key={enquiry.id}
                    className="flex items-center justify-between border-b pb-2"
                  >
                    <span className="text-sm text-gray-600 truncate pr-2">
                      {enquiry.eventTitle} - {enquiry.packageName}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs rounded whitespace-nowrap ${
                        enquiry.status === "accepted"
                          ? "bg-green-100 text-green-800"
                          : enquiry.status === "completed"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {enquiry.status.charAt(0).toUpperCase() +
                        enquiry.status.slice(1).replace("_", " ")}
                    </span>
                  </div>
                ))
              )}
              {activeSponsorships.length > 3 && (
                <div className="text-center pt-2">
                  <Link
                    href="/dashboard/sponsorships"
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    +{activeSponsorships.length - 3} more sponsorships
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-4 lg:p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Available Events
              </h3>
              <Link
                href="/dashboard/sponsorships"
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                Browse All
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {events.filter((event) => event.status === "published").length ===
              0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    No events available yet
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Check back soon for new sponsorship opportunities
                  </p>
                </div>
              ) : (
                events
                  .filter((event) => event.status === "published")
                  .slice(0, 3)
                  .map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between border-b pb-2"
                    >
                      <span className="text-sm text-gray-600 truncate pr-2">
                        {event.title}
                      </span>
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded whitespace-nowrap">
                        Available
                      </span>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAdminDashboard = () => {
    // Calculate basic admin metrics from available data
    const totalUsers =
      totalUsersCount === null ? "Loading..." : totalUsersCount;
    const totalEvents = events.length;
    const totalEnquiries = enquiries.length;
    const publishedEvents = events.filter(
      (event) => event.status === "published"
    ).length;

    const cards = [
      {
        title: "Total Users",
        value: totalUsers,
        icon: UserCheck,
        color: "blue",
        trend: { value: 5.2, isPositive: true },
      },
      {
        title: "Total Events",
        value: totalEvents,
        icon: Calendar,
        color: "green",
        trend: { value: 12.1, isPositive: true },
      },
      {
        title: "Published Events",
        value: publishedEvents,
        icon: Calendar,
        color: "purple",
        trend: { value: 23.4, isPositive: true },
      },
      {
        title: "Total Enquiries",
        value: totalEnquiries,
        icon: TrendingUp,
        color: "indigo",
        trend: { value: 15.7, isPositive: true },
      },
    ];

    return (
      <div className="space-y-6">
        {settings.showMetrics && (
          <div className={getGridClasses()}>
            {cards.map((card, index) => (
              <DashboardCard key={index} {...card} />
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white p-4 lg:p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3">
              <div className="text-sm text-gray-600">
                New user registered: john.doe@example.com
              </div>
              <div className="text-sm text-gray-600">
                Event created: Digital Marketing Summit
              </div>
              <div className="text-sm text-gray-600">
                Sponsorship approved: TechCorp x AI Conference
              </div>
            </div>
          </div>

          <div className="bg-white p-4 lg:p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              System Health
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">API Response Time</span>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded whitespace-nowrap">
                  85ms
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Database Status</span>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded whitespace-nowrap">
                  Healthy
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Sessions</span>
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded whitespace-nowrap">
                  342
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDashboardContent = () => {
    switch (userProfile?.userType) {
      case "organizer":
        return renderOrganizerDashboard();
      case "sponsor":
        return renderSponsorDashboard();
      case "admin":
        return renderAdminDashboard();
      case "super_admin":
        return renderAdminDashboard();
      case "supervisor":
        return renderAdminDashboard();
      case "executive":
        return renderAdminDashboard();
      default:
        return renderOrganizerDashboard();
    }
  };

  return (
    <ProtectedRoute requireAuth={true}>
      <Head>
        <title>Dashboard - EventSponsor</title>
        <meta name="description" content="EventSponsor Dashboard" />
      </Head>
      <DashboardLayout title="Dashboard">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl text-gray-600">
              Welcome back, {userProfile?.firstName}! 👋
            </h2>
            <p className="text-gray-500 capitalize">
              {userProfile?.userType} Dashboard
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={() => setShowLayoutCustomizer(true)}
            className="flex items-center gap-2 bg-gray-800 text-white hover:bg-gray-700 border-gray-700"
          >
            <Settings className="h-4 w-4" />
            Customize Layout
          </Button>
        </div>
        {/* User management moved to the sidebar under Admin > Users */}

        {renderDashboardContent()}

        <LayoutCustomizer
          isOpen={showLayoutCustomizer}
          onClose={() => setShowLayoutCustomizer(false)}
        />
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default DashboardPage;
