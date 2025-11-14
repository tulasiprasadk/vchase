import React, { useState, useEffect } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { createDocument } from "@/lib/firebase/firestore";
import toast from "react-hot-toast";
import { updateDocument } from "@/lib/firebase/firestore";

type JobPayload = {
  title: string;
  department: string;
  location: string;
  type: "full-time" | "part-time" | "contract" | "remote";
  description: string;
  requirements: string[];
  benefits: string[];
  salary?: string;
  postedAt: string;
  isRemote?: boolean;
};

type InitialJob = Partial<{
  id: string;
  title: string;
  department: string;
  location: string;
  type: "full-time" | "part-time" | "contract" | "remote";
  description: string;
  requirements: string[];
  benefits: string[];
  salary?: string;
  postedAt: string;
  isRemote?: boolean;
}>;

const CareerForm: React.FC<{
  onCreated?: () => void;
  onUpdated?: () => void;
  initialData?: InitialJob | null;
}> = ({ onCreated, onUpdated, initialData = null }) => {
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("General");
  const [location, setLocation] = useState("Remote");
  const [type, setType] = useState<
    "full-time" | "part-time" | "contract" | "remote"
  >("full-time");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [benefits, setBenefits] = useState("");
  const [salary, setSalary] = useState("");
  const [isRemote, setIsRemote] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDepartment(initialData.department || "General");
      setLocation(initialData.location || "Remote");
      setType(
        (initialData.type as
          | "full-time"
          | "part-time"
          | "contract"
          | "remote") || "full-time"
      );
      setDescription(initialData.description || "");
      setRequirements(
        initialData.requirements ? initialData.requirements.join("\n") : ""
      );
      setBenefits(initialData.benefits ? initialData.benefits.join("\n") : "");
      setSalary(initialData.salary || "");
      setIsRemote(Boolean(initialData.isRemote));
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description)
      return toast.error("Please provide title and description");
    setLoading(true);
    const payload: JobPayload = {
      title,
      department,
      location,
      type,
      description,
      requirements: requirements
        ? requirements
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      benefits: benefits
        ? benefits
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      salary,
      postedAt: new Date().toISOString(),
      isRemote,
    };
    if (initialData && initialData.id) {
      const { error } = await updateDocument(
        "careers",
        initialData.id,
        payload
      );
      setLoading(false);
      if (error) return toast.error("Failed to update job: " + error);
      toast.success("Job updated");
      if (onUpdated) onUpdated();
      return;
    }

    const { error } = await createDocument("careers", payload);
    setLoading(false);
    if (error) return toast.error("Failed to create job: " + error);
    toast.success("Job created");
    setTitle("");
    setDepartment("General");
    setLocation("Remote");
    setType("full-time");
    setDescription("");
    setRequirements("");
    setBenefits("");
    setSalary("");
    setIsRemote(false);
    if (onCreated) onCreated();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-4 rounded-lg shadow"
    >
      <Input
        label="Job Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Input
        label="Department"
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
      />
      <Input
        label="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="block">
          <div className="text-sm text-gray-700 mb-1">Type</div>
          <select
            value={type}
            onChange={(e) =>
              setType(
                e.target.value as
                  | "full-time"
                  | "part-time"
                  | "contract"
                  | "remote"
              )
            }
            className="w-full px-3 py-2 border rounded-md text-gray-800 border-gray-300"
          >
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="contract">Contract</option>
            <option value="remote">Remote</option>
          </select>
        </label>
        <label className="block">
          <div className="text-sm text-gray-700 mb-1">Remote</div>
          <select
            value={isRemote ? "yes" : "no"}
            onChange={(e) => setIsRemote(e.target.value === "yes")}
            className="w-full px-3 py-2 border rounded-md text-gray-700 border-gray-300"
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </label>
      </div>

      <label className="block">
        <div className="text-sm text-gray-700 mb-1">Description</div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
          className="w-full px-3 py-2 border rounded-md text-gray-700"
        />
      </label>

      <label className="block">
        <div className="text-sm text-gray-700 mb-1">
          Requirements (one per line)
        </div>
        <textarea
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border rounded-md text-gray-700"
        />
      </label>

      <label className="block">
        <div className="text-sm text-gray-700 mb-1">
          Benefits (one per line)
        </div>
        <textarea
          value={benefits}
          onChange={(e) => setBenefits(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border rounded-md text-gray-700"
        />
      </label>

      <Input
        label="Salary"
        value={salary}
        onChange={(e) => setSalary(e.target.value)}
      />

      <div className="flex justify-end">
        <Button type="submit" loading={loading}>
          {loading ? "Creating..." : "Create Job"}
        </Button>
      </div>
    </form>
  );
};

export default CareerForm;
