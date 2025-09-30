import Head from "next/head";
import Layout from "@/components/layout/Layout";
import Button from "@/components/ui/Button";
import {
  FileText,
  Calendar,
  Users,
  Handshake,
  Download,
  Mail,
} from "lucide-react";

export default function OrganizersMemoryOfUnderstanding() {
  return (
    <>
      <Head>
        <title>Organizers MOU - EventSponsor</title>
        <meta
          name="description"
          content="Memorandum of Understanding template for event organizers. Download our comprehensive MOU template to formalize partnerships and agreements."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900 text-white py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-8">
                <FileText className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Organizers MOU Template
              </h1>
              <p className="text-xl text-indigo-200 max-w-3xl mx-auto mb-8">
                Professional Memorandum of Understanding template designed
                specifically for event organizers to formalize partnerships and
                agreements.
              </p>
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
                <Download className="w-5 h-5 mr-2" />
                Download MOU Template
              </Button>
            </div>
          </div>
        </section>

        {/* What's Included Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                What is Included in the MOU
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Our comprehensive MOU template covers all essential aspects of
                event organization partnerships.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-slate-50 rounded-2xl p-8">
                <Calendar className="w-12 h-12 text-indigo-600 mb-6" />
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Event Timeline
                </h3>
                <p className="text-slate-600">
                  Detailed project timeline including milestones, deadlines, and
                  key deliverables for all parties involved.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-8">
                <Users className="w-12 h-12 text-indigo-600 mb-6" />
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Roles & Responsibilities
                </h3>
                <p className="text-slate-600">
                  Clear definition of roles, responsibilities, and expectations
                  for organizers, sponsors, and other stakeholders.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-8">
                <Handshake className="w-12 h-12 text-indigo-600 mb-6" />
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Terms & Conditions
                </h3>
                <p className="text-slate-600">
                  Comprehensive terms covering payment schedules, cancellation
                  policies, and dispute resolution procedures.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-8">
                <FileText className="w-12 h-12 text-indigo-600 mb-6" />
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Legal Framework
                </h3>
                <p className="text-slate-600">
                  Legally sound framework that protects all parties and ensures
                  compliance with industry standards.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-8">
                <Mail className="w-12 h-12 text-indigo-600 mb-6" />
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Communication Protocol
                </h3>
                <p className="text-slate-600">
                  Established communication channels and reporting procedures to
                  ensure smooth collaboration.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-8">
                <Download className="w-12 h-12 text-indigo-600 mb-6" />
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Customizable Format
                </h3>
                <p className="text-slate-600">
                  Editable template that can be customized to fit specific event
                  requirements and partnership needs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Why Use Our MOU Template
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Professional, legally vetted template that saves time and
                ensures comprehensive coverage of all partnership aspects.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-6">
                  Professional Benefits
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
                    <span className="text-slate-600">
                      Establishes professional credibility with partners
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
                    <span className="text-slate-600">
                      Reduces misunderstandings and conflicts
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
                    <span className="text-slate-600">
                      Streamlines the partnership negotiation process
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
                    <span className="text-slate-600">
                      Provides legal protection for all parties
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-6">
                  Practical Advantages
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
                    <span className="text-slate-600">
                      Saves time on document preparation
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
                    <span className="text-slate-600">
                      Ensures nothing important is overlooked
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
                    <span className="text-slate-600">
                      Easy to customize for different events
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
                    <span className="text-slate-600">
                      Industry-standard language and format
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Key Sections Preview */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                MOU Key Sections
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Preview of the main sections included in our organizers MOU
                template.
              </p>
            </div>

            <div className="space-y-8">
              <div className="bg-slate-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  1. Partnership Overview
                </h3>
                <p className="text-slate-600 mb-4">
                  Defines the nature of the partnership, event objectives, and
                  mutual goals.
                </p>
                <ul className="text-sm text-slate-500 space-y-1">
                  <li>• Event description and scope</li>
                  <li>• Partnership objectives</li>
                  <li>• Target audience and expected outcomes</li>
                </ul>
              </div>

              <div className="bg-slate-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  2. Financial Terms
                </h3>
                <p className="text-slate-600 mb-4">
                  Detailed breakdown of financial commitments, payment
                  schedules, and revenue sharing.
                </p>
                <ul className="text-sm text-slate-500 space-y-1">
                  <li>• Sponsorship amounts and payment terms</li>
                  <li>• Cost sharing arrangements</li>
                  <li>• Revenue distribution agreements</li>
                </ul>
              </div>

              <div className="bg-slate-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  3. Operational Framework
                </h3>
                <p className="text-slate-600 mb-4">
                  Operational guidelines including logistics, marketing, and
                  execution responsibilities.
                </p>
                <ul className="text-sm text-slate-500 space-y-1">
                  <li>• Event logistics and coordination</li>
                  <li>• Marketing and promotional activities</li>
                  <li>• Quality standards and deliverables</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Download CTA */}
        <section className="py-24 bg-indigo-900 text-white">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Formalize Your Partnerships?
            </h2>
            <p className="text-xl text-indigo-200 mb-8">
              Download our professional MOU template and start building
              stronger, more secure partnerships today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-indigo-900 hover:bg-indigo-50"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Free Template
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-indigo-800"
              >
                <Mail className="w-5 h-5 mr-2" />
                Get Custom MOU
              </Button>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
