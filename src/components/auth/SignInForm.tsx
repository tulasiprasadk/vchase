import React, { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase/config";
import { getDocument } from "@/lib/firebase/firestore";
import { signOutUser } from "@/lib/firebase/auth";
import { UserProfile } from "@/types";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import Link from "next/link";
import toast from "react-hot-toast";
import Image from "next/image";

const SignInForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showSuspendedModal, setShowSuspendedModal] = useState(false);
  const [suspendedStatus, setSuspendedStatus] = useState<string | null>(null);

  const { signIn } = useAuth();
  const router = useRouter();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      await signIn(email, password);
      toast.success("Signed in successfully!");

      // Add a small delay to ensure user profile is loaded
      toast.loading("Loading your dashboard...", { duration: 1500 });

      // Immediately check the user's profile from Firestore and enforce approval rules
      if (!auth) {
        toast.error("Authentication service is unavailable. Please try again.");
        setLoading(false);
        return;
      }

      const currentUser = auth.currentUser;
      if (!currentUser) {
        toast.error("Unable to verify user after sign in");
        setLoading(false);
        return;
      }

      const result = await getDocument("users", currentUser.uid);
      const profile = result.data as UserProfile | null;

      // If the user is not a super_admin, enforce centralized status-based login
      if (profile && String(profile.userType) !== "super_admin") {
        // Determine status: prefer explicit profile.status, fallback to legacy fields
        const p = profile as unknown as Record<string, unknown>;
        const rawStatus =
          (p.status as string) ||
          (p.isActive === false
            ? "blocked"
            : p.isApproved
            ? "active"
            : "pending");
        const status = String(rawStatus);

        // Allow login only when status is 'active' (accept 'approved' for legacy)
        if (!(status === "active" || status === "approved")) {
          await signOutUser();
          // show modal with status information
          setSuspendedStatus(status);
          setShowSuspendedModal(true);
          setLoading(false);
          return;
        }
      }

      setTimeout(() => {
        // The dashboard/index.tsx will handle redirecting sponsors to /dashboard/sponsorships
        router.push("/dashboard");
      }, 1800);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
      setLoading(false); // Only set loading to false on error
    }
    // Don't set loading to false here - keep it true during redirect delay
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/people-taking-part-high-protocol-event.jpg"
          alt="Event participants"
          fill
          style={{ objectFit: "cover" }}
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70" />
      </div>

      <div className="max-w-md w-full space-y-8 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl px-8 py-10">
        <Card>
          <CardHeader className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Sign in</h2>
            <p className="text-gray-600">Welcome back to EventSponsor</p>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                placeholder="Enter your email"
                disabled={loading}
              />

              <Input
                type={showPassword ? "text" : "password"}
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                placeholder="Enter your password"
                disabled={loading}
                suffixIcon={
                  showPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )
                }
                onSuffixClick={() => setShowPassword(!showPassword)}
              />

              <Button
                type="submit"
                className="w-full"
                loading={loading}
                disabled={loading}
              >
                {loading ? "Signing you in..." : "Sign In"}
              </Button>
            </form>

            {/* <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div> */}

            {/* <Button
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            
              Sign in with Google
            </Button> */}

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <Link
                  href="/auth/signup"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Suspended account modal */}
      {showSuspendedModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
            <h3 className="text-xl font-semibold mb-2">Account not active</h3>
            <p className="text-sm text-gray-700 mb-4">
              Your account is not active.
              {suspendedStatus && (
                <span className="block mt-2">
                  Current status: <strong>{suspendedStatus}</strong>
                </span>
              )}
              <span className="block mt-2">
                If you believe this is a mistake, please contact support or your
                account administrator for help.
              </span>
            </p>
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowSuspendedModal(false)}
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  window.location.href =
                    "mailto:support@example.com?subject=Account%20Suspended";
                }}
              >
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignInForm;
