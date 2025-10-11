import React, { useEffect, useState } from "react";
import { getCollection, updateDocument } from "@/lib/firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";

type App = {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  jobId?: string;
  jobTitle?: string;
  coverLetter?: string;
  status?: string;
  _id?: string;
  documentId?: string;
};

const statuses = ["Review", "Interview", "Reject", "Hire"] as const;

const CareerApplicationsManager: React.FC = () => {
  const { userProfile } = useAuth();
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      const { data, error } = await getCollection("career_applications");
      if (!mounted) return;
      if (error) return toast.error("Failed to load applications: " + error);
      setApps(data || []);
      setLoading(false);
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const canManage =
    userProfile &&
    ["admin", "super_admin", "supervisor"].includes(userProfile.userType || "");
  if (!canManage)
    return (
      <div className="text-sm text-gray-500">
        You don&apos;t have permission to view applications.
      </div>
    );

  const changeStatus = async (id: string, next: (typeof statuses)[number]) => {
    const { error } = await updateDocument("career_applications", id, {
      status: next,
      updatedAt: new Date().toISOString(),
    });
    if (error) return toast.error("Failed to update: " + error);
    setApps((a) => a.map((x) => (x.id === id ? { ...x, status: next } : x)));
    toast.success("Updated");
  };

  const getId = (a: App) => (a.id || a._id || a.documentId || "") as string;

  return (
    <div className="space-y-4">
      {loading && <div>Loading...</div>}
      {!loading && apps.length === 0 && (
        <div className="text-sm text-gray-500">No applications yet.</div>
      )}
      <div className="grid gap-4">
        {apps.map((a: App) => (
          <div key={getId(a)} className="p-4 border rounded bg-white shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium text-gray-800">
                  {a.firstName} {a.lastName}
                </div>
                <div className="text-sm text-gray-600">
                  {a.email} • {a.phone}
                </div>
                <div className="text-sm text-gray-700 mt-2">
                  Applied for: {a.jobTitle || a.jobId}
                </div>
                <div className="mt-2 text-sm whitespace-pre-wrap text-gray-600">
                  {a.coverLetter}
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <div className="text-sm text-gray-600">
                  Status:{" "}
                  <span
                    className={`font-semibold ${
                      ((a.status || "").toLowerCase().includes("reject") &&
                        "text-red-600") ||
                      ((a.status || "").toLowerCase().includes("review") &&
                        "text-amber-600") ||
                      ((a.status || "").toLowerCase().includes("interview") &&
                        "text-blue-600") ||
                      ((a.status || "").toLowerCase().includes("hire") &&
                        "text-green-600") ||
                      "text-gray-700"
                    }`}
                  >
                    {a.status || "Unknown"}
                  </span>
                </div>
                <div className="flex space-x-2">
                  {statuses.map((s) => (
                    <Button
                      key={s}
                      size="sm"
                      onClick={() => changeStatus(getId(a), s)}
                    >
                      {s}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CareerApplicationsManager;
