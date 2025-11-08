import Head from "next/head";
import Layout from "@/components/layout/Layout";
import Button from "@/components/ui/Button";
import {
  FileText,
  Award,
  TrendingUp,
  Shield,
  Download,
  Mail,
} from "lucide-react";

export default function SponsorsMemoryOfUnderstanding() {
  return (
    <>
      <Head>
        <title>Sponsors MOU - EventSponsor</title>
        <meta
          name="description"
          content="Memorandum of Understanding template for event sponsors. Download our comprehensive MOU template to secure sponsorship agreements and protect investments."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-rose-900 via-rose-800 to-rose-900 text-white py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-8">
                <Award className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Sponsors MOU Template
              </h1>
              <p className="text-xl text-rose-200 max-w-3xl mx-auto mb-8">
                Comprehensive Memorandum of Understanding template designed for
                sponsors to secure agreements and protect sponsorship
                investments.
              </p>
              <a href="/mou/sponsors-mou.pdf" download className="inline-block">
                <Button size="lg" className="bg-rose-600 hover:bg-rose-700">
                  <Download className="w-5 h-5 mr-2" />
                  Download Sponsor MOU
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Sponsor-Focused MOU Features
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Our sponsor MOU template is specifically designed to protect
                sponsor interests and maximize partnership value.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-slate-50 rounded-2xl p-8">
                <Award className="w-12 h-12 text-rose-600 mb-6" />
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Sponsorship Benefits
                </h3>
                <p className="text-slate-600">
                  Detailed enumeration of all sponsorship benefits, visibility
                  opportunities, and brand exposure elements.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-8">
                <TrendingUp className="w-12 h-12 text-rose-600 mb-6" />
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  ROI Metrics
                </h3>
                <p className="text-slate-600">
                  Clear definition of success metrics, measurement criteria, and
                  reporting standards for ROI tracking.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-8">
                <Shield className="w-12 h-12 text-rose-600 mb-6" />
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Investment Protection
                </h3>
                <p className="text-slate-600">
                  Comprehensive clauses to protect sponsor investments including
                  performance guarantees and remedies.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-8">
                <FileText className="w-12 h-12 text-rose-600 mb-6" />
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Brand Guidelines
                </h3>
                <p className="text-slate-600">
                  Specifications for brand usage, logo placement, and marketing
                  material approval processes.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-8">
                <Mail className="w-12 h-12 text-rose-600 mb-6" />
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Exclusivity Terms
                </h3>
                <p className="text-slate-600">
                  Clear definition of exclusivity rights, competitor
                  restrictions, and category protection clauses.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-8">
                <Download className="w-12 h-12 text-rose-600 mb-6" />
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Performance Clauses
                </h3>
                <p className="text-slate-600">
                  Detailed performance requirements, deliverable timelines, and
                  quality assurance provisions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Sponsor Protection Section */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Comprehensive Sponsor Protection
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Our MOU template includes robust protection mechanisms
                specifically designed for sponsor interests and investment
                security.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-6">
                  Investment Safeguards
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-rose-600 rounded-full mt-2"></div>
                    <span className="text-slate-600">
                      Guaranteed minimum deliverables and exposure
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-rose-600 rounded-full mt-2"></div>
                    <span className="text-slate-600">
                      Performance bonds and penalty clauses
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-rose-600 rounded-full mt-2"></div>
                    <span className="text-slate-600">
                      Refund policies for non-delivery
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-rose-600 rounded-full mt-2"></div>
                    <span className="text-slate-600">
                      Force majeure and cancellation provisions
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-6">
                  Brand Protection
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-rose-600 rounded-full mt-2"></div>
                    <span className="text-slate-600">
                      Exclusive category sponsorship rights
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-rose-600 rounded-full mt-2"></div>
                    <span className="text-slate-600">
                      Brand association and image protection
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-rose-600 rounded-full mt-2"></div>
                    <span className="text-slate-600">
                      Competitor restriction agreements
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-rose-600 rounded-full mt-2"></div>
                    <span className="text-slate-600">
                      Intellectual property safeguards
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Sponsorship Benefits Detail */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Detailed Sponsorship Framework
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Our MOU template provides a comprehensive framework for defining
                and securing sponsorship benefits.
              </p>
            </div>

            <div className="space-y-8">
              <div className="bg-slate-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  1. Visibility & Branding
                </h3>
                <p className="text-slate-600 mb-4">
                  Comprehensive branding opportunities and visibility
                  specifications.
                </p>
                <ul className="text-sm text-slate-500 space-y-1">
                  <li>
                    • Logo placement specifications and sizing requirements
                  </li>
                  <li>• Digital and physical signage opportunities</li>
                  <li>• Speaking and presentation opportunities</li>
                </ul>
              </div>

              <div className="bg-slate-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  2. Audience Access
                </h3>
                <p className="text-slate-600 mb-4">
                  Direct access to target audiences and networking
                  opportunities.
                </p>
                <ul className="text-sm text-slate-500 space-y-1">
                  <li>• Attendee contact information and demographics</li>
                  <li>• VIP networking sessions and exclusive access</li>
                  <li>• Lead generation and collection rights</li>
                </ul>
              </div>

              <div className="bg-slate-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  3. Content & Media
                </h3>
                <p className="text-slate-600 mb-4">
                  Content creation and media coverage agreements.
                </p>
                <ul className="text-sm text-slate-500 space-y-1">
                  <li>• Social media promotion and content sharing</li>
                  <li>• Photography and video usage rights</li>
                  <li>• Press release and media mention requirements</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ROI Tracking Section */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                ROI Measurement & Reporting
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Built-in mechanisms for tracking and measuring sponsorship
                return on investment.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-8 bg-white rounded-2xl">
                <TrendingUp className="w-12 h-12 text-rose-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Performance Metrics
                </h3>
                <p className="text-slate-600">
                  Detailed KPIs and measurement criteria for sponsorship success
                  evaluation.
                </p>
              </div>

              <div className="text-center p-8 bg-white rounded-2xl">
                <FileText className="w-12 h-12 text-rose-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Regular Reporting
                </h3>
                <p className="text-slate-600">
                  Scheduled reporting requirements and performance update
                  protocols.
                </p>
              </div>

              <div className="text-center p-8 bg-white rounded-2xl">
                <Shield className="w-12 h-12 text-rose-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Quality Assurance
                </h3>
                <p className="text-slate-600">
                  Quality standards and remediation procedures for
                  underperformance.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Download CTA */}
        <section className="py-24 bg-rose-900 text-white">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-6">
              Secure Your Sponsorship Investments
            </h2>
            <p className="text-xl text-rose-200 mb-8">
              Download our comprehensive sponsor MOU template and protect your
              brand while maximizing partnership value.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-rose-900 hover:bg-rose-50"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Sponsor MOU
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-rose-800"
              >
                <Mail className="w-5 h-5 mr-2" />
                Request Custom Template
              </Button>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
