import React, { useState, useEffect } from "react";
import Head from "next/head";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import VerifiedBadge from "@/components/ui/VerifiedBadge";
import { useAuth } from "@/context/AuthContext";
import {
  collection,
  query,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import {
  Users,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Trash2,
  User,
  Mail,
  Calendar,
} from "lucide-react";
import { toast } from "react-hot-toast";

interface UserData {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  userType?: string;
  isApproved?: boolean;
  createdAt?: Timestamp;
  lastSignIn?: Timestamp;
  profilePicture?: string;
  company?: string;
  status?: string;
  // Add verification fields
  isVerified?: boolean;
  verificationStatus?: "pending" | "approved" | "rejected" | "not_requested";
  verifiedAt?: Timestamp;
  verifiedBy?: string;
}

const UserManagementPage: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<
    "all" | "organizer" | "sponsor" | "admin"
  >("all");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "approved" | "pending"
  >("all");

  useEffect(() => {
    if (!user) return;

    const usersQuery = query(
      collection(db, "users"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(usersQuery, (snapshot) => {
      const usersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as UserData[];

      setUsers(usersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      !searchTerm ||
      (u.firstName &&
        u.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.lastName &&
        u.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.company && u.company.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = filterType === "all" || u.userType === filterType;

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "approved" && u.isApproved) ||
      (filterStatus === "pending" && !u.isApproved);

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleToggleApproval = async (
    userId: string,
    currentStatus: boolean
  ) => {
    try {
      await updateDoc(doc(db, "users", userId), {
        isApproved: !currentStatus,
        [!currentStatus ? "approvedAt" : "rejectedAt"]: Timestamp.now(),
      });
      toast.success(
        `User ${!currentStatus ? "approved" : "suspended"} successfully`
      );
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("Failed to update user status");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this user? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await deleteDoc(doc(db, "users", userId));
      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  if (loading) {
    return (
      <ProtectedRoute requireAuth={true} allowedRoles={["admin"]}>
        <DashboardLayout title="User Management">
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-600">Loading users...</div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireAuth={true} allowedRoles={["admin"]}>
      <Head>
        <title>User Management - Admin Panel</title>
        <meta name="description" content="Manage platform users" />
      </Head>

      <DashboardLayout title="User Management">
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
            <div className="flex items-center mb-2">
              <Users className="h-8 w-8 mr-3" />
              <h1 className="text-2xl font-bold">User Management</h1>
            </div>
            <p className="opacity-90">
              Manage all platform users, approve accounts, and monitor activity.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {users.length}
                </div>
                <div className="text-sm text-gray-600">Total Users</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {users.filter((u) => u.isApproved).length}
                </div>
                <div className="text-sm text-gray-600">Approved</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {users.filter((u) => !u.isApproved).length}
                </div>
                <div className="text-sm text-gray-600">Pending</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {users.filter((u) => u.userType === "organizer").length}
                </div>
                <div className="text-sm text-gray-600">Organizers</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex items-center space-x-2">
                  <Search className="h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <select
                      value={filterType}
                      onChange={(e) =>
                        setFilterType(
                          e.target.value as
                            | "all"
                            | "organizer"
                            | "sponsor"
                            | "admin"
                        )
                      }
                      className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                    >
                      <option value="all">All Types</option>
                      <option value="organizer">Organizers</option>
                      <option value="sponsor">Sponsors</option>
                      <option value="admin">Admins</option>
                    </select>
                  </div>

                  <select
                    value={filterStatus}
                    onChange={(e) =>
                      setFilterStatus(
                        e.target.value as "all" | "approved" | "pending"
                      )
                    }
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Users List */}
          <div className="space-y-4">
            {filteredUsers.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    No Users Found
                  </h3>
                  <p className="text-gray-500">
                    Try adjusting your search or filter criteria.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                {filteredUsers.map((userData) => (
                  <Card
                    key={userData.id}
                    className={`border-l-4 ${
                      userData.isApproved
                        ? "border-l-green-500"
                        : "border-l-orange-500"
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          {/* Avatar */}
                          <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                            <User className="h-6 w-6 text-gray-600" />
                          </div>

                          {/* User Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-lg font-semibold truncate">
                                {userData.firstName} {userData.lastName}
                              </h3>
                              <Badge
                                variant={
                                  userData.userType === "admin"
                                    ? "default"
                                    : userData.userType === "organizer"
                                    ? "secondary"
                                    : "outline"
                                }
                              >
                                {userData.userType}
                              </Badge>
                              <VerifiedBadge
                                verificationStatus={
                                  userData.verificationStatus || "not_requested"
                                }
                                size="sm"
                              />
                              <Badge
                                variant={
                                  userData.isApproved ? "default" : "secondary"
                                }
                              >
                                {userData.isApproved ? "Approved" : "Pending"}
                              </Badge>
                            </div>

                            <div className="space-y-1 text-sm text-gray-600">
                              <div className="flex items-center space-x-2">
                                <Mail className="h-4 w-4" />
                                <span className="truncate">
                                  {userData.email}
                                </span>
                              </div>

                              {userData.company && (
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium">Company:</span>
                                  <span className="truncate">
                                    {userData.company}
                                  </span>
                                </div>
                              )}

                              <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  Joined{" "}
                                  {userData.createdAt
                                    ?.toDate()
                                    .toLocaleDateString()}
                                </span>
                              </div>

                              {userData.lastSignIn && (
                                <div className="flex items-center space-x-2 text-xs text-gray-500">
                                  <span>
                                    Last seen{" "}
                                    {userData.lastSignIn
                                      .toDate()
                                      .toLocaleDateString()}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleToggleApproval(
                                userData.id,
                                userData.isApproved || false
                              )
                            }
                            className={
                              userData.isApproved
                                ? "text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                                : "text-green-600 hover:text-green-700 hover:bg-green-50"
                            }
                          >
                            {userData.isApproved ? (
                              <>
                                <XCircle className="h-4 w-4 mr-1" />
                                Suspend
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </>
                            )}
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteUser(userData.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            )}
          </div>

          {/* Summary */}
          {filteredUsers.length > 0 && (
            <div className="text-center text-sm text-gray-500">
              Showing {filteredUsers.length} of {users.length} users
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default UserManagementPage;
