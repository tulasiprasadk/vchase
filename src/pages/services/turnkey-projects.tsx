import Head from "next/head";
import Layout from "@/components/layout/Layout";
import Button from "@/components/ui/Button";
import { Lightbulb, Cog, Rocket, Shield, Clock, Users } from "lucide-react";

export default function TurnkeyProjects() {
  return (
    <>
      <Head>
        <title>Turn Key Projects - EventSponsor</title>
        <meta
          name="description"
          content="Complete end-to-end project solutions from conception to delivery, ensuring seamless execution and exceptional results for your business goals."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 text-white py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-8">
                <Lightbulb className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Turn Key Projects
              </h1>
              <p className="text-xl text-emerald-200 max-w-3xl mx-auto mb-8">
                Complete end-to-end project solutions from conception to
                delivery, ensuring seamless execution and exceptional results
                for your business goals.
              </p>
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                Start Your Project
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Complete Project Management
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                From initial concept to final delivery, we handle every aspect
                of your project with precision and expertise.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-slate-50 rounded-2xl p-8">
                <Cog className="w-12 h-12 text-emerald-600 mb-6" />
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Full-Cycle Management
                </h3>
                <p className="text-slate-600">
                  Complete project lifecycle management from planning and design
                  to implementation and maintenance.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-8">
                <Rocket className="w-12 h-12 text-emerald-600 mb-6" />
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Rapid Deployment
                </h3>
                <p className="text-slate-600">
                  Fast-track project delivery with our proven methodologies and
                  experienced team.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-8">
                <Shield className="w-12 h-12 text-emerald-600 mb-6" />
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Quality Assurance
                </h3>
                <p className="text-slate-600">
                  Rigorous quality control processes ensure exceptional results
                  that meet your specifications.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-8">
                <Clock className="w-12 h-12 text-emerald-600 mb-6" />
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  On-Time Delivery
                </h3>
                <p className="text-slate-600">
                  Reliable project timelines with milestone tracking and
                  transparent progress reporting.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-8">
                <Users className="w-12 h-12 text-emerald-600 mb-6" />
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Expert Team
                </h3>
                <p className="text-slate-600">
                  Dedicated specialists for every aspect of your project
                  ensuring professional execution.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-8">
                <Lightbulb className="w-12 h-12 text-emerald-600 mb-6" />
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Innovation Focus
                </h3>
                <p className="text-slate-600">
                  Cutting-edge solutions and technologies integrated into every
                  project delivery.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Project Types */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Project Categories
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                We deliver turnkey solutions across various project types and
                industries.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: "Event Management Systems",
                  description:
                    "Complete event platform development including registration, management, and analytics.",
                },
                {
                  title: "Marketing Automation",
                  description:
                    "End-to-end marketing automation setup with campaign management and analytics.",
                },
                {
                  title: "Technology Integration",
                  description:
                    "Seamless integration of multiple systems and platforms for optimal workflow.",
                },
                {
                  title: "Custom Development",
                  description:
                    "Bespoke software solutions tailored to your specific business requirements.",
                },
              ].map((item, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 text-lg">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-emerald-900 text-white">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Launch Your Project?
            </h2>
            <p className="text-xl text-emerald-200 mb-8">
              Let our expert team handle your complete project from start to
              finish.
            </p>
            <Button
              size="lg"
              className="bg-white text-emerald-900 hover:bg-emerald-50"
            >
              Get Project Quote
            </Button>
          </div>
        </section>
      </Layout>
    </>
  );
}
