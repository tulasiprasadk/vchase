import Head from "next/head";
import Layout from "@/components/layout/Layout";
import Button from "@/components/ui/Button";
import {
  Handshake,
  Calendar,
  Users,
  Target,
  Award,
  TrendingUp,
} from "lucide-react";

export default function OrganiserSponsor() {
  return (
    <>
      <Head>
        <title>Organiser & Sponsor Services - EventSponsor</title>
        <meta
          name="description"
          content="Specialized services for event organizers and sponsors to create successful partnerships, maximize event impact, and achieve mutual business objectives."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-teal-900 via-teal-800 to-teal-900 text-white py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-8">
                <Handshake className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Organiser & Sponsor Services
              </h1>
              <p className="text-xl text-teal-200 max-w-3xl mx-auto mb-8">
                Specialized services for event organizers and sponsors to create
                successful partnerships, maximize event impact, and achieve
                mutual business objectives.
              </p>
              <Button
                size="lg"
                className="bg-teal-600 hover:bg-teal-700"
                onClick={() =>
                  (window.location.href =
                    "/services/request?type=organiser-sponsor")
                }
              >
                Partner With Us
              </Button>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Comprehensive Partnership Solutions
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Bridging the gap between event organizers and sponsors to create
                mutually beneficial partnerships.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-slate-50 rounded-2xl p-8">
                <Calendar className="w-12 h-12 text-teal-600 mb-6" />
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Event Planning
                </h3>
                <p className="text-slate-600">
                  End-to-end event planning services from concept development to
                  execution and post-event analysis.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-8">
                <Users className="w-12 h-12 text-teal-600 mb-6" />
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Sponsor Matching
                </h3>
                <p className="text-slate-600">
                  Connect organizers with ideal sponsors based on brand
                  alignment, audience demographics, and objectives.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-8">
                <Target className="w-12 h-12 text-teal-600 mb-6" />
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Partnership Strategy
                </h3>
                <p className="text-slate-600">
                  Develop strategic partnerships that deliver value for both
                  organizers and sponsors.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-8">
                <Award className="w-12 h-12 text-teal-600 mb-6" />
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Sponsorship Packages
                </h3>
                <p className="text-slate-600">
                  Create compelling sponsorship packages that maximize value and
                  return on investment.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-8">
                <TrendingUp className="w-12 h-12 text-teal-600 mb-6" />
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Performance Analytics
                </h3>
                <p className="text-slate-600">
                  Track and measure event success with comprehensive analytics
                  and reporting for all stakeholders.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-8">
                <Handshake className="w-12 h-12 text-teal-600 mb-6" />
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Relationship Management
                </h3>
                <p className="text-slate-600">
                  Maintain long-term relationships between organizers and
                  sponsors for future collaborations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* For Organizers Section */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-4xl font-bold text-slate-900 mb-6">
                  For Event Organizers
                </h2>
                <p className="text-xl text-slate-600 mb-8">
                  Maximize your event potential with our comprehensive organizer
                  services.
                </p>

                <ul className="space-y-4 mb-8">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-teal-600 rounded-full mt-2"></div>
                    <span className="text-slate-600">
                      Access to a curated network of premium sponsors
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-teal-600 rounded-full mt-2"></div>
                    <span className="text-slate-600">
                      Professional event planning and management support
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-teal-600 rounded-full mt-2"></div>
                    <span className="text-slate-600">
                      Revenue optimization through strategic partnerships
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-teal-600 rounded-full mt-2"></div>
                    <span className="text-slate-600">
                      Marketing and promotional support
                    </span>
                  </li>
                </ul>

                <Button
                  className="bg-teal-600 hover:bg-teal-700"
                  onClick={() =>
                    (window.location.href = "/services/request?type=organiser")
                  }
                >
                  Register as Organizer
                </Button>
              </div>

              <div>
                <h2 className="text-4xl font-bold text-slate-900 mb-6">
                  For Sponsors
                </h2>
                <p className="text-xl text-slate-600 mb-8">
                  Connect with high-quality events that align with your brand
                  objectives.
                </p>

                <ul className="space-y-4 mb-8">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-teal-600 rounded-full mt-2"></div>
                    <span className="text-slate-600">
                      Vetted events with verified attendee demographics
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-teal-600 rounded-full mt-2"></div>
                    <span className="text-slate-600">
                      Customized sponsorship packages for maximum ROI
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-teal-600 rounded-full mt-2"></div>
                    <span className="text-slate-600">
                      Brand exposure and lead generation opportunities
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-teal-600 rounded-full mt-2"></div>
                    <span className="text-slate-600">
                      Detailed performance reporting and analytics
                    </span>
                  </li>
                </ul>

                <Button
                  className="bg-teal-600 hover:bg-teal-700"
                  onClick={() =>
                    (window.location.href = "/services/request?type=sponsor")
                  }
                >
                  Become a Sponsor
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Success Metrics */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Partnership Success
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Our proven track record of creating successful organizer-sponsor
                partnerships.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center p-6">
                <div className="text-4xl font-bold text-teal-600 mb-4">
                  500+
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Events Facilitated
                </h3>
                <p className="text-slate-600">
                  Successful partnerships created
                </p>
              </div>

              <div className="text-center p-6">
                <div className="text-4xl font-bold text-teal-600 mb-4">95%</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Satisfaction Rate
                </h3>
                <p className="text-slate-600">Among organizers and sponsors</p>
              </div>

              <div className="text-center p-6">
                <div className="text-4xl font-bold text-teal-600 mb-4">
                  $10M+
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Sponsorship Value
                </h3>
                <p className="text-slate-600">Total value facilitated</p>
              </div>

              <div className="text-center p-6">
                <div className="text-4xl font-bold text-teal-600 mb-4">80%</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Repeat Partnerships
                </h3>
                <p className="text-slate-600">Long-term relationships formed</p>
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Our Partnership Process
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                A streamlined approach to creating successful organizer-sponsor
                partnerships.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-teal-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Discovery
                </h3>
                <p className="text-slate-600">
                  Understand objectives and requirements for both organizers and
                  sponsors.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-teal-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Matching
                </h3>
                <p className="text-slate-600">
                  Connect compatible partners based on brand alignment and
                  objectives.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-teal-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Negotiation
                </h3>
                <p className="text-slate-600">
                  Facilitate discussions and create mutually beneficial
                  partnership terms.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-teal-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                  4
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Execution
                </h3>
                <p className="text-slate-600">
                  Support partnership execution and track performance for
                  success.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-teal-900 text-white">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Create Powerful Partnerships?
            </h2>
            <p className="text-xl text-teal-200 mb-8">
              Join our network of successful event organizers and sponsors to
              create impactful partnerships that drive mutual success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-teal-900 hover:bg-teal-50"
                onClick={() =>
                  (window.location.href = "/services/request?type=organiser")
                }
              >
                Join as Organizer
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-teal-800"
                onClick={() =>
                  (window.location.href = "/services/request?type=sponsor")
                }
              >
                Become a Sponsor
              </Button>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
