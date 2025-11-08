import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { useAuth } from "@/context/AuthContext";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Eye, Check, X, User, Calendar, AlertTriangle } from "lucide-react";
import { toast } from "react-hot-toast";

interface UserData {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  userType?: string;
  isApproved?: boolean;
  createdAt?: Timestamp;
  profilePicture?: string;
  company?: string;
  companyDescription?: string;
}

interface EventData {
  id: string;
  title?: string;
  description?: string;
  organizerId?: string;
  status?: string;
  createdAt?: Timestamp;
  eventDate?: Timestamp;
  photos?: string[];
  sponsorshipPackages?: Record<string, unknown>[];
}

const ModerationPage: React.FC = () => {
  const { user } = useAuth();
  const [pendingUsers, setPendingUsers] = useState<UserData[]>([]);
  const [pendingEvents, setPendingEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"users" | "events">("users");

  useEffect(() => {
    if (!user) return;

    const database = db;
    if (!database) {
      console.warn("[ModerationPage] Firebase is not configured.");
      setLoading(false);
      return;
    }

    const unsubscribes: (() => void)[] = [];

    // Fetch pending users
    const pendingUsersQuery = query(
      collection(database, "users"),
      where("isApproved", "==", false)
    );

    const unsubUsers = onSnapshot(pendingUsersQuery, (snapshot) => {
      const users = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as UserData[];
      setPendingUsers(users);
    });
    unsubscribes.push(unsubUsers);

    // Fetch pending events (draft or review status)
    const pendingEventsQuery = query(
      collection(database, "events"),
      where("status", "in", ["draft", "review"])
    );

    const unsubEvents = onSnapshot(pendingEventsQuery, (snapshot) => {
      const events = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as EventData[];
      setPendingEvents(events);
    });
    unsubscribes.push(unsubEvents);

    setLoading(false);

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe());
    };
  }, [user]);

  const handleApproveUser = async (userId: string) => {
    try {
      const database = db;
      if (!database) {
        toast.error("Database is not configured.");
        return;
      }
      await updateDoc(doc(database, "users", userId), {
        isApproved: true,
        approvedAt: Timestamp.now(),
      });
      toast.success("User approved successfully");
    } catch (error) {
      console.error("Error approving user:", error);
      toast.error("Failed to approve user");
    }
  };

  const handleRejectUser = async (userId: string) => {
    try {
      const database = db;
      if (!database) {
        toast.error("Database is not configured.");
        return;
      }
      await updateDoc(doc(database, "users", userId), {
        isApproved: false,
        rejectedAt: Timestamp.now(),
        status: "rejected",
      });
      toast.success("User rejected");
    } catch (error) {
      console.error("Error rejecting user:", error);
      toast.error("Failed to reject user");
    }
  };

  const handleApproveEvent = async (eventId: string) => {
    try {
      const database = db;
      if (!database) {
        toast.error("Database is not configured.");
        return;
      }
      await updateDoc(doc(database, "events", eventId), {
        status: "published",
        approvedAt: Timestamp.now(),
      });
      toast.success("Event approved and published");
    } catch (error) {
      console.error("Error approving event:", error);
      toast.error("Failed to approve event");
    }
  };

  const handleRejectEvent = async (eventId: string) => {
    try {
      const database = db;
      if (!database) {
        toast.error("Database is not configured.");
        return;
      }
      await updateDoc(doc(database, "events", eventId), {
        status: "rejected",
        rejectedAt: Timestamp.now(),
      });
      toast.success("Event rejected");
    } catch (error) {
      console.error("Error rejecting event:", error);
      toast.error("Failed to reject event");
    }
  };

  if (loading) {
    return (
      <ProtectedRoute
        requireAuth={true}
        allowedRoles={["admin", "executive", "super_admin", "supervisor"]}
      >
        <DashboardLayout title="Content Moderation">
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-600">Loading moderation queue...</div>
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
        <title>Content Moderation - Admin Panel</title>
        <meta name="description" content="Moderate users and events" />
      </Head>

      <DashboardLayout title="Content Moderation">
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-6 text-white">
            <div className="flex items-center mb-2">
              <AlertTriangle className="h-8 w-8 mr-3" />
              <h1 className="text-2xl font-bold">Content Moderation</h1>
            </div>
            <p className="opacity-90">
              Review and approve pending user accounts and event listings.
            </p>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab("users")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "users"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Pending Users ({pendingUsers.length})</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab("events")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "events"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Pending Events ({pendingEvents.length})</span>
                </div>
              </button>
            </nav>
          </div>

          {/* Content */}
          {activeTab === "users" && (
            <div className="space-y-4">
              {pendingUsers.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      No Pending Users
                    </h3>
                    <p className="text-gray-500">
                      All user registrations have been reviewed.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {pendingUsers.map((user) => (
                    <Card
                      key={user.id}
                      className="border-l-4 border-l-orange-500"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <User className="h-5 w-5 text-gray-600" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold">
                                  {user.firstName} {user.lastName}
                                </h3>
                                <p className="text-gray-600">{user.email}</p>
                              </div>
                              <Badge
                                variant={
                                  user.userType === "organizer"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {user.userType}
                              </Badge>
                            </div>

                            {user.company && (
                              <div className="mb-3">
                                <p className="text-sm text-gray-600">
                                  <strong>Company:</strong> {user.company}
                                </p>
                                {user.companyDescription && (
                                  <p className="text-sm text-gray-600 mt-1">
                                    {user.companyDescription}
                                  </p>
                                )}
                              </div>
                            )}

                            <p className="text-sm text-gray-500">
                              Registered:{" "}
                              {user.createdAt?.toDate().toLocaleDateString()}
                            </p>
                          </div>

                          <div className="flex items-center space-x-2 ml-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleApproveUser(user.id)}
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRejectUser(user.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </>
              )}
            </div>
          )}

          {activeTab === "events" && (
            <div className="space-y-4">
              {pendingEvents.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      No Pending Events
                    </h3>
                    <p className="text-gray-500">
                      All event submissions have been reviewed.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {pendingEvents.map((event) => (
                    <Card
                      key={event.id}
                      className="border-l-4 border-l-blue-500"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                              <Calendar className="h-8 w-8 text-blue-600" />
                              <div>
                                <h3 className="text-lg font-semibold">
                                  {event.title}
                                </h3>
                                <p className="text-gray-600">
                                  Organizer: {event.organizerId}
                                </p>
                              </div>
                              <Badge
                                variant={
                                  event.status === "draft"
                                    ? "secondary"
                                    : "default"
                                }
                              >
                                {event.status}
                              </Badge>
                            </div>

                            {event.description && (
                              <p className="text-gray-700 mb-3 line-clamp-3">
                                {event.description}
                              </p>
                            )}

                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                              <div>
                                <strong>Event Date:</strong>{" "}
                                {event.eventDate
                                  ?.toDate()
                                  .toLocaleDateString() || "Not set"}
                              </div>
                              <div>
                                <strong>Submitted:</strong>{" "}
                                {event.createdAt?.toDate().toLocaleDateString()}
                              </div>
                              <div>
                                <strong>Sponsorship Packages:</strong>{" "}
                                {event.sponsorshipPackages?.length || 0}
                              </div>
                              <div>
                                <strong>Photos:</strong>{" "}
                                {event.photos?.length || 0}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 ml-4">
                            <Link href={`/events/${event.id}`}>
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </Link>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleApproveEvent(event.id)}
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRejectEvent(event.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default ModerationPage;
