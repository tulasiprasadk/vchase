import Head from "next/head";
import Layout from "@/components/layout/Layout";
import { Shield, Clock, Users, FileText } from "lucide-react";

export default function ServicePolicyPage() {
  return (
    <>
      <Head>
        <title>Service Policy - VChase</title>
        <meta
          name="description"
          content="Our commitment to excellence and transparency in every engagement"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <section className="py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                Service{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
                  Policy
                </span>
              </h1>
              <p className="text-xl text-slate-600">
                Our commitment to excellence and transparency in every
                engagement
              </p>
            </div>

            <div className="space-y-8">
              <div className="bg-slate-50 rounded-2xl p-8">
                <div className="flex items-start space-x-4">
                  <Shield className="w-8 h-8 text-purple-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">
                      Quality Assurance
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      We guarantee the highest standards of quality in all our
                      deliverables. Every project undergoes rigorous quality
                      checks and is backed by our 30-day satisfaction guarantee.
                      If you&apos;re not completely satisfied with our work,
                      we&apos;ll make it right or provide a full refund.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-8">
                <div className="flex items-start space-x-4">
                  <Clock className="w-8 h-8 text-blue-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">
                      Timely Delivery
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      We respect your time and deadlines. All projects are
                      delivered on or before the agreed timeline. Our project
                      management system ensures transparent tracking and regular
                      updates throughout the engagement process.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-8">
                <div className="flex items-start space-x-4">
                  <Users className="w-8 h-8 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">
                      Dedicated Support
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      Every client gets a dedicated account manager and 24/7
                      support access. We believe in building long-term
                      relationships and provide ongoing support even after
                      project completion.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-8">
                <div className="flex items-start space-x-4">
                  <FileText className="w-8 h-8 text-purple-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">
                      Transparent Pricing
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      No hidden fees or surprise charges. All costs are clearly
                      outlined in our proposals with detailed breakdowns. We
                      offer flexible payment terms and milestone-based billing
                      for larger projects.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
