import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import {
  Home,
  Calendar,
  Settings,
  CreditCard,
  LogOut,
  Menu,
  X,
  MessageCircle,
  AlertTriangle,
  Users,
  BarChart3,
  CheckCircle,
} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
}) => {
  const { userProfile, signOut } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const organizerNavItems = [
    { href: "/dashboard", label: "Overview", icon: Home },
    { href: "/dashboard/events", label: "My Events", icon: Calendar },
    {
      href: "/dashboard/manage-enquiries",
      label: "Sponsorship Enquiries",
      icon: CreditCard,
    },
    { href: "/dashboard/messages", label: "Messages", icon: MessageCircle },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  const sponsorNavItems = [
    {
      href: "/dashboard/sponsorships",
      label: "Sponsorships",
      icon: CreditCard,
    },
    { href: "/dashboard/messages", label: "Messages", icon: MessageCircle },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  const adminNavItems = [
    { href: "/dashboard/admin", label: "Overview", icon: Home },
    {
      href: "/dashboard/admin/moderate",
      label: "Moderate",
      icon: AlertTriangle,
    },
    { href: "/dashboard/admin/users", label: "Users", icon: Users },
    {
      href: "/dashboard/admin/verification-requests",
      label: "Verification Requests",
      icon: CheckCircle,
    },
    { href: "/dashboard/admin/reports", label: "Reports", icon: BarChart3 },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  const getNavItems = () => {
    switch (userProfile && userProfile.userType) {
      case "organizer":
        return organizerNavItems;
      case "sponsor":
        return sponsorNavItems;
      case "admin":
        return adminNavItems;
      default:
        return organizerNavItems;
    }
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 z-50 w-full bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="text-xl font-bold text-blue-600">
            EventSponsor
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            {sidebarOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center px-6 border-b">
          <Link href="/" className="text-xl font-bold text-blue-600">
            EventSponsor
          </Link>
        </div>

        <nav className="mt-6 px-3 flex-1 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = router.pathname === item.href;
              const IconComponent = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <IconComponent className="mr-3 h-5 w-5" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User info and sign out */}
        <div className="absolute bottom-0 w-full p-4 border-t bg-white">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-blue-600">
                {userProfile && userProfile.firstName
                  ? userProfile.firstName.charAt(0)
                  : ""}
                {userProfile && userProfile.lastName
                  ? userProfile.lastName.charAt(0)
                  : ""}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {userProfile && userProfile.firstName
                  ? userProfile.firstName
                  : ""}{" "}
                {userProfile && userProfile.lastName
                  ? userProfile.lastName
                  : ""}
              </p>
              <p className="text-xs text-gray-500 truncate capitalize">
                {userProfile && userProfile.userType
                  ? userProfile.userType
                  : ""}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start text-gray-600 hover:text-gray-900"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header - Hidden on mobile when sidebar is visible */}
        <header className="bg-white shadow-sm border-b lg:block hidden">
          <div className="px-4 lg:px-6 py-4">
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
              {title || "Dashboard"}
            </h1>
          </div>
        </header>

        {/* Mobile header spacer */}
        <div className="h-16 lg:hidden"></div>

        {/* Page content */}
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
