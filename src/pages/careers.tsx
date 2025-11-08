import React, { useState, useEffect } from "react";
import Head from "next/head";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import { getCollection } from "@/lib/firebase/firestore";
import CareerApplicationForm from "@/components/careers/CareerApplicationForm";
import toast from "react-hot-toast";

// Job interface
interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: "full-time" | "part-time" | "contract" | "remote";
  description: string;
  requirements: string[];
  benefits: string[];
  salary?: string;
  postedAt: string;
  isRemote: boolean;
}

// Sample job data

const DEPARTMENTS = [
  { value: "all", label: "All Departments" },
  { value: "engineering", label: "Engineering" },
  { value: "marketing", label: "Marketing" },
  { value: "sales", label: "Sales" },
  { value: "design", label: "Design" },
  { value: "customer-success", label: "Customer Success" },
];

const JOB_TYPES = [
  { value: "all", label: "All Types" },
  { value: "full-time", label: "Full Time" },
  { value: "part-time", label: "Part Time" },
  { value: "contract", label: "Contract" },
  { value: "remote", label: "Remote" },
];

const CareersPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [applyingFor, setApplyingFor] = useState<string | null>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [expandedJob, setExpandedJob] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const loadJobs = async () => {
      setLoading(true);
      const { data, error } = await getCollection("careers");
      if (!mounted) return;
      setLoading(false);
      if (error) return toast.error("Failed to load jobs: " + error);
      // data is expected to be an array of job objects
      setJobs((data || []) as Job[]);
    };
    loadJobs();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const matchesDepartment =
      selectedDepartment === "all" ||
      job.department
        .toLowerCase()
        .replace(/\s+/g, "-")
        .includes(selectedDepartment);

    const matchesType =
      selectedType === "all" ||
      (selectedType === "remote" ? job.isRemote : job.type === selectedType);

    const matchesSearch =
      searchTerm === "" ||
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.requirements.some((req) =>
        req.toLowerCase().includes(searchTerm.toLowerCase())
      );

    return matchesDepartment && matchesType && matchesSearch;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case "full-time":
        return "bg-green-100 text-green-800";
      case "part-time":
        return "bg-blue-100 text-blue-800";
      case "contract":
        return "bg-purple-100 text-purple-800";
      case "remote":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner size="large" />
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Head>
        <title>Careers - EventSponsor</title>
        <meta
          name="description"
          content="Join our team and help shape the future of event sponsorship"
        />
      </Head>

      <Layout>
        <div className="min-h-screen bg-gray-50">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-green-600 to-blue-700 text-white py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Join Our Team
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                Help us revolutionize the event sponsorship industry. We&apos;re
                looking for passionate individuals ready to make an impact.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4">
                  <div className="text-2xl font-bold">{jobs.length}</div>
                  <div className="text-sm opacity-90">Open Positions</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4">
                  <div className="text-2xl font-bold">6</div>
                  <div className="text-sm opacity-90">Departments</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4">
                  <div className="text-2xl font-bold">🌍</div>
                  <div className="text-sm opacity-90">Remote Friendly</div>
                </div>
              </div>
            </div>
          </div>

          {/* Why Join Us Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Why Join EventSponsor?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We&apos;re building the future of event sponsorship, and we want
                you to be part of it.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚀</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Innovation
                </h3>
                <p className="text-gray-600">
                  Work on cutting-edge technology that transforms how events and
                  sponsorships work together.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤝</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Collaboration
                </h3>
                <p className="text-gray-600">
                  Join a diverse team of passionate professionals working
                  towards a common goal.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📈</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Growth
                </h3>
                <p className="text-gray-600">
                  Continuous learning opportunities and career development
                  support.
                </p>
              </div>
            </div>
          </div>

          {/* Filters Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex-1 max-w-md">
                  <input
                    type="text"
                    placeholder="Search jobs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-4">
                  <div className="w-full md:w-48">
                    <SearchableSelect
                      options={DEPARTMENTS}
                      value={selectedDepartment}
                      onSelect={setSelectedDepartment}
                      placeholder="Department..."
                      searchPlaceholder="Search departments..."
                    />
                  </div>
                  <div className="w-full md:w-40">
                    <SearchableSelect
                      options={JOB_TYPES}
                      value={selectedType}
                      onSelect={setSelectedType}
                      placeholder="Job Type..."
                      searchPlaceholder="Search types..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Jobs Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredJobs.map((job) => (
                <Card
                  key={job.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {job.title}
                        </h3>
                        <p className="text-gray-600">
                          {job.department} • {job.location}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${getJobTypeColor(
                            job.type
                          )}`}
                        >
                          {job.type.replace("-", " ").toUpperCase()}
                        </span>
                        {job.isRemote && (
                          <span className="px-3 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                            REMOTE
                          </span>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-700 mb-4 line-clamp-3">
                      {job.description}
                    </p>

                    {job.salary && (
                      <div className="mb-4">
                        <span className="text-sm font-medium text-gray-900">
                          Salary:{" "}
                        </span>
                        <span className="text-sm text-gray-600">
                          {job.salary}
                        </span>
                      </div>
                    )}

                    {/* Requirements (preview or full when expanded) */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        Requirements:
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {(expandedJob === job.id
                          ? job.requirements
                          : job.requirements.slice(0, 3)
                        ).map((req, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            <span
                              className={
                                expandedJob === job.id ? "" : "line-clamp-1"
                              }
                            >
                              {req}
                            </span>
                          </li>
                        ))}
                        {expandedJob !== job.id &&
                          job.requirements.length > 3 && (
                            <li className="text-blue-600 font-medium">
                              +{job.requirements.length - 3} more requirements
                            </li>
                          )}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        Posted {formatDate(job.postedAt)}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-gray-700"
                          onClick={() =>
                            setExpandedJob((prev) =>
                              prev === job.id ? null : job.id
                            )
                          }
                        >
                          {expandedJob === job.id
                            ? "Hide details"
                            : "Learn More"}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            setApplyingFor(job.id);
                            setShowApplyModal(true);
                          }}
                        >
                          Apply Now
                        </Button>
                      </div>
                    </div>

                    {/* Expanded details shown below the apply form or description */}
                    {expandedJob === job.id && (
                      <div className="mt-4 border-t pt-4">
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">
                            Full Description
                          </h4>
                          <p className="text-sm text-gray-700">
                            {job.description}
                          </p>
                        </div>

                        {job.benefits && job.benefits.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">
                              Benefits
                            </h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {job.benefits.map((b, i) => (
                                <li key={i} className="flex items-start">
                                  <span className="text-green-500 mr-2">•</span>
                                  <span>{b}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredJobs.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-4">
                  No jobs found matching your criteria.
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedDepartment("all");
                    setSelectedType("all");
                    setSearchTerm("");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}

            {/* Call to Action */}
            <div className="mt-16 bg-white rounded-lg shadow-sm p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Don&apos;t See the Perfect Role?
              </h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                We&apos;re always looking for talented individuals. Send us your
                resume and let us know how you can contribute to our mission.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button>Send Resume</Button>
                <Button variant="outline">Follow Us</Button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
      {/* Application Modal */}
      {showApplyModal && applyingFor && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Apply for Role
              </h3>
              <button
                onClick={() => {
                  setShowApplyModal(false);
                  setApplyingFor(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {(() => {
              const job = jobs.find((j) => j.id === applyingFor);
              if (!applyingFor) return null;
              return (
                <CareerApplicationForm
                  jobId={applyingFor}
                  jobTitle={job?.title || ""}
                  onApplied={() => {
                    setShowApplyModal(false);
                    setApplyingFor(null);
                  }}
                />
              );
            })()}
          </div>
        </div>
      )}
    </>
  );
};

export default CareersPage;
