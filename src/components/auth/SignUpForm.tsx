import React, { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import Link from "next/link";
import toast from "react-hot-toast";

// Define account types - easily extensible for future additions
const ACCOUNT_TYPES = [
  { value: "sponsor", label: "Brand Sponsor", category: "event-services" },
  { value: "organizer", label: "Event Organizer", category: "event-services" },
  {
    value: "sales-marketing",
    label: "Sales & Marketing Consultant",
    category: "consulting",
  },
  {
    value: "personal-coaching",
    label: "Personal Coaching",
    category: "consulting",
  },
  {
    value: "digital-marketing",
    label: "Digital Marketing",
    category: "consulting",
  },
  {
    value: "turnkey-projects",
    label: "Turnkey Projects",
    category: "consulting",
  },
  {
    value: "business-consultancy",
    label: "Business Consultancy",
    category: "consulting",
  },
  {
    value: "marketing-sales",
    label: "Marketing & Sales",
    category: "consulting",
  },
];

// Personal email domains to reject
const PERSONAL_EMAIL_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "aol.com",
  "icloud.com",
  "live.com",
  "msn.com",
  "protonmail.com",
  "mail.com",
  "yandex.com",
  "zoho.com",
  "gmx.com",
  "tutanota.com",
];

const SignUpForm: React.FC<{ selectedRole?: string }> = ({ selectedRole }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [userType, setUserType] = useState<string>(selectedRole || "");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { signUp } = useAuth();
  const router = useRouter();

  const validateBusinessEmail = (email: string) => {
    if (!email) return "Email is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }

    const domain = email.split("@")[1]?.toLowerCase();
    if (!domain) return "Invalid email format";

    // Reject personal email domains
    if (PERSONAL_EMAIL_DOMAINS.includes(domain)) {
      return "Please use your company/business email address. Personal email domains (gmail.com, yahoo.com, etc.) are not accepted.";
    }

    // Basic business email validation - should have a proper domain
    if (domain.length < 4 || !domain.includes(".")) {
      return "Please enter a valid business email address";
    }

    return null;
  };

  const validatePhoneNumber = (phone: string) => {
    if (!phone) return "Phone number is required";

    // Remove all non-numeric characters for validation
    const cleanPhone = phone.replace(/[\s\-\(\)\+\.]/g, "");

    // Check if it's all numbers
    if (!/^\d+$/.test(cleanPhone)) {
      return "Phone number should contain only numbers";
    }

    // Check length (allow 7-15 digits for international numbers)
    if (cleanPhone.length < 7 || cleanPhone.length > 15) {
      return "Phone number should be between 7-15 digits";
    }

    // Reject obvious dummy numbers
    const dummyPatterns = [
      /^0{7,}$/, // All zeros
      /^1{7,}$/, // All ones
      /^2{7,}$/, // All twos
      /^1234567890/, // Sequential numbers
      /^9876543210/, // Reverse sequential
    ];

    if (dummyPatterns.some((pattern) => pattern.test(cleanPhone))) {
      return "Please enter a valid phone number";
    }

    return null;
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Email validation with business email check
    const emailError = validateBusinessEmail(email);
    if (emailError) newErrors.email = emailError;

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }

    // Phone validation
    const phoneError = validatePhoneNumber(contactNumber);
    if (phoneError) newErrors.contactNumber = phoneError;

    if (!userType) {
      newErrors.userType = "Please select an account type";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      await signUp(email, password, {
        firstName,
        lastName,
        companyName,
        contactNumber,
        userType: userType as
          | "organizer"
          | "sponsor"
          | "admin"
          | "sales-marketing"
          | "personal-coaching"
          | "digital-marketing"
          | "turnkey-projects"
          | "business-consultancy"
          | "marketing-sales",
      });

      toast.success("Account created successfully!");

      // Show a welcome message with loading state
      toast.loading("Setting up your account...", { duration: 2000 });

      // Wait a bit before redirecting to ensure everything is set up
      setTimeout(() => {
        // Redirect based on user type
        let redirectPath = "/dashboard";

        if (userType === "sponsor") {
          redirectPath = "/dashboard/sponsorships";
        } else if (userType === "organizer") {
          redirectPath = "/dashboard/events";
        } else {
          // For service providers, redirect to a general dashboard
          redirectPath = "/dashboard";
        }

        router.push(redirectPath);
      }, 2500); // 2.5 second delay
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
      setLoading(false);
    }
  };

  const selectedAccountType = ACCOUNT_TYPES.find(
    (type) => type.value === userType
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
            <p className="text-gray-600">Join our professional network</p>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  error={errors.firstName}
                  placeholder="Enter your first name"
                  disabled={loading}
                />

                <Input
                  label="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  error={errors.lastName}
                  placeholder="Enter your last name"
                  disabled={loading}
                />
              </div>

              <Input
                label="Company Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                error={errors.companyName}
                placeholder="Enter your company name"
                disabled={loading}
              />

              <Input
                type="email"
                label="Business Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                placeholder="your.name@company.com"
                disabled={loading}
              />

              <Input
                label="Phone Number"
                type="tel"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                error={errors.contactNumber}
                placeholder="+1 (555) 123-4567"
                disabled={loading}
              />

              <Input
                type="password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                placeholder="Create a strong password"
                disabled={loading}
              />

              <div className="space-y-2">
                <label className="block text-sm text-gray-800 font-semibold">
                  Account Type *
                </label>

                {/* If a role was selected on the role-selection page, show a read-only badge
                    and keep the value in state. Otherwise render the searchable select. */}
                {selectedRole ? (
                  <div>
                    <input type="hidden" name="userType" value={userType} />
                    <div className="mt-1 p-3 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-gray-900">
                          {selectedAccountType
                            ? selectedAccountType.label
                            : userType}
                        </span>
                        <p className="text-xs text-gray-500">
                          Pre-selected from role choice
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <SearchableSelect
                      options={ACCOUNT_TYPES}
                      value={userType}
                      onSelect={setUserType}
                      placeholder="Select your account type..."
                      searchPlaceholder="Search account types..."
                      className={errors.userType ? "border-red-300" : ""}
                    />
                    {errors.userType && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.userType}
                      </p>
                    )}
                  </>
                )}

                {selectedAccountType && (
                  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium text-blue-700">
                        {selectedAccountType.label}
                      </span>
                    </div>
                    <p className="text-xs text-blue-600 mt-1">
                      {selectedAccountType.category === "event-services"
                        ? "Connect with businesses in the events industry"
                        : "Provide professional consulting services"}
                    </p>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                loading={loading}
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/auth/signin"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUpForm;
