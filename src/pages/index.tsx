import Head from "next/head";
import Link from "next/link";
import Layout from "@/components/layout/Layout";
import Button from "@/components/ui/Button";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";

export default function Home() {
  return (
    <>
      <Head>
        <title>EventSponsor - Connect Events with Sponsors</title>
        <meta
          name="description"
          content="The premier platform connecting event organizers with sponsors"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Connect Events with Sponsors
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100">
                The premier platform for event organizers and sponsors to find
                each other
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/signup">
                  <Button
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-gray-100"
                  >
                    Get Started
                  </Button>
                </Link>
                <Link href="/events">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-blue-600"
                  >
                    Browse Events
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                How EventSponsor Works
              </h2>
              <p className="text-xl text-gray-600">
                Simple, effective, and results-driven
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📅</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Create Your Event
                  </h3>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">
                    Event organizers can easily create detailed event listings
                    with sponsorship packages and requirements.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🤝</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Connect & Match
                  </h3>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">
                    Our platform intelligently matches events with relevant
                    sponsors based on industry, budget, and preferences.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🚀</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Grow Together
                  </h3>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">
                    Build lasting partnerships that benefit both events and
                    sponsors, creating value for everyone involved.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of event organizers and sponsors who trust
              EventSponsor
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg">Create Account</Button>
              </Link>
              <Link href="/auth/signin">
                <Button size="lg" variant="outline">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
