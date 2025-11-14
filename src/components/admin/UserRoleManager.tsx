import React, { useEffect, useState } from "react";
import { getCollection, updateDocument } from "@/lib/firebase/firestore";
import { ROLE_LABELS, hasPermission, Role } from "@/lib/roles";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";

type UserItem = {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  userType?: string;
  isActive?: boolean;
};

const UserRoleManager: React.FC = () => {
  const { userProfile } = useAuth();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newRole, setNewRole] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const { data, error } = await getCollection("users");
      setLoading(false);
      if (error) {
        toast.error("Failed to load users: " + error);
        return;
      }
      setUsers(data || []);
    };

    fetchUsers();
  }, []);

  const canEdit = () => {
    // Only admin and super_admin can manage roles in this UI
    return (
      hasPermission(String(userProfile?.userType).toLowerCase(), "add_user") ||
      hasPermission(
        String(userProfile?.userType).toLowerCase(),
        "manage_system"
      )
    );
  };

  const startEdit = (user: UserItem) => {
    setEditingId(user.id);
    setNewRole(String(user.userType || "organizer").toLowerCase());
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNewRole("");
  };

  const saveRole = async (userId: string) => {
    if (!newRole) return toast.error("Please select a role");

    // Prevent editing higher level roles when current user is not super_admin
    if (String(userProfile?.userType).toLowerCase() !== "super_admin") {
      // If target is super_admin, disallow
      const target = users.find((u) => u.id === userId);
      if (String(target?.userType).toLowerCase() === "super_admin") {
        return toast.error("You cannot modify a Super Admin");
      }
    }

    const { error } = await updateDocument("users", userId, {
      userType: newRole,
    });
    if (error) return toast.error("Failed to update role: " + error);

    toast.success("Role updated");
    // Update local state
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, userType: newRole } : u))
    );
    cancelEdit();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          User & Role Management
        </h3>
        <div className="text-sm text-gray-600">
          {canEdit() ? "You can manage roles" : "Read-only"}
        </div>
      </div>

      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-2 w-full md:w-1/2">
          <input
            placeholder="Search by name, email or role..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div className="flex items-center gap-2 justify-end w-full md:w-auto">
          <label className="text-sm text-gray-600">Per page:</label>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="px-2 py-1 border rounded-md"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading users...</div>
      ) : (
        <div className="space-y-3">
          {/* derive filtered & paged users */}
          {(() => {
            const term = searchTerm.trim().toLowerCase();
            const filtered = users.filter((u) => {
              if (!term) return true;
              const fullName = `${u.firstName || ""} ${
                u.lastName || ""
              }`.toLowerCase();
              const email = (u.email || "").toLowerCase();
              const roleLabel = u.userType
                ? ROLE_LABELS[u.userType as Role].toLowerCase()
                : "";
              return (
                fullName.includes(term) ||
                email.includes(term) ||
                roleLabel.includes(term)
              );
            });

            const total = filtered.length;
            const totalPages = Math.max(1, Math.ceil(total / pageSize));
            const currentPage = Math.min(page, totalPages);
            const start = (currentPage - 1) * pageSize;
            const paged = filtered.slice(start, start + pageSize);

            // if current page is out of range, adjust it
            if (page !== currentPage) setPage(currentPage);

            return (
              <>
                {paged.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center justify-between border-b pb-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-sm text-gray-700">
                        {u.firstName
                          ? u.firstName.charAt(0).toUpperCase()
                          : "U"}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {u.firstName} {u.lastName}
                        </div>
                        <div className="text-xs text-gray-500">{u.email}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {editingId === u.id ? (
                        <div className="flex items-center gap-2">
                          <select
                            value={newRole}
                            onChange={(e) => setNewRole(e.target.value)}
                            className="px-3 py-2 border rounded-md"
                          >
                            {(Object.keys(ROLE_LABELS) as Role[]).map((key) => (
                              <option key={key} value={key}>
                                {ROLE_LABELS[key]}
                              </option>
                            ))}
                          </select>
                          <Button size="sm" onClick={() => saveRole(u.id)}>
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={cancelEdit}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="text-sm text-gray-700 px-3 py-1 bg-gray-100 rounded">
                            {u.userType
                              ? ROLE_LABELS[
                                  String(u.userType).toLowerCase() as Role
                                ]
                              : "—"}
                          </div>
                          {canEdit() && (
                            <Button size="sm" onClick={() => startEdit(u)}>
                              Edit
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                <div className="flex items-center justify-between pt-3">
                  <div className="text-sm text-gray-600">
                    Showing {total === 0 ? 0 : start + 1} -{" "}
                    {start + paged.length} of {total} users
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page <= 1}
                    >
                      Previous
                    </Button>
                    <div className="text-sm text-gray-700">
                      Page {currentPage} / {totalPages}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page >= totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default UserRoleManager;
