import React, { useState } from "react";
import Head from "next/head";
import Layout from "@/components/layout/Layout";
import Button from "@/components/ui/Button";
import { signUpWithEmailAndPassword } from "@/lib/firebase/auth";
import { setDocument, getCollection } from "@/lib/firebase/firestore";
import toast from "react-hot-toast";
import { ROLE_PERMISSIONS, Role } from "@/lib/roles";
import { UserProfile } from "@/types";

// This page is intentionally debug-only. It creates test users for local/dev testing.
const debugUsers: Array<{
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userType: string;
}> = [
  {
    email: "superadmin@example.com",
    password: "admin_password_001",
    firstName: "Super",
    lastName: "Admin",
    userType: "super_admin",
  },
  {
    email: "admin1@example.com",
    password: "admin_password_001",
    firstName: "Admin",
    lastName: "One",
    userType: "admin",
  },
  {
    email: "supervisor1@example.com",
    password: "supervisor_password_001",
    firstName: "Supervisor",
    lastName: "One",
    userType: "supervisor",
  },
  {
    email: "executive1@example.com",
    password: "executive_password_001",
    firstName: "Executive",
    lastName: "One",
    userType: "executive",
  },
  {
    email: "organizer1@example.com",
    password: "organizer_password_001",
    firstName: "Organizer",
    lastName: "One",
    userType: "organizer",
  },
  {
    email: "sponsor1@example.com",
    password: "sponsor_password_001",
    firstName: "Sponsor",
    lastName: "One",
    userType: "sponsor",
  },
];

const DebugCreateUsersPage: React.FC = () => {
  const [running, setRunning] = useState(false);
  type ResultEntry = {
    success: boolean;
    message: string;
    uid?: string;
    permissions?: string[];
  };
  const [results, setResults] = useState<Record<string, ResultEntry>>({});

  const handleCreateAll = async () => {
    if (process.env.NODE_ENV === "production") {
      toast.error("Debug user creation is disabled in production");
      return;
    }

    setRunning(true);
    const existing = await getCollection("users");
    const existingUsers = (existing.data || []) as UserProfile[];

    const newResults: Record<string, ResultEntry> = {};

    for (const u of debugUsers) {
      try {
        // Skip if existing user with same email
        const already = existingUsers.find((e) => e.email === u.email);
        if (already) {
          // update profile if necessary (ensure we have an id)
          if (!already.id) {
            newResults[u.email] = {
              success: false,
              message: "Existing user record missing id",
            };
            continue;
          }

          const perms = ROLE_PERMISSIONS[u.userType as Role] || [];
          await setDocument("users", already.id, {
            email: u.email,
            firstName: u.firstName,
            lastName: u.lastName,
            userType: u.userType,
            isActive: true,
            permissions: perms,
          });

          newResults[u.email] = {
            success: true,
            message: "Updated existing profile",
            permissions: perms,
            uid: already.id,
          };
          continue;
        }

        // create auth account
        const res = await signUpWithEmailAndPassword(
          u.email,
          u.password,
          `${u.firstName} ${u.lastName}`
        );
        if (res.error) {
          // If email already in use, try to find and update
          newResults[u.email] = { success: false, message: res.error };
          continue;
        }

        if (res.user) {
          // create user profile in Firestore
          const perms = ROLE_PERMISSIONS[u.userType as Role] || [];
          await setDocument("users", res.user.uid, {
            email: u.email,
            firstName: u.firstName,
            lastName: u.lastName,
            userType: u.userType,
            isActive: true,
            permissions: perms,
          });

          newResults[u.email] = {
            success: true,
            message: "Created user",
            permissions: perms,
            uid: res.user.uid,
          };
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        newResults[u.email] = { success: false, message: msg };
      }
    }

    setResults(newResults);
    setRunning(false);
    toast.success("Debug user creation complete");
  };

  return (
    <Layout>
      <Head>
        <title>Debug - Create Test Users</title>
      </Head>

      <div className="max-w-3xl mx-auto py-12 px-4">
        <h1 className="text-2xl font-bold mb-4">Debug: Create Test Users</h1>
        {process.env.NODE_ENV === "production" ? (
          <div className="text-red-600">
            This page is disabled in production.
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600">
              This tool will create a small set of test users and profiles in
              Firestore. Use only in development.
            </p>

            <div className="flex gap-2">
              <Button
                onClick={handleCreateAll}
                disabled={running}
                loading={running}
              >
                {running ? "Creating..." : "Create Test Users"}
              </Button>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Results</h3>
              <div className="bg-white rounded-lg shadow p-4">
                {Object.keys(results).length === 0 ? (
                  <div className="text-sm text-gray-500">No results yet.</div>
                ) : (
                  <ul className="space-y-2">
                    {Object.entries(results).map(([email, r]) => (
                      <li
                        key={email}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <div className="font-medium">{email}</div>
                          <div className="text-sm text-gray-500">
                            {r.message}
                          </div>
                          {r.permissions && (
                            <div className="text-xs text-gray-600 mt-1">
                              Permissions: {r.permissions.join(", ")}
                            </div>
                          )}

                          {r.uid && (
                            <div className="text-xs text-gray-700 mt-2 flex items-center gap-2">
                              <div>
                                UID:{" "}
                                <span className="font-mono text-xs">
                                  {r.uid}
                                </span>
                              </div>
                              <Button
                                size="sm"
                                onClick={async () => {
                                  try {
                                    await navigator.clipboard.writeText(
                                      r.uid as string
                                    );
                                    toast.success("Copied UID to clipboard");
                                  } catch {
                                    toast.error("Failed to copy UID");
                                  }
                                }}
                              >
                                Copy UID
                              </Button>
                            </div>
                          )}
                        </div>
                        <div>
                          {r.success ? (
                            <span className="text-sm text-green-600">
                              Success
                            </span>
                          ) : (
                            <span className="text-sm text-red-600">Failed</span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="mt-6 text-xs text-gray-500">
              Note: Passwords are simple and for local testing only.
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DebugCreateUsersPage;
