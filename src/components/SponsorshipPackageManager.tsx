import React, { useState } from "react";
import { SponsorshipPackage } from "@/types";
import Button from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import {
  DollarSign,
  Plus,
  Trash2,
  Star,
  Users,
  Gift,
  Edit3,
  Check,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

interface SponsorshipPackageManagerProps {
  packages: SponsorshipPackage[];
  onChange: (packages: SponsorshipPackage[]) => void;
  className?: string;
}

interface PackageFormData {
  name: string;
  description: string;
  price: string;
  benefits: string[];
  maxSponsors: string;
  isAvailable: boolean;
}

const PACKAGE_TIERS = [
  { name: "Bronze", color: "bg-amber-600", icon: "🥉" },
  { name: "Silver", color: "bg-gray-400", icon: "🥈" },
  { name: "Gold", color: "bg-yellow-500", icon: "🥇" },
  { name: "Platinum", color: "bg-purple-600", icon: "💎" },
  { name: "Diamond", color: "bg-blue-600", icon: "💠" },
  {
    name: "Title Sponsor",
    color: "bg-gradient-to-r from-purple-600 to-pink-600",
    icon: "👑",
  },
];

export const SponsorshipPackageManager: React.FC<
  SponsorshipPackageManagerProps
> = ({ packages, onChange, className = "" }) => {
  const [isAddingPackage, setIsAddingPackage] = useState(false);
  const [editingPackageId, setEditingPackageId] = useState<string | null>(null);
  const [newBenefit, setNewBenefit] = useState("");
  const [formData, setFormData] = useState<PackageFormData>({
    name: "",
    description: "",
    price: "",
    benefits: [],
    maxSponsors: "",
    isAvailable: true,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      benefits: [],
      maxSponsors: "",
      isAvailable: true,
    });
    setNewBenefit("");
    setIsAddingPackage(false);
    setEditingPackageId(null);
  };

  const handleInputChange = (
    field: keyof PackageFormData,
    value: string | boolean | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addBenefit = () => {
    if (newBenefit.trim()) {
      handleInputChange("benefits", [...formData.benefits, newBenefit.trim()]);
      setNewBenefit("");
    }
  };

  const removeBenefit = (index: number) => {
    const updatedBenefits = formData.benefits.filter((_, i) => i !== index);
    handleInputChange("benefits", updatedBenefits);
  };

  const validatePackage = (): boolean => {
    if (!formData.name.trim()) {
      toast.error("Package name is required");
      return false;
    }
    if (!formData.description.trim()) {
      toast.error("Package description is required");
      return false;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error("Valid price is required");
      return false;
    }
    if (formData.benefits.length === 0) {
      toast.error("At least one benefit is required");
      return false;
    }
    return true;
  };

  const savePackage = () => {
    if (!validatePackage()) return;

    const packageData: SponsorshipPackage = {
      id: editingPackageId || `pkg-${Date.now()}`,
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: parseFloat(formData.price),
      benefits: formData.benefits,
      maxSponsors: formData.maxSponsors
        ? parseInt(formData.maxSponsors)
        : undefined,
      currentSponsors: 0,
      isAvailable: formData.isAvailable,
    };

    let updatedPackages;
    if (editingPackageId) {
      // Update existing package
      updatedPackages = packages.map((pkg) =>
        pkg.id === editingPackageId ? packageData : pkg
      );
      toast.success("Package updated successfully");
    } else {
      // Add new package
      updatedPackages = [...packages, packageData];
      toast.success("Package added successfully");
    }

    onChange(updatedPackages);
    resetForm();
  };

  const deletePackage = (packageId: string) => {
    const updatedPackages = packages.filter((pkg) => pkg.id !== packageId);
    onChange(updatedPackages);
    toast.success("Package deleted");
  };

  const startEdit = (pkg: SponsorshipPackage) => {
    setFormData({
      name: pkg.name,
      description: pkg.description,
      price: pkg.price.toString(),
      benefits: [...pkg.benefits],
      maxSponsors: pkg.maxSponsors?.toString() || "",
      isAvailable: pkg.isAvailable,
    });
    setEditingPackageId(pkg.id);
    setIsAddingPackage(true);
  };

  const getTierInfo = (packageName: string) => {
    return (
      PACKAGE_TIERS.find((tier) =>
        packageName.toLowerCase().includes(tier.name.toLowerCase())
      ) || { name: "Custom", color: "bg-gray-500", icon: "📦" }
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <Label className="text-lg font-semibold flex items-center gap-2">
          <Gift className="h-5 w-5" />
          Sponsorship Packages
        </Label>
        <Button
          type="button"
          onClick={() => setIsAddingPackage(true)}
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Package
        </Button>
      </div>

      {/* Existing Packages */}
      <div className="grid gap-4">
        {packages.map((pkg) => {
          const tierInfo = getTierInfo(pkg.name);
          return (
            <Card key={pkg.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl">{tierInfo.icon}</span>
                    <h3 className="font-semibold text-lg">{pkg.name}</h3>
                    <span className="text-2xl font-bold text-green-600">
                      {formatPrice(pkg.price)}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{pkg.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {pkg.maxSponsors && (
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          Max: {pkg.maxSponsors}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4" />
                        {pkg.isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm font-medium">Benefits:</Label>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {pkg.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => startEdit(pkg)}
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => deletePackage(pkg.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Add/Edit Package Form */}
      {isAddingPackage && (
        <Card className="p-4 border-2 border-blue-200 bg-blue-50">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">
                {editingPackageId ? "Edit Package" : "Add New Package"}
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={resetForm}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="package-name">Package Name *</Label>
                <Input
                  id="package-name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="e.g., Gold Package"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="package-price">Price (USD) *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="package-price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="0.00"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="package-description">Description *</Label>
              <Textarea
                id="package-description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Describe what this package offers..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Benefits *</Label>
              <div className="flex gap-2">
                <Input
                  value={newBenefit}
                  onChange={(e) => setNewBenefit(e.target.value)}
                  placeholder="Add a benefit..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addBenefit();
                    }
                  }}
                />
                <Button type="button" onClick={addBenefit} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.benefits.length > 0 && (
                <div className="space-y-2 mt-2">
                  {formData.benefits.map((benefit, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-white p-2 rounded border"
                    >
                      <span className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        {benefit}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeBenefit(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="max-sponsors">Max Sponsors (Optional)</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="max-sponsors"
                    type="number"
                    min="1"
                    value={formData.maxSponsors}
                    onChange={(e) =>
                      handleInputChange("maxSponsors", e.target.value)
                    }
                    placeholder="Unlimited"
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Availability</Label>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="package-available"
                    checked={formData.isAvailable}
                    onChange={(e) =>
                      handleInputChange("isAvailable", e.target.checked)
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="package-available" className="text-sm">
                    Package is available for sponsors
                  </Label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="button" onClick={savePackage}>
                {editingPackageId ? "Update Package" : "Add Package"}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {packages.length === 0 && !isAddingPackage && (
        <Card className="p-8 text-center text-gray-500">
          <Gift className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg mb-2">No sponsorship packages yet</p>
          <p className="text-sm mb-4">
            Create packages to offer different sponsorship opportunities for
            your event.
          </p>
          <Button
            type="button"
            onClick={() => setIsAddingPackage(true)}
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create First Package
          </Button>
        </Card>
      )}
    </div>
  );
};
