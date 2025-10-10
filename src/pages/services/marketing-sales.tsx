import Head from "next/head";
import Layout from "@/components/layout/Layout";
import Button from "@/components/ui/Button";
import {
  ShoppingCart,
  TrendingUp,
  Users,
  Target,
  BarChart3,
  Zap,
} from "lucide-react";

export default function MarketingSales() {
  return (
    <>
      <Head>
        <title>Marketing & Sales - EventSponsor</title>
        <meta
          name="description"
          content="Comprehensive marketing and sales solutions to drive revenue growth, build customer relationships, and optimize your sales funnel for maximum conversions."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-orange-900 via-orange-800 to-orange-900 text-white py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-8">
                <ShoppingCart className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Marketing & Sales
              </h1>
              <p className="text-xl text-orange-200 max-w-3xl mx-auto mb-8">
                Comprehensive marketing and sales solutions to drive revenue
                growth, build customer relationships, and optimize your sales
                funnel for maximum conversions.
              </p>
              <Button
                size="lg"
                className="bg-orange-600 hover:bg-orange-700"
                onClick={() =>
                  (window.location.href =
                    "/services/request?type=marketing-sales")
                }
              >
                Boost Your Sales
              </Button>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Sales & Marketing Solutions
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Integrated strategies that align marketing efforts with sales
                objectives to drive sustainable business growth.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-slate-50 rounded-2xl p-8">
                <TrendingUp className="w-12 h-12 text-orange-600 mb-6" />
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Sales Funnel Optimization
                </h3>
                <p className="text-slate-600">
                  Design and optimize sales funnels to maximize conversions and
                  reduce customer acquisition costs.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-8">
                <Users className="w-12 h-12 text-orange-600 mb-6" />
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Lead Generation
                </h3>
                <p className="text-slate-600">
                  Generate high-quality leads through strategic campaigns and
                  proven lead magnets.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-8">
                <Target className="w-12 h-12 text-orange-600 mb-6" />
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Sales Training
                </h3>
                <p className="text-slate-600">
                  Equip your sales team with the skills and techniques needed to
                  close more deals effectively.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-8">
                <BarChart3 className="w-12 h-12 text-orange-600 mb-6" />
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  CRM Implementation
                </h3>
                <p className="text-slate-600">
                  Streamline your sales process with customized CRM solutions
                  and automation workflows.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-8">
                <Zap className="w-12 h-12 text-orange-600 mb-6" />
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Marketing Automation
                </h3>
                <p className="text-slate-600">
                  Automate marketing processes to nurture leads and maintain
                  consistent customer engagement.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-8">
                <ShoppingCart className="w-12 h-12 text-orange-600 mb-6" />
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  E-commerce Solutions
                </h3>
                <p className="text-slate-600">
                  Optimize online stores and marketplaces for increased sales
                  and better customer experience.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Strategy Section */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Our Sales Strategy
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                A systematic approach that transforms prospects into loyal
                customers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-6">
                  Lead Qualification
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                    <span className="text-slate-600">
                      Identify and score high-potential prospects
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                    <span className="text-slate-600">
                      Implement lead scoring and nurturing systems
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                    <span className="text-slate-600">
                      Create targeted messaging for different segments
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-6">
                  Conversion Optimization
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                    <span className="text-slate-600">
                      A/B test sales pages and checkout processes
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                    <span className="text-slate-600">
                      Optimize pricing strategies and offers
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                    <span className="text-slate-600">
                      Implement upselling and cross-selling tactics
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Sales Performance
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Our marketing and sales strategies deliver measurable results
                across industries.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center p-6">
                <div className="text-4xl font-bold text-orange-600 mb-4">
                  150%
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Revenue Growth
                </h3>
                <p className="text-slate-600">
                  Average increase in client revenue
                </p>
              </div>

              <div className="text-center p-6">
                <div className="text-4xl font-bold text-orange-600 mb-4">
                  60%
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Conversion Rate
                </h3>
                <p className="text-slate-600">
                  Improvement in sales conversions
                </p>
              </div>

              <div className="text-center p-6">
                <div className="text-4xl font-bold text-orange-600 mb-4">
                  40%
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Cost Reduction
                </h3>
                <p className="text-slate-600">
                  Lower customer acquisition costs
                </p>
              </div>

              <div className="text-center p-6">
                <div className="text-4xl font-bold text-orange-600 mb-4">
                  200+
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Success Stories
                </h3>
                <p className="text-slate-600">Businesses transformed</p>
              </div>
            </div>
          </div>
        </section>

        {/* Tools Section */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Sales Tools & Technologies
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                We leverage cutting-edge tools to maximize your sales potential.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center p-6 bg-white rounded-xl">
                <h3 className="font-semibold text-slate-900">CRM Systems</h3>
              </div>
              <div className="text-center p-6 bg-white rounded-xl">
                <h3 className="font-semibold text-slate-900">
                  Email Automation
                </h3>
              </div>
              <div className="text-center p-6 bg-white rounded-xl">
                <h3 className="font-semibold text-slate-900">
                  Analytics Tools
                </h3>
              </div>
              <div className="text-center p-6 bg-white rounded-xl">
                <h3 className="font-semibold text-slate-900">
                  Sales Intelligence
                </h3>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-orange-900 text-white">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-6">
              Accelerate Your Sales Growth
            </h2>
            <p className="text-xl text-orange-200 mb-8">
              Transform your marketing and sales processes to achieve
              unprecedented growth and build lasting customer relationships.
            </p>
            <Button
              size="lg"
              className="bg-white text-orange-900 hover:bg-orange-50"
              onClick={() =>
                (window.location.href =
                  "/services/request?type=marketing-sales")
              }
            >
              Supercharge Your Sales
            </Button>
          </div>
        </section>
      </Layout>
    </>
  );
}
