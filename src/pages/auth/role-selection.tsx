import React, { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import {
  Calendar,
  DollarSign,
  Briefcase,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

const RoleSelectionPage: React.FC = () => {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const roles = [
    {
      id: "organizer",
      title: "Event Organizer",
      description:
        "Create and manage events, find sponsors, and grow your event business",
      icon: Calendar,
      features: [
        "Create unlimited events",
        "Manage sponsorship enquiries",
        "Access sponsor database",
        "Event analytics & reporting",
      ],
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      id: "sponsor",
      title: "Sponsor",
      description:
        "Find events to sponsor, manage sponsorships, and maximize ROI",
      icon: DollarSign,
      features: [
        "Browse events to sponsor",
        "Manage sponsorship packages",
        "Track sponsorship performance",
        "ROI calculator & analytics",
      ],
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      id: "business-consultancy",
      title: "Consultant",
      description:
        "Offer consulting services for event management and sponsorship",
      icon: Briefcase,
      features: [
        "Offer consulting services",
        "Connect with organizers",
        "Manage client projects",
        "Service-based business tools",
      ],
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
  ];

  const handleContinue = () => {
    if (selectedRole) {
      // Store the selected role in localStorage or URL params
      localStorage.setItem("selectedRole", selectedRole);
      router.push(`/auth/signup?role=${selectedRole}`);
    }
  };

  return (
    <>
      <Head>
        <title>Choose Your Role | EventSponsor</title>
        <meta
          name="description"
          content="Select whether you're an event organizer, sponsor, or consultant to get started"
        />
      </Head>

      <Layout>
        <div className="min-h-screen relative py-12 px-4">
          {/* Background image (local) */}
          <div className="absolute inset-0 -z-10">
            <Image
              src="/images/people-taking-part-high-protocol-event.jpg"
              alt="Event participants"
              fill
              style={{ objectFit: "cover" }}
              priority={false}
            />
            {/* gradient overlay for improved contrast (stronger at top) */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/10" />
          </div>

          <div className="max-w-6xl mx-auto relative z-10">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
                Welcome to EventSponsor
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow">
                Choose your role to get started with the platform that connects
                event organizers, sponsors, and consultants
              </p>
            </div>

            {/* Role Selection Cards */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {roles.map((role) => {
                const Icon = role.icon;
                const isSelected = selectedRole === role.id;

                return (
                  <Card
                    key={role.id}
                    className={`cursor-pointer transition-all duration-300 backdrop-blur-md bg-white/10 border border-white/20 text-white/90 ${
                      isSelected
                        ? `ring-1 ring-white/30 shadow-2xl scale-105`
                        : `hover:shadow-lg`
                    }`}
                    onClick={() => setSelectedRole(role.id)}
                  >
                    <CardHeader className="text-center pb-4">
                      <div
                        className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${role.color} flex items-center justify-center mb-4 shadow-lg`}
                      >
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-2xl font-bold text-white">
                        {role.title}
                      </CardTitle>
                      <p className="text-white/85 mt-2">{role.description}</p>
                    </CardHeader>

                    <CardContent>
                      <ul className="space-y-3">
                        {role.features.map((feature, index) => (
                          <li
                            key={index}
                            className="flex items-center text-sm text-white/90"
                          >
                            <CheckCircle className="h-4 w-4 text-green-200 mr-3 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      {isSelected && (
                        <div className="mt-6 flex items-center justify-center">
                          <div className="bg-white/10 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur">
                            Selected
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Continue Button */}
            <div className="text-center">
              <Button
                onClick={handleContinue}
                disabled={!selectedRole}
                size="lg"
                className={`px-12 py-4 text-lg font-semibold transition-all duration-300 ${
                  selectedRole
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Continue to Sign Up
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <p className="mt-6 text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/auth/signin"
                  className="text-purple-600 hover:text-purple-800 font-medium"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default RoleSelectionPage;
