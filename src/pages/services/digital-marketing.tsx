import Head from "next/head";
import Layout from "@/components/layout/Layout";
import Button from "@/components/ui/Button";
import {
  Megaphone,
  Target,
  TrendingUp,
  Users,
  Smartphone,
  BarChart3,
} from "lucide-react";

export default function DigitalMarketing() {
  return (
    <>
      <Head>
        <title>Digital Marketing - EventSponsor</title>
        <meta
          name="description"
          content="Comprehensive digital marketing solutions to boost your online presence, drive engagement, and accelerate business growth through strategic campaigns."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-8">
                <Megaphone className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Digital Marketing
              </h1>
              <p className="text-xl text-blue-200 max-w-3xl mx-auto mb-8">
                Comprehensive digital marketing solutions to boost your online
                presence, drive engagement, and accelerate business growth
                through strategic campaigns.
              </p>
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() =>
                  (window.location.href =
                    "/services/request?type=digital-marketing")
                }
              >
                Get Started Today
              </Button>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Digital Marketing Services
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                End-to-end digital marketing solutions designed to maximize your
                reach and drive measurable results.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-slate-50 rounded-2xl p-8">
                <Target className="w-12 h-12 text-blue-600 mb-6" />
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  SEO Optimization
                </h3>
                <p className="text-slate-600">
                  Improve search engine rankings with strategic keyword
                  research, content optimization, and technical SEO.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-8">
                <TrendingUp className="w-12 h-12 text-blue-600 mb-6" />
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  PPC Advertising
                </h3>
                <p className="text-slate-600">
                  Drive targeted traffic with Google Ads, Facebook Ads, and
                  other paid advertising platforms.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-8">
                <Users className="w-12 h-12 text-blue-600 mb-6" />
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Social Media Marketing
                </h3>
                <p className="text-slate-600">
                  Build engaged communities across all major social platforms
                  with compelling content and strategies.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-8">
                <Smartphone className="w-12 h-12 text-blue-600 mb-6" />
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Content Marketing
                </h3>
                <p className="text-slate-600">
                  Create valuable, relevant content that attracts and retains
                  your target audience.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-8">
                <BarChart3 className="w-12 h-12 text-blue-600 mb-6" />
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Analytics & Reporting
                </h3>
                <p className="text-slate-600">
                  Track performance and ROI with comprehensive analytics and
                  detailed reporting dashboards.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-8">
                <Megaphone className="w-12 h-12 text-blue-600 mb-6" />
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Email Marketing
                </h3>
                <p className="text-slate-600">
                  Nurture leads and maintain customer relationships with
                  personalized email campaigns.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Our Marketing Process
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                A data-driven approach that ensures every campaign delivers
                maximum impact.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Strategy & Planning
                </h3>
                <p className="text-slate-600">
                  Analyze your market, competitors, and audience to create a
                  comprehensive digital strategy.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Implementation
                </h3>
                <p className="text-slate-600">
                  Execute campaigns across multiple channels with precision and
                  attention to detail.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Optimization
                </h3>
                <p className="text-slate-600">
                  Continuously monitor and optimize campaigns for better
                  performance and ROI.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                  4
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Reporting
                </h3>
                <p className="text-slate-600">
                  Provide detailed reports and insights to track progress and
                  inform future strategies.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Proven Results
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Our digital marketing strategies have helped businesses achieve
                remarkable growth.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-8">
                <div className="text-5xl font-bold text-blue-600 mb-4">
                  300%
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Average ROI Increase
                </h3>
                <p className="text-slate-600">
                  Across all our digital marketing campaigns
                </p>
              </div>

              <div className="text-center p-8">
                <div className="text-5xl font-bold text-blue-600 mb-4">85%</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Traffic Growth
                </h3>
                <p className="text-slate-600">
                  Average organic traffic increase within 6 months
                </p>
              </div>

              <div className="text-center p-8">
                <div className="text-5xl font-bold text-blue-600 mb-4">50+</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Successful Campaigns
                </h3>
                <p className="text-slate-600">
                  Delivered across various industries
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-blue-900 text-white">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Transform Your Digital Presence?
            </h2>
            <p className="text-xl text-blue-200 mb-8">
              Let us help you reach your target audience and achieve your
              business goals through strategic digital marketing.
            </p>
            <Button
              size="lg"
              className="bg-white text-blue-900 hover:bg-blue-50"
              onClick={() =>
                (window.location.href =
                  "/services/request?type=digital-marketing")
              }
            >
              Start Your Digital Journey
            </Button>
          </div>
        </section>
      </Layout>
    </>
  );
}
