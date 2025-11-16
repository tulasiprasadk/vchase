import React, { useState, useMemo } from "react";
import Head from "next/head";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useSponsorEvents, EventFilters } from "@/hooks/useSponsorEvents";
import { useSponsorshipEnquiries } from "@/hooks/useSponsorshipEnquiries";
import { Event, SponsorshipPackage } from "@/types";
import { toast } from "react-hot-toast";

const BrowseEventsPage: React.FC = () => {
  const [filters, setFilters] = useState<EventFilters>({});

  const { events, loading, categories, locations } = useSponsorEvents(filters);

  const { submitEnquiry } = useSponsorshipEnquiries();

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedPackage, setSelectedPackage] =
    useState<SponsorshipPackage | null>(null);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [enquiryMessage, setEnquiryMessage] = useState("");
  const [companyInfo, setCompanyInfo] = useState("");
  const [submittingEnquiry, setSubmittingEnquiry] = useState(false);

  // Sort events by date
  const sortedEvents = useMemo(() => {
    return [...events].sort(
      (a, b) => a.startDate.toMillis() - b.startDate.toMillis()
    );
  }, [events]);

  const resetFilters = () => {
    setFilters({});
  };

  const handleEnquirySubmit = async () => {
    if (!selectedEvent || !selectedPackage) return;

    setSubmittingEnquiry(true);
    try {
      const enquiryData = {
        eventId: selectedEvent.id!,
        eventTitle: selectedEvent.title,
        packageId: selectedPackage.id,
        packageName: selectedPackage.name,
        companyName: companyInfo,
        contactEmail: "", // This should come from auth context
        message: enquiryMessage,
      };

      await submitEnquiry(enquiryData);

      setShowEnquiryModal(false);
      setSelectedEvent(null);
      setSelectedPackage(null);
      setEnquiryMessage("");
      setCompanyInfo("");
      toast.success("Enquiry submitted successfully!");
    } catch {
      toast.error("Failed to submit enquiry");
    } finally {
      setSubmittingEnquiry(false);
    }
  };

  const openEnquiryModal = (event: Event, packageItem: SponsorshipPackage) => {
    setSelectedEvent(event);
    setSelectedPackage(packageItem);
    setShowEnquiryModal(true);
  };

  if (loading) {
    return (
      <ProtectedRoute requireAuth={true} allowedRoles={["sponsor"]}>
        <DashboardLayout title="Browse Events">
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner size="large" />
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireAuth={true} allowedRoles={["sponsor"]}>
      <Head>
        <title>Browse Events - EventSponsor</title>
        <meta name="description" content="Browse and sponsor events" />
      </Head>

      <DashboardLayout title="Browse Events">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <p className="text-gray-600">
              Discover events perfect for your brand sponsorship
            </p>
            <Button variant="outline" onClick={() => window.history.back()}>
              ← Back to Sponsorships
            </Button>
          </div>

          {/* Filters Panel */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                🔍 Filter Events
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={filters.category || ""}
                    onChange={(e) =>
                      setFilters({ ...filters, category: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category: string) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <select
                    value={filters.location || ""}
                    onChange={(e) =>
                      setFilters({ ...filters, location: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Locations</option>
                    {locations.map((location: string) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expertise
                  </label>
                  <select
                    value={filters.expertise || ""}
                    onChange={(e) =>
                      setFilters({ ...filters, expertise: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Expertise</option>
                    <option value="sponsor">Brand Sponsor</option>
                    <option value="organizer">Event Organizer</option>
                    <option value="sales-marketing">
                      Sales & Marketing Consultant
                    </option>
                    <option value="personal-coaching">Personal Coaching</option>
                    <option value="digital-marketing">Digital Marketing</option>
                    <option value="turnkey-projects">Turnkey Projects</option>
                    <option value="business-consultancy">
                      Business Consultancy
                    </option>
                    <option value="organiser-sponsor">
                      Organiser & Sponsor Services
                    </option>
                    <option value="marketing-sales">Marketing & Sales</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Budget (₹)
                  </label>
                  <input
                    type="number"
                    value={filters.minBudget || ""}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        minBudget: Number(e.target.value) || undefined,
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Budget (₹)
                  </label>
                  <input
                    type="number"
                    value={filters.maxBudget || ""}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        maxBudget: Number(e.target.value) || undefined,
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="No limit"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-600">
                  {loading
                    ? "Loading..."
                    : `${sortedEvents.length} events found`}
                </div>
                <Button variant="outline" size="sm" onClick={resetFilters}>
                  Reset Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <LoadingSpinner size="large" />
            </div>
          )}

          {/* Events Grid */}
          {!loading && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {sortedEvents.map((event) => (
                <Card key={event.id}>
                  <CardContent className="p-6">
                    {/* Event Header */}
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {event.title}
                      </h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span>
                          📅 {event.startDate.toDate().toLocaleDateString()}
                        </span>
                        <span>
                          📍 {event.location.city}, {event.location.country}
                        </span>
                        <span>
                          👥{" "}
                          {event.attendeeCount
                            ? event.attendeeCount.toLocaleString()
                            : "TBD"}{" "}
                          attendees
                        </span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {event.category}
                        </span>
                      </div>
                    </div>

                    {/* Event Description */}
                    <p className="text-gray-700 mb-4 line-clamp-2">
                      {event.description}
                    </p>

                    {/* Sponsorship Packages */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">
                        Sponsorship Packages:
                      </h4>
                      {event.sponsorshipPackages &&
                        event.sponsorshipPackages.map((pkg) => (
                          <div
                            key={pkg.id}
                            className="border border-gray-200 rounded-lg p-4"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h5 className="font-medium text-gray-900">
                                  {pkg.name}
                                </h5>
                                <p className="text-2xl font-bold text-green-600">
                                  ${pkg.price.toLocaleString()}
                                </p>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => openEnquiryModal(event, pkg)}
                              >
                                📧 Send Enquiry
                              </Button>
                            </div>

                            {/* Package Benefits */}
                            <div className="space-y-1">
                              {pkg.benefits &&
                                pkg.benefits.map((benefit, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center text-sm text-gray-600"
                                  >
                                    <span className="text-green-500 mr-2">
                                      ✓
                                    </span>
                                    {benefit}
                                  </div>
                                ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && sortedEvents.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No events found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your filters to see more events
              </p>
              <Button onClick={resetFilters}>Reset Filters</Button>
            </div>
          )}
        </div>

        {/* Enquiry Modal */}
        {showEnquiryModal && selectedEvent && selectedPackage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Send Sponsorship Enquiry
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {selectedEvent.title} - {selectedPackage.name}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowEnquiryModal(false)}
                  >
                    ✕
                  </Button>
                </div>

                <div className="space-y-4">
                  {/* Package Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">
                      Package Details:
                    </h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Package: {selectedPackage.name}</div>
                      <div>
                        Price: ₹{selectedPackage.price.toLocaleString()}
                      </div>
                      <div>Event: {selectedEvent.title}</div>
                      <div>
                        Date:{" "}
                        {selectedEvent.startDate.toDate().toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Company Information */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Information *
                    </label>
                    <textarea
                      value={companyInfo}
                      onChange={(e) => setCompanyInfo(e.target.value)}
                      rows={3}
                      className="w-full p-3 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tell us about your company, industry, and why you're interested in sponsoring this event..."
                      required
                    />
                  </div>

                  {/* Custom Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Message
                    </label>
                    <textarea
                      value={enquiryMessage}
                      onChange={(e) => setEnquiryMessage(e.target.value)}
                      rows={4}
                      className="w-full p-3 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Any specific requirements, questions, or additional information you'd like to share..."
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4 pt-4">
                    <Button
                      onClick={handleEnquirySubmit}
                      disabled={submittingEnquiry || !companyInfo.trim()}
                      className="flex-1"
                    >
                      {submittingEnquiry ? (
                        <>
                          <LoadingSpinner size="small" className="mr-2" />
                          Sending...
                        </>
                      ) : (
                        "📧 Send Enquiry"
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowEnquiryModal(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default BrowseEventsPage;
