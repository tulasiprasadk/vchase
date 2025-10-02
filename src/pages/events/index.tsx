import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import Layout from "@/components/layout/Layout";
import Button from "@/components/ui/Button";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { useSponsorEvents } from "@/hooks/useSponsorEvents";
import { useAuth } from "@/context/AuthContext";
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Tag,
  Building2,
  ExternalLink,
  LogIn,
  ImageIcon,
} from "lucide-react";
import toast from "react-hot-toast";

const EventsPage: React.FC = () => {
  const router = useRouter();
  const { user, userProfile } = useAuth();
  const { events, loading } = useSponsorEvents();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Debug logging
  console.log("🚀 EventsPage - Events data:", {
    events,
    loading,
    eventsCount: events.length,
  });

  // Filter published events only
  const publishedEvents = events.filter(
    (event) => event.status === "published"
  );

  console.log("📊 Published events:", {
    publishedEvents,
    count: publishedEvents.length,
  });

  // Get unique categories
  const categories = [
    "all",
    ...new Set(publishedEvents.map((event) => event.category).filter(Boolean)),
  ];

  const filteredEvents =
    selectedCategory === "all"
      ? publishedEvents
      : publishedEvents.filter((event) => event.category === selectedCategory);

  const handleSponsorClick = () => {
    if (!user) {
      // User not logged in - redirect to login
      toast.error("Please sign in to sponsor this event");
      router.push("/auth/signin");
      return;
    }

    if (userProfile?.userType !== "sponsor") {
      // User is not a sponsor
      toast.error("Only sponsors can apply for sponsorships");
      return;
    }

    // User is a sponsor - redirect to sponsorships page
    router.push("/dashboard/sponsorships");
  };

  const formatDate = (date: unknown) => {
    if (!date) return "TBD";
    try {
      // Handle Firebase Timestamp or Date objects
      const dateObj = (date as { toDate?: () => Date }).toDate
        ? (date as { toDate: () => Date }).toDate()
        : new Date(date as string | number | Date);
      return dateObj.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "TBD";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <>
      <Head>
        <title>Browse Events - V Chase</title>
        <meta
          name="description"
          content="Discover events perfect for your brand sponsorship"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-slate-900 mb-4">
                Browse{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">
                  Events
                </span>
              </h1>
              <p className="text-xl text-slate-700 max-w-3xl mx-auto">
                Discover events perfect for your brand sponsorship and connect
                with your target audience
              </p>
            </div>

            {/* Category Filter */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2 justify-center">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                        : "bg-white text-slate-700 hover:bg-blue-50 hover:text-blue-700 border border-slate-300 hover:border-blue-300"
                    }`}
                  >
                    {category === "all" ? "All Events" : category}
                  </button>
                ))}
              </div>
            </div>

            {/* Events Grid */}
            <div className="space-y-8">
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="mt-4 text-slate-700 font-medium">
                    Loading events...
                  </p>
                </div>
              ) : filteredEvents.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    No Events Found
                  </h3>
                  <p className="text-slate-700 mb-8">
                    {selectedCategory === "all"
                      ? "No events are currently available for sponsorship. Check back soon for new opportunities!"
                      : `No events found in the ${selectedCategory} category. Try browsing other categories or check back later.`}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/">
                      <Button variant="outline">Back to Home</Button>
                    </Link>
                    {selectedCategory !== "all" && (
                      <Button onClick={() => setSelectedCategory("all")}>
                        View All Categories
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredEvents.map((event) => (
                    <Card
                      key={event.id}
                      className="group overflow-hidden bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0"
                    >
                      {/* Event Image */}
                      {event.imageUrl ? (
                        <div className="relative h-40 w-full overflow-hidden">
                          <Image
                            src={event.imageUrl}
                            alt={event.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>
                      ) : (
                        <div className="h-40 w-full bg-gradient-to-br from-blue-100 via-indigo-50 to-slate-100 flex items-center justify-center relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-indigo-400/10"></div>
                          <div className="text-center z-10">
                            <ImageIcon className="w-12 h-12 text-blue-300 mx-auto mb-2" />
                            <p className="text-blue-500 font-medium text-sm">
                              No Image Available
                            </p>
                          </div>
                        </div>
                      )}

                      <CardHeader className="p-4 pb-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors duration-300 line-clamp-2">
                              {event.title}
                            </h3>
                            {event.category && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border border-blue-200">
                                <Tag className="w-3 h-3 mr-1" />
                                {event.category}
                              </span>
                            )}
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="px-4 pb-4 space-y-4">
                        {/* Event Details - Compact */}
                        <div className="space-y-2">
                          <div className="flex items-center text-slate-600">
                            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-md flex items-center justify-center mr-2">
                              <Calendar className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-sm font-medium">
                              {formatDate(event.startDate)}
                            </span>
                            {event.endDate && (
                              <span className="text-sm font-medium">
                                {" "}
                                - {formatDate(event.endDate)}
                              </span>
                            )}
                          </div>

                          {event.location && (
                            <div className="flex items-center text-slate-600">
                              <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-md flex items-center justify-center mr-2">
                                <MapPin className="w-3 h-3 text-white" />
                              </div>
                              <span className="text-sm font-medium truncate">
                                {event.location.venue}, {event.location.city}
                              </span>
                            </div>
                          )}

                          {event.maxAttendees && (
                            <div className="flex items-center text-slate-600">
                              <div className="w-6 h-6 bg-gradient-to-br from-slate-500 to-slate-600 rounded-md flex items-center justify-center mr-2">
                                <Users className="w-3 h-3 text-white" />
                              </div>
                              <span className="text-sm font-medium">
                                {event.maxAttendees.toLocaleString()} attendees
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Description */}
                        {event.description && (
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-100">
                            <p className="text-slate-700 text-sm leading-relaxed line-clamp-2">
                              {event.description}
                            </p>
                          </div>
                        )}

                        {/* Sponsorship Packages */}
                        {event.sponsorshipPackages &&
                          event.sponsorshipPackages.length > 0 && (
                            <div>
                              <h4 className="font-bold text-slate-900 mb-2 text-sm">
                                Packages ({event.sponsorshipPackages.length}):
                              </h4>
                              <div className="space-y-1">
                                {event.sponsorshipPackages
                                  .slice(0, 2)
                                  .map((pkg) => (
                                    <div
                                      key={pkg.id}
                                      className="flex items-center justify-between bg-white border border-blue-100 rounded-lg p-2 hover:border-blue-200 transition-all duration-200"
                                    >
                                      <div className="flex-1 min-w-0">
                                        <span className="font-medium text-slate-900 text-sm truncate block">
                                          {pkg.name}
                                        </span>
                                      </div>
                                      <div className="flex items-center bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium px-2 py-1 rounded text-xs ml-2">
                                        <DollarSign className="w-3 h-3 mr-0.5" />
                                        {formatCurrency(pkg.price)}
                                      </div>
                                    </div>
                                  ))}
                                {event.sponsorshipPackages.length > 2 && (
                                  <div className="text-center">
                                    <span className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded text-xs font-medium border border-blue-200">
                                      +{event.sponsorshipPackages.length - 2}{" "}
                                      more
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-slate-100">
                          <Button
                            onClick={() => handleSponsorClick()}
                            className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                          >
                            {!user ? (
                              <>
                                <LogIn className="w-4 h-4 mr-2" />
                                Sign In to Sponsor
                              </>
                            ) : userProfile?.userType === "sponsor" ? (
                              <>
                                <Building2 className="w-4 h-4 mr-2" />
                                Apply for Sponsorship
                              </>
                            ) : (
                              <>
                                <ExternalLink className="w-4 h-4 mr-2" />
                                View Event
                              </>
                            )}
                          </Button>

                          {user && userProfile?.userType === "organizer" && (
                            <Link href="/dashboard/events">
                              <Button
                                variant="outline"
                                className="border border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 font-medium py-2 px-4 rounded-lg transition-all duration-300"
                              >
                                <Building2 className="w-4 h-4 mr-2" />
                                Manage Events
                              </Button>
                            </Link>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Call to Action */}
            {!user && filteredEvents.length > 0 && (
              <div className="mt-16 text-center bg-white rounded-lg shadow-sm p-8 border border-blue-100">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Ready to Start{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">
                    Sponsoring?
                  </span>
                </h3>
                <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
                  Join our platform to connect with event organizers and grow
                  your brand through strategic sponsorships.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/auth/signup">
                    <Button size="lg">Create Account</Button>
                  </Link>
                  <Link href="/auth/signin">
                    <Button size="lg" variant="outline">
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default EventsPage;
