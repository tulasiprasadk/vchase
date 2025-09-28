import React, { useState } from "react";
import Image from "next/image";
import { Event, SponsorshipPackage } from "@/types";
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";
import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import { SearchableMultiSelect } from "@/components/ui/SearchableMultiSelect";
import { SponsorshipPackageManager } from "@/components/SponsorshipPackageManager";
import {
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Tag,
  Upload,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

// Predefined categories and tags
const PREDEFINED_CATEGORIES = [
  { value: "conference", label: "Conference" },
  { value: "workshop", label: "Workshop" },
  { value: "seminar", label: "Seminar" },
  { value: "meetup", label: "Meetup" },
  { value: "concert", label: "Concert" },
  { value: "festival", label: "Festival" },
  { value: "exhibition", label: "Exhibition" },
  { value: "trade-show", label: "Trade Show" },
  { value: "networking", label: "Networking Event" },
  { value: "charity", label: "Charity Event" },
  { value: "sports", label: "Sports Event" },
  { value: "entertainment", label: "Entertainment" },
  { value: "education", label: "Educational" },
  { value: "business", label: "Business Event" },
  { value: "other", label: "Other" },
];

const PREDEFINED_TAGS = [
  { value: "technology", label: "Technology" },
  { value: "business", label: "Business" },
  { value: "marketing", label: "Marketing" },
  { value: "design", label: "Design" },
  { value: "development", label: "Development" },
  { value: "startup", label: "Startup" },
  { value: "innovation", label: "Innovation" },
  { value: "networking", label: "Networking" },
  { value: "leadership", label: "Leadership" },
  { value: "finance", label: "Finance" },
  { value: "healthcare", label: "Healthcare" },
  { value: "education", label: "Education" },
  { value: "entertainment", label: "Entertainment" },
  { value: "music", label: "Music" },
  { value: "art", label: "Art" },
  { value: "food", label: "Food & Beverage" },
  { value: "sports", label: "Sports" },
  { value: "fitness", label: "Fitness" },
  { value: "wellness", label: "Wellness" },
  { value: "community", label: "Community" },
];

interface EventFormProps {
  event?: Event;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const EventForm: React.FC<EventFormProps> = ({
  event,
  onSubmit,
  onCancel,
  isSubmitting,
}) => {
  const { uploadImage, uploading } = useCloudinaryUpload();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    event?.imageUrl || ""
  );

  const [formData, setFormData] = useState({
    title: event?.title || "",
    description: event?.description || "",
    date: event?.startDate
      ? new Date(event.startDate.toDate()).toISOString().slice(0, 16)
      : "",
    location:
      typeof event?.location === "string"
        ? event.location
        : event?.location?.venue || "",
    ticketPrice: event?.maxAttendees?.toString() || "", // Using maxAttendees as placeholder for price
    maxAttendees: event?.maxAttendees?.toString() || "",
    category: event?.category || "",
    tags: event?.tags || [],
    imageUrl: event?.imageUrl || "",
    sponsorshipPackages: event?.sponsorshipPackages || [],
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    setFormData((prev) => ({ ...prev, imageUrl: "" }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return false;
    }
    if (!formData.description.trim()) {
      toast.error("Description is required");
      return false;
    }
    if (!formData.date) {
      toast.error("Date is required");
      return false;
    }
    if (!formData.location.trim()) {
      toast.error("Location is required");
      return false;
    }
    if (!formData.category.trim()) {
      toast.error("Category is required");
      return false;
    }

    // Validate date is in the future
    const eventDate = new Date(formData.date);
    if (eventDate <= new Date()) {
      toast.error("Event date must be in the future");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      let imageUrl = formData.imageUrl;

      // Upload new image if one was selected
      if (imageFile) {
        const uploadResult = await uploadImage(imageFile);
        if (uploadResult) {
          imageUrl = uploadResult.url;
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const eventData: any = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        startDate: new Date(formData.date),
        endDate: new Date(formData.date), // For now, same as start date
        location: {
          venue: formData.location.trim(),
          address: formData.location.trim(),
          city: "Unknown", // TODO: Make these separate fields
          country: "Unknown",
        },
        category: formData.category.trim(),
        tags: formData.tags,
        status: "draft" as const,
        sponsorshipPackages: formData.sponsorshipPackages,
        requirements: {
          minBudget:
            formData.sponsorshipPackages.length > 0
              ? Math.min(
                  ...formData.sponsorshipPackages.map((pkg) => pkg.price)
                )
              : undefined,
          industries: [],
          sponsorshipTypes: formData.sponsorshipPackages.map((pkg) => pkg.name),
        },
      };

      // Only add imageUrl if it exists
      if (imageUrl && imageUrl.trim()) {
        eventData.imageUrl = imageUrl;
      }

      // Only add maxAttendees if it has a value
      if (formData.maxAttendees && parseInt(formData.maxAttendees) > 0) {
        eventData.maxAttendees = parseInt(formData.maxAttendees);
      }

      // Only add website if it exists (for future use)
      // if (website && website.trim()) {
      //   eventData.website = website;
      // }

      await onSubmit(eventData);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to save event");
    }
  };

  const isLoading = isSubmitting || uploading;

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-600">
          <Calendar className="h-5 w-5 " />
          {event ? "Edit Event" : "Create New Event"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter event title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <SearchableSelect
                options={PREDEFINED_CATEGORIES}
                value={formData.category}
                onSelect={(value) =>
                  setFormData((prev) => ({ ...prev, category: value }))
                }
                placeholder="Select or type a category..."
                allowCustom={true}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your event in detail..."
              rows={6}
              required
              className="resize-none"
            />
            <p className="text-sm text-gray-600">
              Provide a detailed description of your event, including what
              attendees can expect.
            </p>
          </div>

          {/* Date and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Event Date & Time *
              </Label>
              <Input
                id="date"
                name="date"
                type="datetime-local"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location *
              </Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Event venue or address"
                required
              />
            </div>
          </div>

          {/* Pricing and Capacity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="ticketPrice" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Ticket Price
              </Label>
              <Input
                id="ticketPrice"
                name="ticketPrice"
                type="number"
                min="0"
                step="0.01"
                value={formData.ticketPrice}
                onChange={handleInputChange}
                placeholder="0.00"
              />
              <p className="text-sm text-gray-600">
                Leave empty for free events
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxAttendees" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Max Attendees
              </Label>
              <Input
                id="maxAttendees"
                name="maxAttendees"
                type="number"
                min="1"
                value={formData.maxAttendees}
                onChange={handleInputChange}
                placeholder="100"
              />
              <p className="text-sm text-gray-600">
                Leave empty for unlimited capacity
              </p>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Tags
            </Label>
            <SearchableMultiSelect
              options={PREDEFINED_TAGS}
              value={formData.tags}
              onChange={(tags) => setFormData((prev) => ({ ...prev, tags }))}
              placeholder="Select or add tags..."
              allowCustom={true}
              maxSelections={10}
            />
          </div>

          {/* Sponsorship Packages */}
          <SponsorshipPackageManager
            packages={formData.sponsorshipPackages}
            onChange={(packages) =>
              setFormData((prev) => ({
                ...prev,
                sponsorshipPackages: packages,
              }))
            }
          />

          {/* Image Upload */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Event Image
            </Label>
            <div className="">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="my-4 border-0 p-0 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {imagePreview && (
                <div className="relative inline-block ">
                  <Image
                    src={imagePreview}
                    alt="Event preview"
                    width={192}
                    height={128}
                    className="object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-red-500 text-white hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Saving..."
                : event
                ? "Update Event"
                : "Create Event"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
