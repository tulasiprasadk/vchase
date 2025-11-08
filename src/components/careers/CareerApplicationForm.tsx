import React, { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { createDocument } from "@/lib/firebase/firestore";
import toast from "react-hot-toast";

type CareerApplication = {
  jobId: string;
  jobTitle?: string | null;
  firstName: string;
  lastName?: string;
  email: string;
  company?: string;
  phone?: string;
  coverLetter: string;
  status: "Review" | "Interview" | "Reject" | "Hire";
  appliedAt: string;
};

const CareerApplicationForm: React.FC<{
  jobId: string;
  jobTitle?: string;
  onApplied?: () => void;
}> = ({ jobId, jobTitle, onApplied }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!firstName || !email || !coverLetter)
      return toast.error("Please fill required fields");
    setLoading(true);
    const payload: CareerApplication = {
      jobId,
      jobTitle: jobTitle || null,
      firstName,
      lastName,
      email,
      company,
      phone,
      coverLetter,
      status: "Review",
      appliedAt: new Date().toISOString(),
    };
    const { error } = await createDocument("career_applications", payload);
    setLoading(false);
    if (error) return toast.error("Failed to apply: " + error);
    toast.success("Application submitted");
    if (onApplied) onApplied();
    setFirstName("");
    setLastName("");
    setEmail("");
    setCompany("");
    setPhone("");
    setCoverLetter("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-4 rounded-lg shadow"
    >
      <div className="text-lg font-medium text-gray-700">
        Apply for: {jobTitle || "this role"}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <Input
          label="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>
      <Input
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
        <Input
          label="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <label className="block">
        <div className="text-sm text-gray-700 mb-1">Cover Letter</div>
        <Textarea
          value={coverLetter}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setCoverLetter(e.target.value)
          }
          rows={6}
        />
      </label>
      <div className="flex justify-end">
        <Button type="submit" loading={loading}>
          {loading ? "Applying..." : "Submit Application"}
        </Button>
      </div>
    </form>
  );
};

export default CareerApplicationForm;
