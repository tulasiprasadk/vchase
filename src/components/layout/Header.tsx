import React, { useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { signOutUser } from "@/lib/firebase/auth";
import Button from "@/components/ui/Button";

const Header: React.FC = () => {
  const { user, userProfile, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOutUser();
  };

  const scrollToSection = useCallback(
    (sectionId: string) => {
      // If we're not on the homepage, navigate there first
      if (router.pathname !== "/") {
        router.push(`/#${sectionId}`);
        return;
      }

      // If we're on the homepage, scroll to the section
      const element = document.getElementById(sectionId);
      if (element) {
        const headerOffset = 80; // Account for fixed header height
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    },
    [router]
  );

  // Handle hash navigation on page load
  useEffect(() => {
    if (router.pathname === "/" && router.asPath.includes("#")) {
      const hash = router.asPath.split("#")[1];
      if (hash) {
        // Small delay to ensure the page is fully loaded
        setTimeout(() => scrollToSection(hash), 100);
      }
    }
  }, [router, scrollToSection]);

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-3">
              {/* Logo SVG */}
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2ZM11 14H13V16H11V14ZM11 10V12H13V10C13 8.9 12.1 8 11 8S9 8.9 9 10H11Z" />
                  <circle cx="12" cy="6" r="2" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-blue-600">
                EventSponsor
              </span>
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

            {/* Smooth scroll navigation links */}
            <button
              onClick={() => scrollToSection("about-us")}
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
            >
              About Us
            </button>

            <button
              onClick={() => scrollToSection("contact-us")}
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
            >
              Contact Us
            </button>

            <button
              onClick={() => scrollToSection("service-policy")}
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
            >
              Service Policy
            </button>

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
              <div className="flex items-center space-x-2 text-gray-700">
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
