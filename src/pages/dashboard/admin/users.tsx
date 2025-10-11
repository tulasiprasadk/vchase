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
  getDoc,
  addDoc,
  increment,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import {
  Users,
  Search,
  Filter,
  CheckCircle,
  XCircle,
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
  // Admin controls
  isReadOnly?: boolean;
  isActive?: boolean;
  callsDone?: number;
}

const UserManagementPage: React.FC = () => {
  const { user, userProfile } = useAuth();
  const currentRole = String(userProfile?.userType || "");

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [newUser, setNewUser] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    userType: string;
    status?: string;
  }>({
    firstName: "",
    lastName: "",
    email: "",
    userType: "organizer",
    status: "active",
  });
  const [showCallsModal, setShowCallsModal] = useState(false);
  const [callsToAdd, setCallsToAdd] = useState(0);
  const [callsTargetUserId, setCallsTargetUserId] = useState<string | null>(
    null
  );
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
      // safety: don't allow modifying super_admin accounts
      const targetSnap = await getDoc(doc(db, "users", userId));
      if (targetSnap.exists()) {
        const td = targetSnap.data() as unknown as Record<string, unknown>;
        const targetType = String(td.userType || "");
        if (targetType === "super_admin") {
          toast.error("Cannot modify super_admin account");
          return;
        }
        // additional safety: supervisors and executives cannot modify admin accounts
        if (
          (currentRole === "supervisor" || currentRole === "executive") &&
          targetType === "admin"
        ) {
          toast.error("You are not allowed to modify admin accounts");
          return;
        }
      }
      const newApproved = !currentStatus;
      const updates: Record<string, unknown> = {
        isApproved: newApproved,
        [newApproved ? "approvedAt" : "rejectedAt"]: Timestamp.now(),
        status: newApproved ? "active" : "suspended",
      };
      await updateDoc(doc(db, "users", userId), updates);
      toast.success(
        `User ${newApproved ? "approved" : "suspended"} successfully`
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
      // prevent deleting super_admin via UI
      const targetSnap = await getDoc(doc(db, "users", userId));
      if (targetSnap.exists()) {
        const td = targetSnap.data() as unknown as Record<string, unknown>;
        const targetType = String(td.userType || "");
        if (targetType === "super_admin") {
          toast.error("Cannot delete a super_admin account");
          return;
        }
        if (
          (currentRole === "supervisor" || currentRole === "executive") &&
          targetType === "admin"
        ) {
          toast.error("You are not allowed to delete admin accounts");
          return;
        }
      }
      await deleteDoc(doc(db, "users", userId));
      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  const handleSaveUser = async () => {
    try {
      if (editingUserId) {
        // update existing user
        await updateDoc(doc(db, "users", editingUserId), {
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          userType: newUser.userType,
          // keep status if provided, otherwise leave unchanged
          status: newUser.status || undefined,
        });
        toast.success("User updated");
      } else {
        // create new user
        await addDoc(collection(db, "users"), {
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          userType: newUser.userType,
          createdAt: Timestamp.now(),
          isApproved: true,
          isActive: true,
          isReadOnly: false,
          callsDone: 0,
          status: "active",
        });
        toast.success(
          "User record added. Note: create an auth account separately if needed."
        );
      }

      setShowAddModal(false);
      setEditingUserId(null);
      setNewUser({
        firstName: "",
        lastName: "",
        email: "",
        userType: "organizer",
        status: "active",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to save user");
    }
  };

  const handleUpdateCalls = async () => {
    if (!callsTargetUserId) return;
    if (callsToAdd <= 0) {
      toast.error("Enter a positive number of calls");
      return;
    }
    try {
      await updateDoc(doc(db, "users", callsTargetUserId), {
        callsDone: increment(callsToAdd),
      });
      toast.success("Calls updated");
      setCallsToAdd(0);
      setShowCallsModal(false);
      setCallsTargetUserId(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update calls");
    }
  };

  if (loading) {
    return (
      <ProtectedRoute
        requireAuth={true}
        allowedRoles={["admin", "executive", "super_admin", "supervisor"]}
      >
        <DashboardLayout title="User Management">
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-600">Loading users...</div>
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
              <div className="ml-auto">
                {(currentRole === "admin" || currentRole === "super_admin") && (
                  <Button
                    size="sm"
                    onClick={() => {
                      setEditingUserId(null);
                      setShowAddModal(true);
                    }}
                    className="ml-4"
                  >
                    + Add User
                  </Button>
                )}
              </div>
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
                      className="border border-gray-300 rounded-md px-3 py-1 text-sm text-gray-500"
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
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm text-gray-500"
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
                              <h3 className="text-lg font-semibold truncate text-gray-900">
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
                                  userData.status === "active"
                                    ? "default"
                                    : userData.status === "pending"
                                    ? "secondary"
                                    : userData.status === "suspended" ||
                                      userData.status === "blocked"
                                    ? "outline"
                                    : "outline"
                                }
                                className="ml-2"
                              >
                                {userData.status ||
                                  (userData.isApproved ? "active" : "pending")}
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
                          {userData.userType === "super_admin" ? (
                            <div className="text-sm text-gray-500">
                              Protected
                            </div>
                          ) : (
                            (currentRole === "admin" ||
                              currentRole === "super_admin" ||
                              currentRole === "supervisor") && (
                              <>
                                {/* Role assignment: super_admin full, admin limited */}
                                {(currentRole === "super_admin" ||
                                  currentRole === "admin") && (
                                  <select
                                    value={userData.userType}
                                    onChange={(e) => {
                                      const newRole = e.target.value;
                                      // Admins can only assign supervisor/executive; super_admin can assign any
                                      if (currentRole === "admin") {
                                        const allowed = [
                                          "supervisor",
                                          "executive",
                                        ];
                                        if (
                                          !allowed.includes(newRole) &&
                                          newRole !== userData.userType
                                        ) {
                                          toast.error(
                                            "Admins can only assign Supervisor or Executive roles"
                                          );
                                          return;
                                        }
                                      }
                                      updateDoc(doc(db, "users", userData.id), {
                                        userType: newRole,
                                      }).then(() =>
                                        toast.success("Role updated")
                                      );
                                    }}
                                    className="border border-gray-200 rounded px-2 py-1 text-sm mr-2 text-gray-500"
                                  >
                                    {currentRole === "admin" ? (
                                      <>
                                        <option value={userData.userType}>
                                          {userData.userType}
                                        </option>
                                        <option value="supervisor">
                                          Supervisor
                                        </option>
                                        <option value="executive">
                                          Executive
                                        </option>
                                      </>
                                    ) : (
                                      <>
                                        <option value="admin">Admin</option>
                                        <option value="super_admin">
                                          Super Admin
                                        </option>
                                        <option value="supervisor">
                                          Supervisor
                                        </option>
                                        <option value="executive">
                                          Executive
                                        </option>
                                        <option value="organizer">
                                          Organizer
                                        </option>
                                        <option value="sponsor">Sponsor</option>
                                      </>
                                    )}
                                  </select>
                                )}
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

                                {(String(currentRole) === "supervisor" ||
                                  String(currentRole) === "executive") &&
                                userData.userType === "admin" ? (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    disabled
                                    className="opacity-50 cursor-not-allowed"
                                  >
                                    Restricted
                                  </Button>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={async () => {
                                      try {
                                        // double-check target type to be safe
                                        const targetSnap = await getDoc(
                                          doc(db, "users", userData.id)
                                        );
                                        if (targetSnap.exists()) {
                                          const td =
                                            targetSnap.data() as unknown as Record<
                                              string,
                                              unknown
                                            >;
                                          const targetType = String(
                                            td.userType || ""
                                          );
                                          if (targetType === "super_admin") {
                                            toast.error(
                                              "Cannot modify super_admin account"
                                            );
                                            return;
                                          }
                                          if (
                                            (String(currentRole) ===
                                              "supervisor" ||
                                              String(currentRole) ===
                                                "executive") &&
                                            targetType === "admin"
                                          ) {
                                            toast.error(
                                              "You are not allowed to block/unblock admin accounts"
                                            );
                                            return;
                                          }
                                        }

                                        const newActive = !(
                                          userData.isActive === false
                                        );
                                        const newStatus = newActive
                                          ? userData.isApproved
                                            ? "active"
                                            : "pending"
                                          : "blocked";

                                        await updateDoc(
                                          doc(db, "users", userData.id),
                                          {
                                            isActive: newActive,
                                            status: newStatus,
                                          }
                                        );
                                        toast.success(
                                          newActive ? "Unblocked" : "Blocked"
                                        );
                                      } catch (err) {
                                        console.error(err);
                                        toast.error(
                                          "Failed to update active status"
                                        );
                                      }
                                    }}
                                    className={
                                      userData.isActive === false
                                        ? "text-green-600 hover:text-green-700 hover:bg-green-50"
                                        : "text-red-600 hover:text-red-700 hover:bg-red-50"
                                    }
                                  >
                                    {userData.isActive === false
                                      ? "Unblock"
                                      : "Block"}
                                  </Button>
                                )}
                              </>
                            )
                          )}
                          {/* Super admin-only actions: Edit & Delete */}
                          {currentRole === "super_admin" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                onClick={() => {
                                  setEditingUserId(userData.id);
                                  setNewUser({
                                    firstName: userData.firstName || "",
                                    lastName: userData.lastName || "",
                                    email: userData.email || "",
                                    userType: userData.userType || "organizer",
                                    status: userData.status || "active",
                                  });
                                  setShowAddModal(true);
                                }}
                              >
                                Edit
                              </Button>

                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteUser(userData.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                Delete
                              </Button>
                            </>
                          )}
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

          {/* Add User Modal */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  User
                </h3>
                <div className="space-y-3">
                  <input
                    className="w-full border px-3 py-2 rounded text-gray-800 border-gray-300"
                    placeholder="First name"
                    value={newUser.firstName}
                    onChange={(e) =>
                      setNewUser({ ...newUser, firstName: e.target.value })
                    }
                  />
                  <input
                    className="w-full border px-3 py-2 rounded text-gray-800 border-gray-300"
                    placeholder="Last name"
                    value={newUser.lastName}
                    onChange={(e) =>
                      setNewUser({ ...newUser, lastName: e.target.value })
                    }
                  />
                  <input
                    className="w-full border px-3 py-2 rounded text-gray-800 border-gray-300"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                  />
                  <select
                    className="w-full border px-3 py-2 rounded text-gray-800 border-gray-300"
                    value={newUser.userType}
                    onChange={(e) =>
                      setNewUser({ ...newUser, userType: e.target.value })
                    }
                  >
                    <option value="organizer">Organizer</option>
                    <option value="sponsor">Sponsor</option>
                    <option value="executive">Executive</option>
                    <option value="supervisor">Supervisor</option>
                  </select>
                </div>
                <div className="mt-4 flex justify-end gap-2 text-gray-500">
                  <Button
                    variant="outline"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-blue-600 text-white hover:bg-blue-700"
                    onClick={handleSaveUser}
                  >
                    {editingUserId ? "Save" : "Create"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Update Calls Modal (executives) */}
          {showCallsModal && callsTargetUserId && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">
                  Update Calls/Meetings
                </h3>
                <div className="space-y-3">
                  <input
                    type="number"
                    className="w-full border px-3 py-2 rounded"
                    value={callsToAdd}
                    onChange={(e) => setCallsToAdd(Number(e.target.value))}
                  />
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowCallsModal(false);
                      setCallsTargetUserId(null);
                      setCallsToAdd(0);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateCalls}>Update</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default UserManagementPage;
