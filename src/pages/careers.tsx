import React, { useState, useEffect } from "react";
import Head from "next/head";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { SearchableSelect } from "@/components/ui/SearchableSelect";

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
const SAMPLE_JOBS: Job[] = [
  {
    id: "1",
    title: "Senior Event Marketing Specialist",
    department: "Marketing",
    location: "New York, NY",
    type: "full-time",
    description:
      "Lead marketing campaigns for high-profile events and sponsorship partnerships. Develop comprehensive marketing strategies that drive engagement and maximize ROI for our clients.",
    requirements: [
      "5+ years of event marketing experience",
      "Strong understanding of digital marketing channels",
      "Experience with CRM systems and analytics tools",
      "Excellent communication and project management skills",
      "Bachelor's degree in Marketing, Business, or related field",
    ],
    benefits: [
      "Competitive salary + performance bonuses",
      "Health, dental, and vision insurance",
      "Flexible work arrangements",
      "Professional development budget",
      "Team building events and retreats",
    ],
    salary: "$80,000 - $110,000",
    postedAt: "2024-01-10",
    isRemote: false,
  },
  {
    id: "2",
    title: "Full Stack Developer",
    department: "Engineering",
    location: "Remote",
    type: "full-time",
    description:
      "Build and maintain scalable web applications that power our event sponsorship platform. Work with modern technologies and contribute to all aspects of the development lifecycle.",
    requirements: [
      "3+ years of full-stack development experience",
      "Proficiency in React, Node.js, and TypeScript",
      "Experience with Firebase or similar backend services",
      "Knowledge of modern web development practices",
      "Strong problem-solving and collaboration skills",
    ],
    benefits: [
      "Competitive salary + equity package",
      "100% remote work flexibility",
      "Health and wellness stipend",
      "Latest development tools and equipment",
      "Learning and development opportunities",
    ],
    salary: "$90,000 - $130,000",
    postedAt: "2024-01-08",
    isRemote: true,
  },
  {
    id: "3",
    title: "Business Development Manager",
    department: "Sales",
    location: "San Francisco, CA",
    type: "full-time",
    description:
      "Drive business growth by identifying and securing new partnership opportunities. Build relationships with event organizers and sponsors to expand our platform's reach.",
    requirements: [
      "3+ years in business development or sales",
      "Experience in B2B partnerships",
      "Strong negotiation and presentation skills",
      "Understanding of event industry dynamics",
      "Track record of meeting/exceeding targets",
    ],
    benefits: [
      "Base salary + uncapped commission",
      "Health, dental, and vision coverage",
      "Company car or transportation allowance",
      "Professional development opportunities",
      "Team incentives and rewards",
    ],
    salary: "$70,000 - $100,000 + commission",
    postedAt: "2024-01-05",
    isRemote: false,
  },
  {
    id: "4",
    title: "UX/UI Designer",
    department: "Design",
    location: "Austin, TX",
    type: "full-time",
    description:
      "Create intuitive and beautiful user experiences for our event sponsorship platform. Work closely with product and engineering teams to design interfaces that delight users.",
    requirements: [
      "3+ years of UX/UI design experience",
      "Proficiency in Figma, Sketch, or similar tools",
      "Strong portfolio demonstrating design process",
      "Understanding of user-centered design principles",
      "Experience with design systems",
    ],
    benefits: [
      "Competitive salary + design tool stipend",
      "Health and wellness benefits",
      "Flexible work schedule",
      "Creative work environment",
      "Conference attendance budget",
    ],
    salary: "$75,000 - $105,000",
    postedAt: "2024-01-03",
    isRemote: false,
  },
  {
    id: "5",
    title: "Customer Success Specialist",
    department: "Customer Success",
    location: "Remote",
    type: "full-time",
    description:
      "Ensure our clients achieve their goals through proactive support and guidance. Help event organizers and sponsors maximize their success on our platform.",
    requirements: [
      "2+ years in customer success or account management",
      "Experience with SaaS platforms",
      "Strong communication and problem-solving skills",
      "Understanding of event industry",
      "Data-driven approach to customer success",
    ],
    benefits: [
      "Competitive salary + performance bonuses",
      "100% remote work",
      "Health and wellness benefits",
      "Professional development support",
      "Flexible PTO policy",
    ],
    salary: "$55,000 - $75,000",
    postedAt: "2023-12-28",
    isRemote: true,
  },
  {
    id: "6",
    title: "Content Marketing Manager",
    department: "Marketing",
    location: "Chicago, IL",
    type: "full-time",
    description:
      "Develop and execute content strategies that position us as thought leaders in the event sponsorship space. Create compelling content that drives engagement and conversions.",
    requirements: [
      "3+ years of content marketing experience",
      "Strong writing and editing skills",
      "Experience with content management systems",
      "SEO knowledge and analytics experience",
      "Understanding of B2B marketing",
    ],
    benefits: [
      "Competitive salary + performance incentives",
      "Health, dental, and vision insurance",
      "Flexible work arrangements",
      "Content creation budget",
      "Team collaboration events",
    ],
    salary: "$65,000 - $85,000",
    postedAt: "2023-12-20",
    isRemote: false,
  },
];

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

  useEffect(() => {
    // Simulate API call
    const loadJobs = async () => {
      setLoading(true);
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setJobs(SAMPLE_JOBS);
      setLoading(false);
    };

    loadJobs();
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

                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        Requirements:
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {job.requirements.slice(0, 3).map((req, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            <span className="line-clamp-1">{req}</span>
                          </li>
                        ))}
                        {job.requirements.length > 3 && (
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
                        <Button variant="outline" size="sm">
                          Learn More
                        </Button>
                        <Button size="sm">Apply Now</Button>
                      </div>
                    </div>
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
    </>
  );
};

export default CareersPage;
