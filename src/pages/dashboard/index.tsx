import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { useLayout } from "@/context/LayoutContext";
import { DashboardCard } from "@/components/ui/DashboardCard";
import { LayoutCustomizer } from "@/components/layout/LayoutCustomizer";
import {
  Calendar,
  DollarSign,
  Handshake,
  Users,
  CreditCard,
  BarChart3,
  TrendingUp,
  UserCheck,
  Settings,
} from "lucide-react";
import Button from "@/components/ui/Button";

const DashboardPage: React.FC = () => {
  const { userProfile } = useAuth();
  const { settings } = useLayout();
  const router = useRouter();
  const [showLayoutCustomizer, setShowLayoutCustomizer] = useState(false);

  // Redirect sponsors to their main sponsorships page
  useEffect(() => {
    if (userProfile && userProfile.userType === "sponsor") {
      router.replace("/dashboard/sponsorships");
    }
  }, [userProfile, router]);

  const getGridClasses = () => {
    const baseClasses = "gap-4 lg:gap-6";

    switch (settings.mode) {
      case "list":
        return `space-y-4 ${baseClasses}`;
      case "compact":
        return `grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 ${baseClasses}`;
      default: // grid
        return `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 ${baseClasses}`;
    }
  };

  const renderOrganizerDashboard = () => {
    const cards = [
      {
        title: "Active Events",
        value: 5,
        icon: Calendar,
        color: "blue",
        trend: { value: 12.5, isPositive: true },
      },
      {
        title: "Total Revenue",
        value: "$12,500",
        icon: DollarSign,
        color: "green",
        trend: { value: 8.3, isPositive: true },
      },
      {
        title: "Sponsors",
        value: 12,
        icon: Handshake,
        color: "purple",
        trend: { value: 15.0, isPositive: true },
      },
      {
        title: "Total Attendees",
        value: "2,450",
        icon: Users,
        color: "indigo",
        trend: { value: 7.2, isPositive: true },
      },
    ];

    return (
      <div className="space-y-6">
        {settings.showMetrics && (
          <div className={getGridClasses()}>
            {cards.map((card, index) => (
              <DashboardCard key={index} {...card} />
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white p-4 lg:p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Recent Events
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-sm text-gray-600 truncate pr-2">
                  Tech Summit 2025
                </span>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded whitespace-nowrap">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-sm text-gray-600 truncate pr-2">
                  Marketing Conference
                </span>
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded whitespace-nowrap">
                  Planning
                </span>
              </div>
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-sm text-gray-600 truncate pr-2">
                  AI Workshop Series
                </span>
                <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded whitespace-nowrap">
                  Draft
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 lg:p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Sponsorship Applications
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-sm text-gray-600 truncate pr-2">
                  TechCorp - Premium Package
                </span>
                <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded whitespace-nowrap">
                  Pending
                </span>
              </div>
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-sm text-gray-600 truncate pr-2">
                  StartupXYZ - Gold Package
                </span>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded whitespace-nowrap">
                  Approved
                </span>
              </div>
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-sm text-gray-600 truncate pr-2">
                  InnovateCo - Silver Package
                </span>
                <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded whitespace-nowrap">
                  Pending
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSponsorDashboard = () => {
    const cards = [
      {
        title: "Active Sponsorships",
        value: 8,
        icon: CreditCard,
        color: "blue",
        trend: { value: 6.2, isPositive: true },
      },
      {
        title: "Total Invested",
        value: "$25,000",
        icon: DollarSign,
        color: "green",
        trend: { value: 12.1, isPositive: true },
      },
      {
        title: "Reach",
        value: "150K",
        icon: BarChart3,
        color: "purple",
        trend: { value: 18.5, isPositive: true },
      },
      {
        title: "ROI",
        value: "324%",
        icon: TrendingUp,
        color: "indigo",
        trend: { value: 24.3, isPositive: true },
      },
    ];

    return (
      <div className="space-y-6">
        {settings.showMetrics && (
          <div className={getGridClasses()}>
            {cards.map((card, index) => (
              <DashboardCard key={index} {...card} />
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white p-4 lg:p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Current Sponsorships
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-sm text-gray-600 truncate pr-2">
                  Tech Summit 2025
                </span>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded whitespace-nowrap">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-sm text-gray-600 truncate pr-2">
                  Marketing Conference
                </span>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded whitespace-nowrap">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-sm text-gray-600 truncate pr-2">
                  AI Workshop Series
                </span>
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded whitespace-nowrap">
                  Upcoming
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 lg:p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Recommended Events
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-sm text-gray-600 truncate pr-2">
                  Data Science Meetup
                </span>
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded whitespace-nowrap">
                  New
                </span>
              </div>
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-sm text-gray-600 truncate pr-2">
                  Startup Pitch Day
                </span>
                <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded whitespace-nowrap">
                  Featured
                </span>
              </div>
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-sm text-gray-600 truncate pr-2">
                  E-commerce Summit
                </span>
                <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded whitespace-nowrap">
                  Limited
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAdminDashboard = () => {
    const cards = [
      {
        title: "Total Users",
        value: "1,245",
        icon: UserCheck,
        color: "blue",
        trend: { value: 5.2, isPositive: true },
      },
      {
        title: "Total Events",
        value: 156,
        icon: Calendar,
        color: "green",
        trend: { value: 12.1, isPositive: true },
      },
      {
        title: "Platform Revenue",
        value: "$125,000",
        icon: DollarSign,
        color: "purple",
        trend: { value: 23.4, isPositive: true },
      },
      {
        title: "Growth Rate",
        value: "+23%",
        icon: TrendingUp,
        color: "indigo",
        trend: { value: 15.7, isPositive: true },
      },
    ];

    return (
      <div className="space-y-6">
        {settings.showMetrics && (
          <div className={getGridClasses()}>
            {cards.map((card, index) => (
              <DashboardCard key={index} {...card} />
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white p-4 lg:p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3">
              <div className="text-sm text-gray-600">
                New user registered: john.doe@example.com
              </div>
              <div className="text-sm text-gray-600">
                Event created: Digital Marketing Summit
              </div>
              <div className="text-sm text-gray-600">
                Sponsorship approved: TechCorp x AI Conference
              </div>
            </div>
          </div>

          <div className="bg-white p-4 lg:p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              System Health
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">API Response Time</span>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded whitespace-nowrap">
                  85ms
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Database Status</span>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded whitespace-nowrap">
                  Healthy
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Sessions</span>
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded whitespace-nowrap">
                  342
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDashboardContent = () => {
    switch (userProfile?.userType) {
      case "organizer":
        return renderOrganizerDashboard();
      case "sponsor":
        return renderSponsorDashboard();
      case "admin":
        return renderAdminDashboard();
      default:
        return renderOrganizerDashboard();
    }
  };

  return (
    <ProtectedRoute requireAuth={true}>
      <Head>
        <title>Dashboard - EventSponsor</title>
        <meta name="description" content="EventSponsor Dashboard" />
      </Head>
      <DashboardLayout title="Dashboard">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl text-gray-600">
              Welcome back, {userProfile?.firstName}! 👋
            </h2>
            <p className="text-gray-500 capitalize">
              {userProfile?.userType} Dashboard
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={() => setShowLayoutCustomizer(true)}
            className="flex items-center gap-2 bg-gray-800 text-white hover:bg-gray-700 border-gray-700"
          >
            <Settings className="h-4 w-4" />
            Customize Layout
          </Button>
        </div>
        {renderDashboardContent()}

        <LayoutCustomizer
          isOpen={showLayoutCustomizer}
          onClose={() => setShowLayoutCustomizer(false)}
        />
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default DashboardPage;
