import React, { useState, useEffect } from "react";
import Head from "next/head";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";
import {
  collection,
  query,
  onSnapshot,
  doc,
  updateDoc,
  Timestamp,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import {
  CheckCircle,
  XCircle,
  User,
  Mail,
  Calendar,
  Search,
  Filter,
  UserCheck,
  UserX,
  Clock,
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
  isVerified?: boolean;
  verificationStatus?: "pending" | "approved" | "rejected" | "not_requested";
  verifiedAt?: Timestamp;
  verifiedBy?: string;
  isActive?: boolean;
}

const UserApprovalPage: React.FC = () => {
  const { user } = useAuth();

  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "approved" | "suspended"
  >("pending");

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
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.company?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "approved" && u.isApproved) ||
      (filterStatus === "pending" && !u.isApproved && u.status !== "suspended") ||
      (filterStatus === "suspended" && u.status === "suspended");

    return matchesSearch && matchesStatus;
  });

  const handleApproveUser = async (userId: string) => {
    try {
      const updates = {
        isApproved: true,
        approvedAt: Timestamp.now(),
        status: "active",
        isActive: true,
      };
      await updateDoc(doc(db, "users", userId), updates);
      toast.success("User approved and activated successfully");
    } catch (error) {
      console.error("Error approving user:", error);
      toast.error("Failed to approve user");
    }
  };

  const handleSuspendUser = async (userId: string) => {
    try {
      const updates = {
        isApproved: false,
        rejectedAt: Timestamp.now(),
        status: "suspended",
        isActive: false,
      };
      await updateDoc(doc(db, "users", userId), updates);
      toast.success("User suspended successfully");
    } catch (error) {
      console.error("Error suspending user:", error);
      toast.error("Failed to suspend user");
    }
  };

  const handleActivateUser = async (userId: string) => {
    try {
      const updates = {
        isActive: true,
        status: "active",
        isApproved: true,
        approvedAt: Timestamp.now(),
      };
      await updateDoc(doc(db, "users", userId), updates);
      toast.success("User activated successfully");
    } catch (error) {
      console.error("Error activating user:", error);
      toast.error("Failed to activate user");
    }
  };

  const getStatusBadge = (userData: UserData) => {
    if (userData.status === "suspended" || userData.isActive === false) {
      return <Badge variant="destructive">Suspended</Badge>;
    } else if (userData.isApproved) {
      return <Badge variant="default">Active</Badge>;
    } else {
      return <Badge variant="secondary">Pending Approval</Badge>;
    }
  };

  const getStatusIcon = (userData: UserData) => {
    if (userData.status === "suspended" || userData.isActive === false) {
      return <UserX className="h-5 w-5 text-red-500" />;
    } else if (userData.isApproved) {
      return <UserCheck className="h-5 w-5 text-green-500" />;
    } else {
      return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const pendingCount = users.filter(u => !u.isApproved && u.status !== "suspended").length;
  const approvedCount = users.filter(u => u.isApproved).length;
  const suspendedCount = users.filter(u => u.status === "suspended" || u.isActive === false).length;

  if (loading) {
    return (
      <ProtectedRoute requireAuth={true} allowedRoles={["super_admin"]}>
        <DashboardLayout title="User Approval">
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-600">Loading users...</div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireAuth={true} allowedRoles={["super_admin"]}>
      <Head>
        <title>User Approval - Super Admin</title>
        <meta name="description" content="Approve and manage user accounts" />
      </Head>

      <DashboardLayout title="User Approval">
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-6 text-white">
            <div className="flex items-center mb-2">
              <CheckCircle className="h-8 w-8 mr-3" />
              <h1 className="text-2xl font-bold">User Approval Center</h1>
            </div>
            <p className="opacity-90">
              Review, approve, and manage user account status. Activate new users and manage existing accounts.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
                <div className="text-sm text-gray-600">Pending Approval</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
                <div className="text-sm text-gray-600">Active Users</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{suspendedCount}</div>
                <div className="text-sm text-gray-600">Suspended</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search users by name, email, or company..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <select
                    value={filterStatus}
                    onChange={(e) =>
                      setFilterStatus(
                        e.target.value as "all" | "pending" | "approved" | "suspended"
                      )
                    }
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm text-gray-500"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending Approval</option>
                    <option value="approved">Active</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Users List */}
          <div className="space-y-4">
            {filteredUsers.length > 0 ? (
              <>
                {filteredUsers.map((userData) => (
                  <Card
                    key={userData.id}
                    className={`border-l-4 ${
                      userData.status === "suspended" || userData.isActive === false
                        ? "border-l-red-500"
                        : userData.isApproved
                        ? "border-l-green-500"
                        : "border-l-yellow-500"
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            {getStatusIcon(userData)}
                            <div className="ml-3">
                              <h3 className="text-lg font-medium text-gray-900">
                                {userData.firstName} {userData.lastName}
                              </h3>
                              {getStatusBadge(userData)}
                            </div>
                          </div>

                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              <Mail className="h-4 w-4" />
                              <span>{userData.email}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4" />
                              <span className="capitalize">{userData.userType}</span>
                            </div>
                            {userData.company && (
                              <div className="flex items-center space-x-2">
                                <span className="h-4 w-4 text-center">🏢</span>
                                <span>{userData.company}</span>
                              </div>
                            )}
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4" />
                              <span>
                                Joined {userData.createdAt?.toDate().toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-2 mt-4 lg:mt-0">
                          {userData.userType === "super_admin" ? (
                            <div className="text-sm text-gray-500 px-3 py-1 bg-gray-100 rounded">
                              Protected Account
                            </div>
                          ) : (
                            <>
                              {userData.status === "suspended" || userData.isActive === false ? (
                                <Button
                                  size="sm"
                                  onClick={() => handleActivateUser(userData.id)}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  <UserCheck className="h-4 w-4 mr-1" />
                                  Activate
                                </Button>
                              ) : userData.isApproved ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleSuspendUser(userData.id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                >
                                  <UserX className="h-4 w-4 mr-1" />
                                  Suspend
                                </Button>
                              ) : (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() => handleApproveUser(userData.id)}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Approve & Activate
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleSuspendUser(userData.id)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                  >
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Reject
                                  </Button>
                                </>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <CheckCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No users found
                  </h3>
                  <p className="text-gray-600">
                    {filterStatus === "pending"
                      ? "No users are currently pending approval."
                      : "Try adjusting your search criteria or filters."}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default UserApprovalPage;
