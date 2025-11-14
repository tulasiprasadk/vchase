import React, { useState } from "react";
import Head from "next/head";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import VerifiedBadge from "@/components/ui/VerifiedBadge";
import VerificationRequestForm from "@/components/verification/VerificationRequestForm";
import { useAuth } from "@/context/AuthContext";
import { useVerification } from "@/hooks/useVerification";
import { Award, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

const SettingsPage: React.FC = () => {
  const { userProfile } = useAuth();
  const {} = useVerification();
  const [loading, setLoading] = useState(false);
  const [showVerificationForm, setShowVerificationForm] = useState(false);

  // Form states
  const [profile, setProfile] = useState({
    firstName: userProfile?.firstName || "",
    lastName: userProfile?.lastName || "",
    email: userProfile?.email || "",
    profileImage: userProfile?.profileImage || "",
  });

  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    sponsorshipAlerts: true,
    eventReminders: true,
    marketingEmails: false,
  });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Implement profile update API call
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock delay
      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.new !== password.confirm) {
      toast.error("New passwords don't match");
      return;
    }

    if (password.new.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      // TODO: Implement password change API call
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock delay
      toast.success("Password changed successfully!");
      setPassword({ current: "", new: "", confirm: "" });
    } catch {
      toast.error("Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationUpdate = async () => {
    setLoading(true);

    try {
      // TODO: Implement notification preferences API call
      await new Promise((resolve) => setTimeout(resolve, 500)); // Mock delay
      toast.success("Notification preferences updated!");
    } catch {
      toast.error("Failed to update preferences");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute requireAuth={true}>
      <Head>
        <title>Settings - EventSponsor</title>
        <meta name="description" content="Manage your account settings" />
      </Head>
      <DashboardLayout title="Settings">
        <div className="max-w-4xl space-y-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">
                Profile Information
              </h3>
              <p className="text-sm text-gray-600">
                Update your personal information and profile picture
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    value={profile.firstName}
                    onChange={(e) =>
                      setProfile({ ...profile, firstName: e.target.value })
                    }
                    placeholder="Enter your first name"
                    disabled={loading}
                  />
                  <Input
                    label="Last Name"
                    value={profile.lastName}
                    onChange={(e) =>
                      setProfile({ ...profile, lastName: e.target.value })
                    }
                    placeholder="Enter your last name"
                    disabled={loading}
                  />
                </div>

                <Input
                  type="email"
                  label="Email Address"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                  placeholder="Enter your email"
                  disabled={loading}
                />

                <Input
                  label="Profile Image URL"
                  value={profile.profileImage}
                  onChange={(e) =>
                    setProfile({ ...profile, profileImage: e.target.value })
                  }
                  placeholder="Enter profile image URL"
                  disabled={loading}
                  helperText="Optional: Add a URL to your profile picture"
                />

                <div className="flex justify-end">
                  <Button type="submit" loading={loading} disabled={loading}>
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Verification Section */}
          {userProfile?.userType !== "admin" && (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Award className="mr-2" size={20} />
                  Account Verification
                </h3>
                <p className="text-sm text-gray-600">
                  Get verified to build trust with event organizers and sponsors
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">
                        Verification Status
                      </p>
                      <div className="mt-1">
                        <VerifiedBadge
                          verificationStatus={
                            userProfile?.verificationStatus || "not_requested"
                          }
                          size="md"
                        />
                      </div>
                    </div>

                    {(!userProfile?.verificationStatus ||
                      userProfile?.verificationStatus === "not_requested") && (
                      <Button
                        onClick={() => setShowVerificationForm(true)}
                        className="flex items-center"
                      >
                        <CheckCircle size={16} className="mr-2" />
                        Start Verification
                      </Button>
                    )}

                    {userProfile?.verificationStatus === "rejected" && (
                      <Button
                        onClick={() => setShowVerificationForm(true)}
                        variant="outline"
                        className="flex items-center"
                      >
                        <CheckCircle size={16} className="mr-2" />
                        Reapply
                      </Button>
                    )}
                  </div>

                  {userProfile?.verificationStatus === "pending" && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-yellow-800 text-sm">
                        Your verification request is under review. We&apos;ll
                        notify you once it&apos;s processed.
                      </p>
                    </div>
                  )}

                  {userProfile?.verificationStatus === "approved" && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-800 text-sm">
                        Congratulations! Your account is verified. This helps
                        build trust with other users.
                      </p>
                      {userProfile?.verifiedAt && (
                        <p className="text-green-700 text-xs mt-1">
                          Verified on{" "}
                          {userProfile.verifiedAt.toDate().toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )}

                  {userProfile?.verificationStatus === "rejected" && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-800 text-sm">
                        Your verification request was not approved. You can
                        submit a new request with updated information.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Password Settings */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">
                Change Password
              </h3>
              <p className="text-sm text-gray-600">
                Update your password to keep your account secure
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <Input
                  type="password"
                  label="Current Password"
                  value={password.current}
                  onChange={(e) =>
                    setPassword({ ...password, current: e.target.value })
                  }
                  placeholder="Enter your current password"
                  disabled={loading}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    type="password"
                    label="New Password"
                    value={password.new}
                    onChange={(e) =>
                      setPassword({ ...password, new: e.target.value })
                    }
                    placeholder="Enter new password"
                    disabled={loading}
                  />
                  <Input
                    type="password"
                    label="Confirm New Password"
                    value={password.confirm}
                    onChange={(e) =>
                      setPassword({ ...password, confirm: e.target.value })
                    }
                    placeholder="Confirm new password"
                    disabled={loading}
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" loading={loading} disabled={loading}>
                    Change Password
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">
                Notifications
              </h3>
              <p className="text-sm text-gray-600">
                Manage how you receive notifications
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Email Updates</h4>
                    <p className="text-sm text-gray-600">
                      Receive important account updates via email
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.emailUpdates}
                      onChange={(e) =>
                        setNotifications({
                          ...notifications,
                          emailUpdates: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {userProfile?.userType === "sponsor"
                        ? "Sponsorship Alerts"
                        : "Event Updates"}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {userProfile?.userType === "sponsor"
                        ? "Get notified about new sponsorship opportunities"
                        : "Receive updates about your events and sponsorship applications"}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.sponsorshipAlerts}
                      onChange={(e) =>
                        setNotifications({
                          ...notifications,
                          sponsorshipAlerts: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Event Reminders
                    </h4>
                    <p className="text-sm text-gray-600">
                      Get reminders about upcoming events
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.eventReminders}
                      onChange={(e) =>
                        setNotifications({
                          ...notifications,
                          eventReminders: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Marketing Emails
                    </h4>
                    <p className="text-sm text-gray-600">
                      Receive newsletters and promotional content
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.marketingEmails}
                      onChange={(e) =>
                        setNotifications({
                          ...notifications,
                          marketingEmails: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    onClick={handleNotificationUpdate}
                    loading={loading}
                    disabled={loading}
                  >
                    Save Preferences
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">
                Account Actions
              </h3>
              <p className="text-sm text-gray-600">
                Dangerous actions for your account
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                  <h4 className="font-medium text-red-800 mb-2">
                    Delete Account
                  </h4>
                  <p className="text-sm text-red-700 mb-4">
                    Once you delete your account, there is no going back. Please
                    be certain.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-300 text-red-700 hover:bg-red-100"
                  >
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Verification Form Modal */}
        {showVerificationForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <VerificationRequestForm
                onSuccess={() => {
                  setShowVerificationForm(false);
                  toast.success("Verification request submitted successfully!");
                }}
                onCancel={() => setShowVerificationForm(false)}
              />
            </div>
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default SettingsPage;
