import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useVerification } from "@/hooks/useVerification";
import { VerificationDocument } from "@/types";
import { Upload, FileText, Building, User, Award, X } from "lucide-react";
import { ImageUpload } from "@/components/ui/ImageUpload";
import Button from "@/components/ui/Button";
import { Timestamp } from "firebase/firestore";

interface VerificationRequestFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const VerificationRequestForm: React.FC<VerificationRequestFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const { user, userProfile } = useAuth();
  const { submitVerificationRequest, submitting } = useVerification();

  const [step, setStep] = useState(1);
  const [documents, setDocuments] = useState<VerificationDocument[]>([]);
  const [businessInfo, setBusinessInfo] = useState({
    businessName: userProfile?.company || "",
    businessType: "",
    businessAddress: "",
    businessPhone: "",
    businessWebsite: "",
    businessDescription: "",
  });

  const [organizerInfo, setOrganizerInfo] = useState({
    yearsOfExperience: 0,
    previousEvents: [""],
    organizationType: "company" as "individual" | "company" | "nonprofit",
    portfolio: "",
  });

  const [sponsorInfo, setSponsorInfo] = useState({
    sponsorshipBudget: "",
    industryFocus: [""],
    sponsorshipGoals: [""],
    companySize: "",
    website: "",
  });

  const handleDocumentUpload = (uploadResult: {
    url: string;
    original_filename?: string;
  }) => {
    const newDoc: VerificationDocument = {
      id: Date.now().toString(),
      type: "business_license",
      filename: uploadResult.original_filename || "document",
      url: uploadResult.url,
      uploadedAt: Timestamp.fromDate(new Date()),
      description: "",
    };

    setDocuments((prev) => [...prev, newDoc]);
  };

  const removeDocument = (docId: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== docId));
  };

  const handleSubmit = async () => {
    if (!user || !userProfile) return;

    try {
      await submitVerificationRequest(user.uid, {
        userId: user.uid,
        userType: userProfile.userType as "organizer" | "sponsor",
        userInfo: {
          firstName: userProfile.firstName,
          lastName: userProfile.lastName,
          email: userProfile.email,
          company: userProfile.company,
          userType: userProfile.userType as "organizer" | "sponsor",
        },
        documents,
        businessInfo: businessInfo.businessName ? businessInfo : undefined,
        organizerInfo:
          userProfile.userType === "organizer" ? organizerInfo : undefined,
        sponsorInfo:
          userProfile.userType === "sponsor" ? sponsorInfo : undefined,
      });

      onSuccess?.();
    } catch (error) {
      console.error("Error submitting verification request:", error);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Building className="mr-2" size={20} />
              Business Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name *
                </label>
                <input
                  type="text"
                  value={businessInfo.businessName}
                  onChange={(e) =>
                    setBusinessInfo((prev) => ({
                      ...prev,
                      businessName: e.target.value,
                    }))
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Type *
                </label>
                <select
                  value={businessInfo.businessType}
                  onChange={(e) =>
                    setBusinessInfo((prev) => ({
                      ...prev,
                      businessType: e.target.value,
                    }))
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="corporation">Corporation</option>
                  <option value="llc">LLC</option>
                  <option value="partnership">Partnership</option>
                  <option value="sole_proprietorship">
                    Sole Proprietorship
                  </option>
                  <option value="nonprofit">Non-profit</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Address *
                </label>
                <textarea
                  value={businessInfo.businessAddress}
                  onChange={(e) =>
                    setBusinessInfo((prev) => ({
                      ...prev,
                      businessAddress: e.target.value,
                    }))
                  }
                  className="w-full p-2 border border-slate-300 rounded-md bg-white text-slate-900 placeholder:text-slate-400 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={businessInfo.businessPhone}
                  onChange={(e) =>
                    setBusinessInfo((prev) => ({
                      ...prev,
                      businessPhone: e.target.value,
                    }))
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  value={businessInfo.businessWebsite}
                  onChange={(e) =>
                    setBusinessInfo((prev) => ({
                      ...prev,
                      businessWebsite: e.target.value,
                    }))
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Description *
                </label>
                <textarea
                  value={businessInfo.businessDescription}
                  onChange={(e) =>
                    setBusinessInfo((prev) => ({
                      ...prev,
                      businessDescription: e.target.value,
                    }))
                  }
                  className="w-full p-2 border border-slate-300 rounded-md bg-white text-slate-900 placeholder:text-slate-400 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  placeholder="Describe your business and what you do..."
                  required
                />
              </div>
            </div>
          </div>
        );

      case 2:
        if (userProfile?.userType === "organizer") {
          return (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <User className="mr-2" size={20} />
                Organizer Experience
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Years of Experience *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={organizerInfo.yearsOfExperience}
                    onChange={(e) =>
                      setOrganizerInfo((prev) => ({
                        ...prev,
                        yearsOfExperience: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Organization Type *
                  </label>
                  <select
                    value={organizerInfo.organizationType}
                    onChange={(e) =>
                      setOrganizerInfo((prev) => ({
                        ...prev,
                        organizationType: e.target.value as
                          | "individual"
                          | "company"
                          | "nonprofit",
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="individual">Individual</option>
                    <option value="company">Company</option>
                    <option value="nonprofit">Non-profit</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Previous Events (one per line)
                  </label>
                  <textarea
                    value={organizerInfo.previousEvents.join("\n")}
                    onChange={(e) =>
                      setOrganizerInfo((prev) => ({
                        ...prev,
                        previousEvents: e.target.value
                          .split("\n")
                          .filter((event) => event.trim()),
                      }))
                    }
                    className="w-full p-2 border border-slate-300 rounded-md bg-white text-slate-900 placeholder:text-slate-400 focus:ring-blue-500 focus:border-blue-500"
                    rows={4}
                    placeholder="List your previous events..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Portfolio/Website
                  </label>
                  <input
                    type="url"
                    value={organizerInfo.portfolio}
                    onChange={(e) =>
                      setOrganizerInfo((prev) => ({
                        ...prev,
                        portfolio: e.target.value,
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://your-portfolio.com"
                  />
                </div>
              </div>
            </div>
          );
        } else if (userProfile?.userType === "sponsor") {
          return (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Award className="mr-2" size={20} />
                Sponsorship Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Annual Sponsorship Budget *
                  </label>
                  <select
                    value={sponsorInfo.sponsorshipBudget}
                    onChange={(e) =>
                      setSponsorInfo((prev) => ({
                        ...prev,
                        sponsorshipBudget: e.target.value,
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Budget Range</option>
                    <option value="under_10k">Under $10,000</option>
                    <option value="10k_50k">$10,000 - $50,000</option>
                    <option value="50k_100k">$50,000 - $100,000</option>
                    <option value="100k_500k">$100,000 - $500,000</option>
                    <option value="over_500k">Over $500,000</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Size *
                  </label>
                  <select
                    value={sponsorInfo.companySize}
                    onChange={(e) =>
                      setSponsorInfo((prev) => ({
                        ...prev,
                        companySize: e.target.value,
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Size</option>
                    <option value="startup">Startup (1-10 employees)</option>
                    <option value="small">Small (11-50 employees)</option>
                    <option value="medium">Medium (51-200 employees)</option>
                    <option value="large">Large (201-1000 employees)</option>
                    <option value="enterprise">
                      Enterprise (1000+ employees)
                    </option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Industry Focus (one per line) *
                  </label>
                  <textarea
                    value={sponsorInfo.industryFocus.join("\n")}
                    onChange={(e) =>
                      setSponsorInfo((prev) => ({
                        ...prev,
                        industryFocus: e.target.value
                          .split("\n")
                          .filter((industry) => industry.trim()),
                      }))
                    }
                    className="w-full p-2 border border-slate-300 rounded-md bg-white text-slate-900 placeholder:text-slate-400 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Technology&#10;Healthcare&#10;Finance..."
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sponsorship Goals (one per line) *
                  </label>
                  <textarea
                    value={sponsorInfo.sponsorshipGoals.join("\n")}
                    onChange={(e) =>
                      setSponsorInfo((prev) => ({
                        ...prev,
                        sponsorshipGoals: e.target.value
                          .split("\n")
                          .filter((goal) => goal.trim()),
                      }))
                    }
                    className="w-full p-2 border border-slate-300 rounded-md bg-white text-slate-900 placeholder:text-slate-400 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Brand awareness&#10;Lead generation&#10;Customer acquisition..."
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Website
                  </label>
                  <input
                    type="url"
                    value={sponsorInfo.website}
                    onChange={(e) =>
                      setSponsorInfo((prev) => ({
                        ...prev,
                        website: e.target.value,
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://your-company.com"
                  />
                </div>
              </div>
            </div>
          );
        }
        return null;

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <FileText className="mr-2" size={20} />
              Upload Documents
            </h3>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    Upload required documents for verification
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Business license, tax certificates, identity documents, etc.
                  </p>
                </div>
                <div className="mt-4">
                  <ImageUpload
                    onUpload={handleDocumentUpload}
                    placeholder="Upload verification documents"
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {documents.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Uploaded Documents:</h4>
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                  >
                    <div className="flex items-center">
                      <FileText size={16} className="mr-2" />
                      <span className="text-sm">{doc.filename}</span>
                    </div>
                    <button
                      onClick={() => removeDocument(doc.id)}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return (
          businessInfo.businessName &&
          businessInfo.businessType &&
          businessInfo.businessAddress &&
          businessInfo.businessPhone &&
          businessInfo.businessDescription
        );
      case 2:
        if (userProfile?.userType === "organizer") {
          return organizerInfo.yearsOfExperience >= 0;
        } else if (userProfile?.userType === "sponsor") {
          return (
            sponsorInfo.sponsorshipBudget &&
            sponsorInfo.companySize &&
            sponsorInfo.industryFocus.length > 0 &&
            sponsorInfo.sponsorshipGoals.length > 0
          );
        }
        return true;
      case 3:
        return documents.length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Account Verification</h2>
        <p className="text-gray-600">
          Complete your account verification to get verified status
        </p>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center mb-8">
        {[1, 2, 3].map((stepNumber) => (
          <div key={stepNumber} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= stepNumber
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {stepNumber}
            </div>
            {stepNumber < 3 && (
              <div
                className={`w-16 h-1 mx-2 ${
                  step > stepNumber ? "bg-blue-600" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {renderStepContent()}

      <div className="flex justify-between mt-8">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setStep((prev) => Math.max(1, prev - 1))}
            disabled={step === 1}
          >
            Previous
          </Button>

          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>

        {step < 3 ? (
          <Button
            onClick={() => setStep((prev) => prev + 1)}
            disabled={!isStepValid()}
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={submitting || !isStepValid()}
          >
            {submitting ? "Submitting..." : "Submit Request"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default VerificationRequestForm;
