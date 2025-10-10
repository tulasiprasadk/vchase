import React, { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
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

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to EventSponsor
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
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
                  className={`cursor-pointer transition-all duration-300 hover:shadow-xl ${
                    isSelected
                      ? `${role.borderColor} border-2 shadow-lg scale-105`
                      : "border border-gray-200 hover:border-gray-300"
                  } ${role.bgColor}`}
                  onClick={() => setSelectedRole(role.id)}
                >
                  <CardHeader className="text-center pb-4">
                    <div
                      className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${role.color} flex items-center justify-center mb-4`}
                    >
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      {role.title}
                    </CardTitle>
                    <p className="text-gray-600 mt-2">{role.description}</p>
                  </CardHeader>

                  <CardContent>
                    <ul className="space-y-3">
                      {role.features.map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-center text-sm text-gray-700"
                        >
                          <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {isSelected && (
                      <div className="mt-6 flex items-center justify-center">
                        <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
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
    </>
  );
};

export default RoleSelectionPage;
