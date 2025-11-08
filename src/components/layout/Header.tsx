import React, { useEffect, useCallback, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";

const Header: React.FC = () => {
  const { user, userProfile, isAuthenticated } = useAuth();
  const router = useRouter();

  // Temporary placeholder for sign out (Firebase removed)
  const handleSignOut = async () => {
    console.log("Sign-out clicked — Firebase removed");
    // You can later add a new logout logic here if needed
  };

  const scrollToSection = useCallback(
    (sectionId: string) => {
      // If we're not on the homepage, navigate there first
      if (router.pathname !== "/") {
        router.push(`/#${sectionId}`);
        return;
      }
    },
    [router]
  );

  return (
    <header>
      {/* Your existing header content */}
    </header>
  );
};

export default Header;
