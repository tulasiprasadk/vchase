import React, { useState } from "react";
import { useRouter } from "next/router";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { createDocument } from "@/lib/firebase/firestore";
import toast from "react-hot-toast";

const ServiceRequestForm: React.FC<{ defaultType?: string }> = ({
  defaultType,
}) => {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [details, setDetails] = useState("");
  const [serviceType] = useState(defaultType || "");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!firstName || !lastName) return "Please provide your full name";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return "Please provide a valid email";
    if (!serviceType) return "Please select a service type";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) return toast.error(err);

    setLoading(true);
    const payload = {
      firstName,
      lastName,
      email,
      companyName,
      contactNumber,
      details,
      serviceType,
      createdAt: new Date().toISOString(),
    };

    const { error } = await createDocument("service_requests", payload);
    setLoading(false);

    if (error) {
      toast.error("Failed to submit request: " + error);
    } else {
      toast.success("Request submitted. Our team will contact you shortly.");
      router.push("/");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <Input
          label="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>

      <Input
        type="email"
        label="Business email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        label="Company name"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
      />
      <Input
        label="Phone number"
        value={contactNumber}
        onChange={(e) => setContactNumber(e.target.value)}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Service type
        </label>
        {/* Hidden input so the value is submitted, but visually show as read-only */}
        <input type="hidden" name="serviceType" value={serviceType} />
        <div className="mt-1 p-3 bg-gray-100 border border-gray-200 rounded-md">
          <span className="text-sm text-gray-700">
            {serviceType ||
              "Not specified. Please choose a service from the service page."}
          </span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Details
        </label>
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          rows={5}
          className="w-full px-3 py-2 border rounded-md text-gray-700"
        />
      </div>

      <div className="text-center">
        <Button type="submit" loading={loading} className="w-full">
          {loading ? "Submitting..." : "Submit Request"}
        </Button>
      </div>
    </form>
  );
};

export default ServiceRequestForm;
