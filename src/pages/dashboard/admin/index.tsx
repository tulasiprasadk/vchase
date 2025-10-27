import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { collection, query, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import {
  Users,
  Calendar,
  CreditCard,
  AlertTriangle,
  TrendingUp,
  Eye,
  Shield,
} from "lucide-react";

interface AdminStats {
  totalUsers: number;
  totalOrganizers: number;
  totalSponsors: number;
  totalEvents: number;
  pendingEvents: number;
  totalEnquiries: number;
  recentSignups: number;
}

interface UserData {
  id: string;
  userType?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  isApproved?: boolean;
  createdAt?: Timestamp;
  [key: string]: string | number | boolean | Timestamp | undefined;
}

interface EventData {
  id: string;
  title?: string;
  organizerId?: string;
  status?: string;
  createdAt?: Timestamp;
  [key: string]: string | number | boolean | Timestamp | undefined;
}

const AdminDashboard: React.FC = () => {
  const { user, userProfile } = useAuth();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalOrganizers: 0,
    totalSponsors: 0,
    totalEvents: 0,
    pendingEvents: 0,
    totalEnquiries: 0,
    recentSignups: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentEvents, setRecentEvents] = useState<EventData[]>([]);
  const [recentUsers, setRecentUsers] = useState<UserData[]>([]);

  useEffect(() => {
    if (!user) return;

    const unsubscribes: (() => void)[] = [];

    // Fetch users stats
    const usersQuery = query(collection(db, "users"));
    const unsubUsers = onSnapshot(usersQuery, (snapshot) => {
      const users = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as UserData[];
      const organizers = users.filter((u) => u.userType === "organizer");
      const sponsors = users.filter((u) => u.userType === "sponsor");

      // Recent signups (last 7 days)
      const weekAgo = Timestamp.fromDate(
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      );
      const recentSignups = users.filter(
        (u) => u.createdAt && u.createdAt.toMillis() > weekAgo.toMillis()
      );

      setStats((prev) => ({
        ...prev,
        totalUsers: users.length,
        totalOrganizers: organizers.length,
        totalSponsors: sponsors.length,
        recentSignups: recentSignups.length,
      }));

      // Set recent users for display
      setRecentUsers(
        users
          .sort(
            (a, b) =>
              (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0)
          )
          .slice(0, 5)
      );
    });
    unsubscribes.push(unsubUsers);

    // Fetch events stats
    const eventsQuery = query(collection(db, "events"));
    const unsubEvents = onSnapshot(eventsQuery, (snapshot) => {
      const events = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as EventData[];
      const pendingEvents = events.filter((e) => e.status !== "published");

      setStats((prev) => ({
        ...prev,
        totalEvents: events.length,
        pendingEvents: pendingEvents.length,
      }));

      // Set recent events for display
      setRecentEvents(
        events
          .sort(
            (a, b) =>
              (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0)
          )
          .slice(0, 5)
      );
    });
    unsubscribes.push(unsubEvents);

    // Fetch enquiries stats
    const enquiriesQuery = query(collection(db, "enquiries"));
    const unsubEnquiries = onSnapshot(enquiriesQuery, (snapshot) => {
      setStats((prev) => ({
        ...prev,
        totalEnquiries: snapshot.docs.length,
      }));
    });
    unsubscribes.push(unsubEnquiries);

    setLoading(false);

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe());
    };
  }, [user]);

  if (loading) {
    return (
      <ProtectedRoute
        requireAuth={true}
        allowedRoles={["admin", "executive", "super_admin", "supervisor"]}
      >
        <DashboardLayout title="Admin Dashboard">
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-600">Loading admin dashboard...</div>
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
        <title>Admin Dashboard - EventSponsor</title>
        <meta
          name="description"
          content="Admin dashboard for platform management"
        />
      </Head>

      <DashboardLayout title="Admin Dashboard">
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
            <div className="flex items-center mb-2">
              <Shield className="h-8 w-8 mr-3" />
              <h1 className="text-2xl font-bold">
                Welcome,{" "}
                {userProfile?.userType
                  ? userProfile.userType.charAt(0).toUpperCase() +
                    userProfile.userType.slice(1)
                  : "Admin"}
                !
              </h1>
            </div>
            <p className="opacity-90">
              Monitor platform activity, moderate content, and manage users from
              your central command center.
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Users
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.totalUsers}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      +{stats.recentSignups} this week
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
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.totalEvents}
                    </p>
                    <p className="text-xs text-orange-600 mt-1">
                      {stats.pendingEvents} pending approval
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
                      Organizers
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.totalOrganizers}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Active accounts
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Sponsors
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.totalSponsors}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Active accounts
                    </p>
                  </div>
                  <CreditCard className="h-8 w-8 text-indigo-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Moderate Content</h3>
                <p className="text-gray-600 mb-4">
                  Review and approve pending events and user accounts
                </p>
                <Link href="/dashboard/admin/moderate">
                  <Button className="w-full">Review Content</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Manage Users</h3>
                <p className="text-gray-600 mb-4">
                  View, approve, or suspend user accounts
                </p>
                <Link href="/dashboard/admin/users">
                  <Button className="w-full">Manage Users</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">View Reports</h3>
                <p className="text-gray-600 mb-4">
                  Access platform-wide analytics and reports
                </p>
                <Link href="/dashboard/admin/reports">
                  <Button className="w-full">View Reports</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Eye className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Manage Ads</h3>
                <p className="text-gray-600 mb-4">
                  Upload and manage advertisement images
                </p>
                <Link href="/dashboard/admin/advertisements">
                  <Button className="w-full">Manage Ads</Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Events</h3>
                {recentEvents.length === 0 ? (
                  <p className="text-gray-500">No events yet</p>
                ) : (
                  <div className="space-y-3">
                    {recentEvents.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center justify-between border-b pb-2"
                      >
                        <div>
                          <p className="font-medium">{event.title}</p>
                          <p className="text-sm text-gray-600">
                            {event.organizerId}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              event.status === "published"
                                ? "bg-green-100 text-green-800"
                                : "bg-orange-100 text-orange-800"
                            }`}
                          >
                            {event.status || "draft"}
                          </span>
                          <Link href={`/dashboard/admin/events/${event.id}`}>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Users</h3>
                {recentUsers.length === 0 ? (
                  <p className="text-gray-500">No users yet</p>
                ) : (
                  <div className="space-y-3">
                    {recentUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between border-b pb-2"
                      >
                        <div>
                          <p className="font-medium">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-sm text-gray-600">
                            {user.email} • {user.userType}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              user.isApproved
                                ? "bg-green-100 text-green-800"
                                : "bg-orange-100 text-orange-800"
                            }`}
                          >
                            {user.isApproved ? "approved" : "pending"}
                          </span>
                          <Link href={`/dashboard/admin/users/${user.id}`}>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default AdminDashboard;
