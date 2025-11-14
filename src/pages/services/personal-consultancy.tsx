import Head from "next/head";
import Layout from "@/components/layout/Layout";
import Button from "@/components/ui/Button";
import { User, Target, TrendingUp, Heart, Star, Zap } from "lucide-react";

export default function PersonalConsultancy() {
  return (
    <>
      <Head>
        <title>Personal Consultancy - EventSponsor</title>
        <meta
          name="description"
          content="Personalized consulting services tailored to individual needs, helping professionals and entrepreneurs achieve their personal and business objectives."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 text-white py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-8">
                <User className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Personal Consultancy
              </h1>
              <p className="text-xl text-purple-200 max-w-3xl mx-auto mb-8">
                Personalized consulting services tailored to individual needs,
                helping professionals and entrepreneurs achieve their personal
                and business objectives.
              </p>
              <Button
                size="lg"
                className="bg-purple-600 hover:bg-purple-700"
                onClick={() =>
                  (window.location.href =
                    "/services/request?type=personal-consultancy")
                }
              >
                Book Your Session
              </Button>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Personalized Guidance
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                One-on-one consulting sessions designed to unlock your potential
                and accelerate your professional growth.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-slate-50 rounded-2xl p-8">
                <Target className="w-12 h-12 text-purple-600 mb-6" />
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Goal Setting
                </h3>
                <p className="text-slate-600">
                  Define clear, achievable goals and create actionable roadmaps
                  for personal and professional success.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-8">
                <TrendingUp className="w-12 h-12 text-purple-600 mb-6" />
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Career Development
                </h3>
                <p className="text-slate-600">
                  Strategic career planning and skill development to advance
                  your professional trajectory.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-8">
                <Heart className="w-12 h-12 text-purple-600 mb-6" />
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Work-Life Balance
                </h3>
                <p className="text-slate-600">
                  Find harmony between professional ambitions and personal
                  well-being for sustainable success.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-8">
                <Star className="w-12 h-12 text-purple-600 mb-6" />
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Leadership Coaching
                </h3>
                <p className="text-slate-600">
                  Develop leadership skills and executive presence to inspire
                  and guide teams effectively.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-8">
                <Zap className="w-12 h-12 text-purple-600 mb-6" />
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Performance Optimization
                </h3>
                <p className="text-slate-600">
                  Enhance productivity and efficiency through personalized
                  strategies and best practices.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-8">
                <User className="w-12 h-12 text-purple-600 mb-6" />
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Personal Branding
                </h3>
                <p className="text-slate-600">
                  Build a strong personal brand that reflects your values and
                  professional expertise.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Approach Section */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Our Approach
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                A personalized methodology that adapts to your unique
                circumstances and aspirations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-6">
                  Personalized Assessment
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                    <span className="text-slate-600">
                      Comprehensive skills and personality evaluation
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                    <span className="text-slate-600">
                      Identification of strengths and growth areas
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                    <span className="text-slate-600">
                      Goal alignment with personal values
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-6">
                  Ongoing Support
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                    <span className="text-slate-600">
                      Regular progress reviews and adjustments
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                    <span className="text-slate-600">
                      24/7 email support for urgent questions
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                    <span className="text-slate-600">
                      Resource library and tools access
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-purple-900 text-white">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-6">
              Unlock Your Full Potential
            </h2>
            <p className="text-xl text-purple-200 mb-8">
              Start your personalized journey toward achieving your most
              ambitious goals.
            </p>
            <Button
              size="lg"
              className="bg-white text-purple-900 hover:bg-purple-50"
              onClick={() =>
                (window.location.href =
                  "/services/request?type=personal-consultancy")
              }
            >
              Schedule Free Consultation
            </Button>
          </div>
        </section>
      </Layout>
    </>
  );
}
