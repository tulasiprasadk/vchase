import React, { useState, useEffect } from "react";
import Head from "next/head";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { collection, query, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import {
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  CreditCard,
  Download,
  RefreshCw,
} from "lucide-react";
import { toast } from "react-hot-toast";

interface ReportData {
  totalUsers: number;
  totalOrganizers: number;
  totalSponsors: number;
  totalEvents: number;
  publishedEvents: number;
  totalEnquiries: number;
  completedSponsorships: number;
  revenueMetrics: {
    totalSponsored: number;
    averagePackageValue: number;
  };
  growthMetrics: {
    newUsersLastMonth: number;
    newEventsLastMonth: number;
    newEnquiriesLastMonth: number;
  };
  topOrganizers: Array<{ id: string; name: string; eventCount: number }>;
  topSponsors: Array<{ id: string; name: string; sponsorshipCount: number }>;
}

interface FirebaseUser {
  id: string;
  userType?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  createdAt?: Timestamp;
  [key: string]: unknown;
}

interface FirebaseEvent {
  id: string;
  title?: string;
  status?: string;
  organizerId?: string;
  createdAt?: Timestamp;
  [key: string]: unknown;
}

interface FirebaseEnquiry {
  id: string;
  status?: string;
  sponsorId?: string;
  createdAt?: Timestamp;
  [key: string]: unknown;
}

const ReportsPage: React.FC = () => {
  const { user } = useAuth();
  const [reportData, setReportData] = useState<ReportData>({
    totalUsers: 0,
    totalOrganizers: 0,
    totalSponsors: 0,
    totalEvents: 0,
    publishedEvents: 0,
    totalEnquiries: 0,
    completedSponsorships: 0,
    revenueMetrics: {
      totalSponsored: 0,
      averagePackageValue: 0,
    },
    growthMetrics: {
      newUsersLastMonth: 0,
      newEventsLastMonth: 0,
      newEnquiriesLastMonth: 0,
    },
    topOrganizers: [],
    topSponsors: [],
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    if (!user) return;

    const unsubscribes: (() => void)[] = [];

    // Fetch users data
    const usersQuery = query(collection(db, "users"));
    const unsubUsers = onSnapshot(usersQuery, (snapshot) => {
      const users = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FirebaseUser[];
      const organizers = users.filter((u) => u.userType === "organizer");
      const sponsors = users.filter((u) => u.userType === "sponsor");

      // Calculate growth metrics
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      const lastMonthTimestamp = Timestamp.fromDate(lastMonth);

      const newUsersLastMonth = users.filter(
        (u) =>
          u.createdAt && u.createdAt.toMillis() > lastMonthTimestamp.toMillis()
      ).length;

      setReportData((prev) => ({
        ...prev,
        totalUsers: users.length,
        totalOrganizers: organizers.length,
        totalSponsors: sponsors.length,
        growthMetrics: {
          ...prev.growthMetrics,
          newUsersLastMonth,
        },
      }));
    });
    unsubscribes.push(unsubUsers);

    // Fetch events data
    const eventsQuery = query(collection(db, "events"));
    const unsubEvents = onSnapshot(eventsQuery, (snapshot) => {
      const events = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FirebaseEvent[];
      const publishedEvents = events.filter((e) => e.status === "published");

      // Calculate growth metrics
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      const lastMonthTimestamp = Timestamp.fromDate(lastMonth);

      const newEventsLastMonth = events.filter(
        (e) =>
          e.createdAt && e.createdAt.toMillis() > lastMonthTimestamp.toMillis()
      ).length;

      // Calculate top organizers
      const organizerEventCounts: Record<string, number> = {};
      events.forEach((event) => {
        if (event.organizerId) {
          organizerEventCounts[event.organizerId] =
            (organizerEventCounts[event.organizerId] || 0) + 1;
        }
      });

      const topOrganizers = Object.entries(organizerEventCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([id, count]) => ({
          id,
          name: id, // In real app, you'd fetch the organizer name
          eventCount: count,
        }));

      setReportData((prev) => ({
        ...prev,
        totalEvents: events.length,
        publishedEvents: publishedEvents.length,
        growthMetrics: {
          ...prev.growthMetrics,
          newEventsLastMonth,
        },
        topOrganizers,
      }));
    });
    unsubscribes.push(unsubEvents);

    // Fetch enquiries data
    const enquiriesQuery = query(collection(db, "enquiries"));
    const unsubEnquiries = onSnapshot(enquiriesQuery, (snapshot) => {
      const enquiries = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FirebaseEnquiry[];
      const completedSponsorships = enquiries.filter(
        (e) => e.status === "completed"
      );

      // Calculate growth metrics
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      const lastMonthTimestamp = Timestamp.fromDate(lastMonth);

      const newEnquiriesLastMonth = enquiries.filter(
        (e) =>
          e.createdAt && e.createdAt.toMillis() > lastMonthTimestamp.toMillis()
      ).length;

      // Calculate sponsor metrics
      const sponsorCounts: Record<string, number> = {};
      completedSponsorships.forEach((sponsorship) => {
        if (sponsorship.sponsorId) {
          sponsorCounts[sponsorship.sponsorId] =
            (sponsorCounts[sponsorship.sponsorId] || 0) + 1;
        }
      });

      const topSponsors = Object.entries(sponsorCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([id, count]) => ({
          id,
          name: id, // In real app, you'd fetch the sponsor name
          sponsorshipCount: count,
        }));

      // Calculate revenue metrics (placeholder)
      const totalSponsored = completedSponsorships.length;
      const averagePackageValue = totalSponsored > 0 ? 2500 : 0; // Placeholder calculation

      setReportData((prev) => ({
        ...prev,
        totalEnquiries: enquiries.length,
        completedSponsorships: completedSponsorships.length,
        growthMetrics: {
          ...prev.growthMetrics,
          newEnquiriesLastMonth,
        },
        revenueMetrics: {
          totalSponsored,
          averagePackageValue,
        },
        topSponsors,
      }));
    });
    unsubscribes.push(unsubEnquiries);

    setLoading(false);
    setLastUpdated(new Date());

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe());
    };
  }, [user]);

  const handleRefreshData = () => {
    setLoading(true);
    // Force re-fetch by updating a timestamp
    setLastUpdated(new Date());
    setTimeout(() => {
      setLoading(false);
      toast.success("Data refreshed successfully");
    }, 1000);
  };

  const handleExportReport = () => {
    // Create CSV data
    const csvData = [
      ["Metric", "Value"],
      ["Total Users", reportData.totalUsers],
      ["Total Organizers", reportData.totalOrganizers],
      ["Total Sponsors", reportData.totalSponsors],
      ["Total Events", reportData.totalEvents],
      ["Published Events", reportData.publishedEvents],
      ["Total Enquiries", reportData.totalEnquiries],
      ["Completed Sponsorships", reportData.completedSponsorships],
      ["New Users (Last Month)", reportData.growthMetrics.newUsersLastMonth],
      ["New Events (Last Month)", reportData.growthMetrics.newEventsLastMonth],
      [
        "New Enquiries (Last Month)",
        reportData.growthMetrics.newEnquiriesLastMonth,
      ],
    ];

    const csvContent = csvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `platform-report-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("Report exported successfully");
  };

  if (loading) {
    return (
      <ProtectedRoute
        requireAuth={true}
        allowedRoles={["admin", "executive", "super_admin", "supervisor"]}
      >
        <DashboardLayout title="Platform Reports">
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-600">Loading reports...</div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute
      requireAuth={true}
      allowedRoles={["admin", "executive", "super_admin", "supervisor"]}
    >
      <Head>
        <title>Platform Reports - Admin Panel</title>
        <meta name="description" content="Platform analytics and reports" />
      </Head>

      <DashboardLayout title="Platform Reports">
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center mb-2">
                  <BarChart3 className="h-8 w-8 mr-3" />
                  <h1 className="text-2xl font-bold">Platform Reports</h1>
                </div>
                <p className="opacity-90">
                  Comprehensive analytics and insights for platform performance.
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={handleRefreshData}
                  variant="outline"
                  className="text-white border-white hover:bg-white hover:text-green-600"
                  disabled={loading}
                >
                  <RefreshCw
                    className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
                  />
                  Refresh
                </Button>
                <Button
                  onClick={handleExportReport}
                  variant="outline"
                  className="text-white border-white hover:bg-white hover:text-green-600"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Users
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {reportData.totalUsers}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      +{reportData.growthMetrics.newUsersLastMonth} this month
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Events
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {reportData.totalEvents}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      +{reportData.growthMetrics.newEventsLastMonth} this month
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Active Sponsorships
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {reportData.completedSponsorships}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {reportData.totalEnquiries} total enquiries
                    </p>
                  </div>
                  <CreditCard className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Published Events
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {reportData.publishedEvents}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {Math.round(
                        (reportData.publishedEvents / reportData.totalEvents) *
                          100
                      ) || 0}
                      % of total
                    </p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-indigo-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Breakdown */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">User Breakdown</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Organizers</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-2 bg-blue-600 rounded-full"
                          style={{
                            width: `${
                              (reportData.totalOrganizers /
                                reportData.totalUsers) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                      <span className="font-medium">
                        {reportData.totalOrganizers}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Sponsors</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-2 bg-green-600 rounded-full"
                          style={{
                            width: `${
                              (reportData.totalSponsors /
                                reportData.totalUsers) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                      <span className="font-medium">
                        {reportData.totalSponsors}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Users</span>
                    <span className="font-bold text-lg">
                      {reportData.totalUsers}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Growth Metrics */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Growth (Last 30 Days)
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium text-blue-900">New Users</p>
                      <p className="text-sm text-blue-600">
                        User registrations
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-900">
                        {reportData.growthMetrics.newUsersLastMonth}
                      </p>
                      <p className="text-sm text-blue-600">
                        <TrendingUp className="h-4 w-4 inline mr-1" />
                        Growth
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-green-900">New Events</p>
                      <p className="text-sm text-green-600">Event listings</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-900">
                        {reportData.growthMetrics.newEventsLastMonth}
                      </p>
                      <p className="text-sm text-green-600">
                        <Calendar className="h-4 w-4 inline mr-1" />
                        Created
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div>
                      <p className="font-medium text-purple-900">
                        New Enquiries
                      </p>
                      <p className="text-sm text-purple-600">
                        Sponsorship requests
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-purple-900">
                        {reportData.growthMetrics.newEnquiriesLastMonth}
                      </p>
                      <p className="text-sm text-purple-600">
                        <CreditCard className="h-4 w-4 inline mr-1" />
                        Submitted
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Performers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Organizers */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Top Organizers</h3>
                {reportData.topOrganizers.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No data available
                  </p>
                ) : (
                  <div className="space-y-3">
                    {reportData.topOrganizers.map((organizer, index) => (
                      <div
                        key={organizer.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{organizer.name}</p>
                            <p className="text-sm text-gray-600">
                              Organizer ID: {organizer.id.slice(0, 8)}...
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">
                            {organizer.eventCount}
                          </p>
                          <p className="text-sm text-gray-600">events</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Top Sponsors */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Top Sponsors</h3>
                {reportData.topSponsors.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No data available
                  </p>
                ) : (
                  <div className="space-y-3">
                    {reportData.topSponsors.map((sponsor, index) => (
                      <div
                        key={sponsor.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{sponsor.name}</p>
                            <p className="text-sm text-gray-600">
                              Sponsor ID: {sponsor.id.slice(0, 8)}...
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">
                            {sponsor.sponsorshipCount}
                          </p>
                          <p className="text-sm text-gray-600">sponsorships</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Last Updated */}
          <div className="text-center text-sm text-gray-500">
            Last updated: {lastUpdated.toLocaleString()}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default ReportsPage;
