import React, { useEffect, useState } from "react";
import Head from "next/head";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import {
  subscribeToCollection,
  deleteDocument,
} from "@/lib/firebase/firestore";
import CareerForm from "@/components/careers/CareerForm";
import { Edit, Trash2, Briefcase, Globe, Users } from "lucide-react";
import toast from "react-hot-toast";

type Career = {
  id: string;
  title?: string;
  department?: string;
  location?: string;
  description?: string;
  postedAt?: string;
  isRemote?: boolean;
};

const AdminCareersPage: React.FC = () => {
  const [jobs, setJobs] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState<Career | null>(null);

  useEffect(() => {
    const unsub = subscribeToCollection("careers", (data: unknown[]) => {
      setJobs(data as Career[]);
      setLoading(false);
    });

    return () => {
      if (unsub) unsub();
    };
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this job posting?")) return;
    const { error } = await deleteDocument("careers", id);
    if (error) return toast.error("Failed to delete job: " + error);
    toast.success("Job deleted");
  };

  return (
    <ProtectedRoute
      requireAuth={true}
      allowedRoles={["admin", "executive", "super_admin", "supervisor"]}
    >
      <Head>
        <title>Careers Management - Admin</title>
      </Head>
      <DashboardLayout title="Careers Management">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <Briefcase className="h-6 w-6 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold text-gray-700">
                    {jobs.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Jobs</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <Globe className="h-6 w-6 text-orange-500" />
                <div>
                  <div className="text-2xl font-bold text-gray-700">
                    {jobs.filter((j) => j.isRemote).length}
                  </div>
                  <div className="text-sm text-gray-600">Remote Friendly</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <Users className="h-6 w-6 text-green-600" />
                <div>
                  <div className="text-2xl font-bold text-gray-700">
                    {jobs.length}
                  </div>
                  <div className="text-sm text-gray-600">Open Positions</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Job Listings
                  </h2>
                  <div className="text-sm text-gray-500">
                    {jobs.length} total
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    placeholder="Search jobs..."
                    className="px-3 py-2 border border-gray-200 rounded-md text-sm w-64 placeholder-gray-400"
                  />
                  <Button
                    onClick={() => {
                      setEditingJob(null);
                      setShowModal(true);
                    }}
                    className="inline-flex items-center gap-2"
                  >
                    <Briefcase className="h-4 w-4" />
                    Create Job
                  </Button>
                </div>
              </div>

              {loading ? (
                <div className="text-gray-600">Loading jobs...</div>
              ) : jobs.length === 0 ? (
                <div className="text-gray-600">No job postings yet.</div>
              ) : (
                <div className="space-y-3">
                  {jobs.map((job) => (
                    <div
                      key={job.id}
                      className="p-4 bg-white rounded shadow flex justify-between items-start"
                    >
                      <div className="flex-1 pr-4">
                        <div className="font-medium text-gray-700 text-lg">
                          {job.title}
                        </div>
                        <div className="text-sm text-gray-600">
                          {job.department} • {job.location}
                        </div>
                        <div className="text-sm text-gray-700 mt-2 line-clamp-2">
                          {job.description}
                        </div>
                        <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                          {job.isRemote && (
                            <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
                              Remote
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="text-xs text-gray-500 hidden md:block">
                          {job.postedAt
                            ? new Date(job.postedAt).toLocaleDateString()
                            : ""}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-800"
                            onClick={() => {
                              setEditingJob(job);
                              setShowModal(true);
                            }}
                          >
                            <Edit className="h-4 w-4 text-blue-800" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(job.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-800" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">
                Create / Edit
              </h3>
              <div className="space-y-3">
                <Button
                  onClick={() => {
                    setEditingJob(null);
                    setShowModal(true);
                  }}
                  className="w-full"
                >
                  Create Job
                </Button>
                {editingJob && (
                  <Button
                    variant="outline"
                    onClick={() => setShowModal(true)}
                    className="w-full"
                  >
                    Edit Selected
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingJob ? "Edit Job" : "Create Job"}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingJob(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <CareerForm
              initialData={editingJob}
              onCreated={() => {
                toast.success("Job created");
                setShowModal(false);
                setEditingJob(null);
              }}
              onUpdated={() => {
                toast.success("Job updated");
                setShowModal(false);
                setEditingJob(null);
              }}
            />
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
};

export default AdminCareersPage;
