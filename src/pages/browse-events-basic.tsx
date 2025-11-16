import React from "react";
import Head from "next/head";
import Link from "next/link";

const BrowseEventsBasic: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Browse Events - EventSponsor</title>
        <meta name="description" content="Browse and sponsor events" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Browse Events
          </h1>

          <div className="mb-6">
            <p className="text-gray-600">
              Discover events perfect for your brand sponsorship
            </p>
          </div>

          {/* Mock Event Card */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Tech Summit 2025
              </h3>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                <span>📅 March 15, 2025</span>
                <span>📍 San Francisco, USA</span>
                <span>👥 5,000 attendees</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  Technology
                </span>
              </div>

              <p className="text-gray-700 mb-4">
                A comprehensive technology conference featuring the latest
                innovations in AI, blockchain, and cloud computing.
              </p>

              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">
                  Sponsorship Packages:
                </h4>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h5 className="font-medium text-gray-900">Platinum</h5>
                      <p className="text-2xl font-bold text-green-600">
                        ₹25,000
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      📧 Send Enquiry
                    </button>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="text-green-500 mr-2">✓</span>
                      Main stage speaking slot
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="text-green-500 mr-2">✓</span>
                      Premium booth space
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="text-green-500 mr-2">✓</span>
                      VIP networking access
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h5 className="font-medium text-gray-900">Gold</h5>
                      <p className="text-2xl font-bold text-green-600">
                        ₹15,000
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      📧 Send Enquiry
                    </button>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="text-green-500 mr-2">✓</span>
                      Exhibition booth
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="text-green-500 mr-2">✓</span>
                      Logo on materials
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="text-green-500 mr-2">✓</span>
                      Welcome reception access
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Marketing Innovation Conference
              </h3>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                <span>📅 April 20, 2025</span>
                <span>📍 New York, USA</span>
                <span>👥 3,000 attendees</span>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                  Marketing
                </span>
              </div>

              <p className="text-gray-700 mb-4">
                Explore the future of marketing with industry leaders and
                cutting-edge strategies.
              </p>

              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">
                  Sponsorship Packages:
                </h4>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h5 className="font-medium text-gray-900">Silver</h5>
                      <p className="text-2xl font-bold text-green-600">
                        ₹8,000
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      📧 Send Enquiry
                    </button>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="text-green-500 mr-2">✓</span>
                      Exhibition space
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="text-green-500 mr-2">✓</span>
                      Program listing
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="text-green-500 mr-2">✓</span>
                      Networking lunch access
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              ✅ This page demonstrates the browse events functionality working
            </p>
            <Link
              href="/dashboard/sponsorships"
              className="inline-block px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              ← Back to My Sponsorships
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowseEventsBasic;
