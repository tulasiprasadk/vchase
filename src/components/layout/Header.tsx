import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { signOutUser } from "@/lib/firebase/auth";
import Button from "@/components/ui/Button";

const Header: React.FC = () => {
  const { user, userProfile, isAuthenticated } = useAuth();

  const handleSignOut = async () => {
    await signOutUser();
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              EventSponsor
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              href="/events"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Browse Events
            </Link>
            {isAuthenticated &&
              userProfile &&
              userProfile.userType === "organizer" && (
                <Link
                  href="/dashboard/events"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  My Events
                </Link>
              )}
            {isAuthenticated &&
              userProfile &&
              userProfile.userType === "sponsor" && (
                <Link
                  href="/dashboard/sponsorships"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  My Sponsorships
                </Link>
              )}
          </nav>

          {/* User menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Hello, {user && user.displayName ? user.displayName : "User"}!
                </span>
                <Link href="/dashboard">
                  <Button variant="outline" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/signin">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm">Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
