import Head from "next/head";
import Layout from "@/components/layout/Layout";
import Button from "@/components/ui/Button";
import { Briefcase, TrendingUp, Target, Users } from "lucide-react";

export default function BusinessConsultancy() {
  return (
    <>
      <Head>
        <title>Business Consultancy - EventSponsor</title>
        <meta
          name="description"
          content="Strategic business consulting that transforms operations and accelerates growth through data-driven insights and proven methodologies."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-8">
                <Briefcase className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Business Consultancy
              </h1>
              <p className="text-xl text-blue-200 max-w-3xl mx-auto mb-8">
                Strategic business consulting that transforms operations and
                accelerates growth through data-driven insights and proven
                methodologies.
              </p>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Get Started Today
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Comprehensive Business Solutions
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Our business consultancy services cover every aspect of your
                organization, from strategic planning to operational excellence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-slate-50 rounded-2xl p-8">
                <TrendingUp className="w-12 h-12 text-blue-600 mb-6" />
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Growth Strategy
                </h3>
                <p className="text-slate-600">
                  Develop comprehensive growth strategies that align with your
                  business goals and market opportunities.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-8">
                <Target className="w-12 h-12 text-blue-600 mb-6" />
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Performance Optimization
                </h3>
                <p className="text-slate-600">
                  Identify bottlenecks and optimize operations for maximum
                  efficiency and profitability.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-8">
                <Users className="w-12 h-12 text-blue-600 mb-6" />
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Team Development
                </h3>
                <p className="text-slate-600">
                  Build high-performing teams and improve organizational culture
                  for sustained success.
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
                Our Proven Process
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                A systematic approach to business transformation that delivers
                measurable results.
              </p>
            </div>

            <div className="space-y-8">
              {[
                {
                  step: "01",
                  title: "Discovery & Assessment",
                  description:
                    "Comprehensive analysis of your current business state, challenges, and opportunities.",
                },
                {
                  step: "02",
                  title: "Strategy Development",
                  description:
                    "Create customized strategies aligned with your business objectives and market conditions.",
                },
                {
                  step: "03",
                  title: "Implementation",
                  description:
                    "Execute strategies with clear milestones, timelines, and performance metrics.",
                },
                {
                  step: "04",
                  title: "Monitoring & Optimization",
                  description:
                    "Continuous monitoring and refinement to ensure sustained growth and success.",
                },
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-6">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-bold text-lg">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 text-lg">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-blue-900 text-white">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-blue-200 mb-8">
              Let&apos;s discuss how our business consultancy services can
              accelerate your growth and drive sustainable success.
            </p>
            <Button
              size="lg"
              className="bg-white text-blue-900 hover:bg-blue-50"
            >
              Schedule a Consultation
            </Button>
          </div>
        </section>
      </Layout>
    </>
  );
}
