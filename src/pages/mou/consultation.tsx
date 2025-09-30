import Head from "next/head";
import Layout from "@/components/layout/Layout";
import Button from "@/components/ui/Button";
import {
  MessageSquare,
  Users,
  FileText,
  Clock,
  Download,
  Mail,
} from "lucide-react";

export default function ConsultationMemoryOfUnderstanding() {
  return (
    <>
      <Head>
        <title>Consultation MOU - EventSponsor</title>
        <meta
          name="description"
          content="Memorandum of Understanding template for consultation services. Download our professional MOU template for consulting agreements and service delivery."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-violet-900 via-violet-800 to-violet-900 text-white py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-8">
                <MessageSquare className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Consultation MOU Template
              </h1>
              <p className="text-xl text-violet-200 max-w-3xl mx-auto mb-8">
                Professional Memorandum of Understanding template for
                consultation services, ensuring clear agreements between
                consultants and clients.
              </p>
              <Button size="lg" className="bg-violet-600 hover:bg-violet-700">
                <Download className="w-5 h-5 mr-2" />
                Download Consultation MOU
              </Button>
            </div>
          </div>
        </section>

        {/* Template Features Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Consultation MOU Components
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Our consultation MOU template covers all essential aspects of
                professional consulting agreements and service delivery.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-slate-50 rounded-2xl p-8">
                <MessageSquare className="w-12 h-12 text-violet-600 mb-6" />
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Scope of Services
                </h3>
                <p className="text-slate-600">
                  Detailed definition of consultation services, deliverables,
                  and project boundaries to ensure clarity.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-8">
                <Clock className="w-12 h-12 text-violet-600 mb-6" />
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Timeline & Milestones
                </h3>
                <p className="text-slate-600">
                  Clear project timeline with defined milestones, deadlines, and
                  progress checkpoints for accountability.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-8">
                <Users className="w-12 h-12 text-violet-600 mb-6" />
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Client Responsibilities
                </h3>
                <p className="text-slate-600">
                  Clear outline of client obligations, resource provision, and
                  cooperation requirements for project success.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-8">
                <FileText className="w-12 h-12 text-violet-600 mb-6" />
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Confidentiality Terms
                </h3>
                <p className="text-slate-600">
                  Comprehensive confidentiality and non-disclosure provisions to
                  protect sensitive business information.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-8">
                <Download className="w-12 h-12 text-violet-600 mb-6" />
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Payment Terms
                </h3>
                <p className="text-slate-600">
                  Detailed payment structure, invoicing procedures, and fee
                  arrangements for consultation services.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-8">
                <Mail className="w-12 h-12 text-violet-600 mb-6" />
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Communication Framework
                </h3>
                <p className="text-slate-600">
                  Established communication protocols, reporting requirements,
                  and feedback mechanisms throughout the engagement.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Service Types Section */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Consultation Service Categories
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Our MOU template can be customized for various types of
                consultation services.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-6">
                  Strategic Consulting
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-violet-600 rounded-full mt-2"></div>
                    <span className="text-slate-600">
                      Business strategy development and planning
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-violet-600 rounded-full mt-2"></div>
                    <span className="text-slate-600">
                      Market analysis and competitive assessment
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-violet-600 rounded-full mt-2"></div>
                    <span className="text-slate-600">
                      Organizational development and restructuring
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-violet-600 rounded-full mt-2"></div>
                    <span className="text-slate-600">
                      Growth strategy and expansion planning
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-6">
                  Operational Consulting
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-violet-600 rounded-full mt-2"></div>
                    <span className="text-slate-600">
                      Process optimization and efficiency improvement
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-violet-600 rounded-full mt-2"></div>
                    <span className="text-slate-600">
                      Technology implementation and integration
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-violet-600 rounded-full mt-2"></div>
                    <span className="text-slate-600">
                      Quality management and standardization
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-violet-600 rounded-full mt-2"></div>
                    <span className="text-slate-600">
                      Performance measurement and KPI development
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Key Clauses Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Essential MOU Clauses
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Critical clauses included in our consultation MOU template to
                protect both consultants and clients.
              </p>
            </div>

            <div className="space-y-8">
              <div className="bg-slate-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  1. Service Delivery Framework
                </h3>
                <p className="text-slate-600 mb-4">
                  Comprehensive framework defining how consultation services
                  will be delivered.
                </p>
                <ul className="text-sm text-slate-500 space-y-1">
                  <li>• Methodology and approach specifications</li>
                  <li>• Resource allocation and team structure</li>
                  <li>• Quality assurance and review processes</li>
                </ul>
              </div>

              <div className="bg-slate-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  2. Intellectual Property Rights
                </h3>
                <p className="text-slate-600 mb-4">
                  Clear definition of intellectual property ownership and usage
                  rights.
                </p>
                <ul className="text-sm text-slate-500 space-y-1">
                  <li>• Ownership of work products and deliverables</li>
                  <li>• Pre-existing intellectual property protection</li>
                  <li>• License terms and usage restrictions</li>
                </ul>
              </div>

              <div className="bg-slate-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  3. Performance Standards
                </h3>
                <p className="text-slate-600 mb-4">
                  Performance criteria and quality standards for consultation
                  services.
                </p>
                <ul className="text-sm text-slate-500 space-y-1">
                  <li>• Service level agreements and benchmarks</li>
                  <li>• Client satisfaction metrics and feedback</li>
                  <li>• Remediation procedures for underperformance</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Why Use Our Consultation MOU
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Professional template that ensures successful consultation
                engagements and protects all parties involved.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-8 bg-white rounded-2xl">
                <div className="text-4xl font-bold text-violet-600 mb-4">
                  100%
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Legal Compliance
                </h3>
                <p className="text-slate-600">
                  Fully compliant with industry standards and regulations
                </p>
              </div>

              <div className="text-center p-8 bg-white rounded-2xl">
                <div className="text-4xl font-bold text-violet-600 mb-4">
                  50+
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Key Clauses
                </h3>
                <p className="text-slate-600">
                  Comprehensive coverage of all essential agreement points
                </p>
              </div>

              <div className="text-center p-8 bg-white rounded-2xl">
                <div className="text-4xl font-bold text-violet-600 mb-4">
                  24/7
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Support Available
                </h3>
                <p className="text-slate-600">
                  Expert support for template customization
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Download CTA */}
        <section className="py-24 bg-violet-900 text-white">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-6">
              Professional Consultation Agreements Made Easy
            </h2>
            <p className="text-xl text-violet-200 mb-8">
              Download our comprehensive consultation MOU template and establish
              clear, professional agreements for your consulting services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-violet-900 hover:bg-violet-50"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Free Template
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-violet-800"
              >
                <Mail className="w-5 h-5 mr-2" />
                Custom Consultation MOU
              </Button>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
