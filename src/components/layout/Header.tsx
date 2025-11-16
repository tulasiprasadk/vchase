import React, { useEffect, useCallback, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { signOutUser } from "@/lib/firebase/auth";
import Button from "@/components/ui/Button";
import { Menu, X } from "lucide-react";

const Header: React.FC = () => {
  const { user, userProfile, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isMouOpen, setIsMouOpen] = useState(false);
  const mouButtonRef = useRef<HTMLButtonElement | null>(null);
  const mouMenuRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        isMouOpen &&
        mouMenuRef.current &&
        mouButtonRef.current &&
        !mouMenuRef.current.contains(target) &&
        !mouButtonRef.current.contains(target)
      ) {
        setIsMouOpen(false);
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (isMouOpen && e.key === "Escape") {
        setIsMouOpen(false);
        mouButtonRef.current?.focus();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMouOpen]);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md border-b border-slate-200 w-full max-w-full overflow-visible sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              {/* Logo Image */}
              <div className="w-28 h-10 md:w-36 md:h-12 relative">
                <Image
                  src="/images/logo.png"
                  alt="V Chase Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Navigation - desktop only */}
          <nav className="hidden md:flex items-center gap-8">
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
              Contact
            </button>

            <div className="relative">
              <button
                ref={mouButtonRef}
                aria-haspopup="true"
                aria-expanded={isMouOpen}
                onClick={() => setIsMouOpen((prev) => !prev)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setIsMouOpen(true);
                    setTimeout(() => {
                      mouMenuRef.current
                        ?.querySelector<HTMLAnchorElement>("a")
                        ?.focus();
                    }, 0);
                  }
                }}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1"
              >
                MOU
                <span className="text-xs">▾</span>
              </button>
              {isMouOpen && (
                <div
                  ref={mouMenuRef}
                  role="menu"
                  aria-label="MOU links"
                  className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50"
                >
                  <Link
                    href="/mou/organizers"
                    role="menuitem"
                    tabIndex={0}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsMouOpen(false)}
                  >
                    Organizers MOU
                  </Link>
                  <Link
                    href="/mou/sponsors"
                    role="menuitem"
                    tabIndex={0}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsMouOpen(false)}
                  >
                    Sponsors MOU
                  </Link>
            <Link
                    href="/mou/consultation"
                    role="menuitem"
                    tabIndex={0}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsMouOpen(false)}
                  >
                    Consultation MOU
            </Link>
                </div>
              )}
            </div>

            <Link
              href="/blogs"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Blog
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

          {/* User menu + Mobile toggle */}
          <div className="flex items-center space-x-2 md:space-x-4">
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
                {/* No login/register buttons - users will access via "Let's Get Started" */}
              </div>
            )}
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              aria-label="Toggle menu"
              onClick={() => setMobileMenuOpen((v) => !v)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <nav className="flex flex-col py-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  scrollToSection("about-us");
                }}
                className="text-left px-4 py-2 text-gray-700 hover:bg-gray-50"
              >
                About Us
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  scrollToSection("contact-us");
                }}
                className="text-left px-4 py-2 text-gray-700 hover:bg-gray-50"
              >
                Contact
              </button>
              <div className="px-2">
                <div className="border rounded-md overflow-hidden">
                  <button
                    ref={mouButtonRef}
                    onClick={() => setIsMouOpen((prev) => !prev)}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    MOU
                  </button>
                  {isMouOpen && (
                    <div ref={mouMenuRef} className="border-t">
                      <Link
                        href="/mou/organizers"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => {
                          setIsMouOpen(false);
                          setMobileMenuOpen(false);
                        }}
                      >
                        Organizers MOU
                      </Link>
                      <Link
                        href="/mou/sponsors"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => {
                          setIsMouOpen(false);
                          setMobileMenuOpen(false);
                        }}
                      >
                        Sponsors MOU
                      </Link>
                      <Link
                        href="/mou/consultation"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => {
                          setIsMouOpen(false);
                          setMobileMenuOpen(false);
                        }}
                      >
                        Consultation MOU
                      </Link>
                    </div>
                  )}
                </div>
              </div>
              <Link
                href="/blogs"
                className="px-4 py-2 text-gray-700 hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </Link>
              {isAuthenticated && userProfile?.userType === "organizer" && (
                <Link
                  href="/dashboard/events"
                  className="px-4 py-2 text-gray-700 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Events
                </Link>
              )}
              {isAuthenticated && userProfile?.userType === "sponsor" && (
                <Link
                  href="/dashboard/sponsorships"
                  className="px-4 py-2 text-gray-700 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Sponsorships
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
