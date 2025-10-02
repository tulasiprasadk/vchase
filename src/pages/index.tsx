import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import Layout from "@/components/layout/Layout";
import Button from "@/components/ui/Button";
import MindBlowingAnimations from "@/components/ui/MindBlowingAnimations";
import {
  useScrollAnimation,
  useStaggeredScrollAnimation,
} from "@/hooks/useScrollAnimation";
import {
  Handshake,
  TrendingUp,
  ArrowRight,
  Star,
  Briefcase,
  Lightbulb,
  User,
  Megaphone,
  Users,
  Phone,
  FileText,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Shield,
  CheckCircle,
} from "lucide-react";

export default function Home() {
  // Scroll animation hooks
  const animationSection = useScrollAnimation();
  const servicesSection = useScrollAnimation();
  const aboutSection = useScrollAnimation();
  const contactSection = useScrollAnimation();
  const mouSection = useScrollAnimation();
  const policySection = useScrollAnimation();
  const ctaSection = useScrollAnimation();
  const successStoriesSection = useScrollAnimation();
  const servicesStagger = useStaggeredScrollAnimation(6, 150);
  const statsStagger = useStaggeredScrollAnimation(8, 100);
  const contactStagger = useStaggeredScrollAnimation(3, 120);
  const mouStagger = useStaggeredScrollAnimation(3, 150);
  const policyStagger = useStaggeredScrollAnimation(4, 200);

  return (
    <>
      <Head>
        <title>V Chase - Chasing Dreams Through Innovation & Growth</title>
        <meta
          name="description"
          content="V Chase helps businesses chase their dreams through innovative marketing & technology solutions, event sponsorship opportunities, and strategic partnerships"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-purple-900 via-blue-800 to-indigo-900 text-white overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="https://img.freepik.com/free-vector/digital-transformation-abstract-background_23-2149125133.jpg"
              alt="Digital transformation background"
              fill
              className="object-cover opacity-10"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-blue-800/90 to-indigo-900/90"></div>
          </div>

          {/* Background decorative elements */}
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-4 h-4 bg-purple-400 rounded-full animate-pulse"></div>
            <div className="absolute top-32 right-20 w-3 h-3 bg-pink-400 rounded-full animate-pulse delay-300"></div>
            <div className="absolute bottom-20 left-32 w-5 h-5 bg-indigo-400 rounded-full animate-pulse delay-700"></div>
            <Star className="absolute top-20 right-32 w-6 h-6 text-purple-400 animate-pulse delay-500" />

            {/* Additional floating elements */}
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-float"></div>
            <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-purple-400 rounded-full animate-float delay-1000"></div>
            <div className="absolute top-1/2 left-1/6 w-1 h-1 bg-pink-400 rounded-full animate-pulse delay-1500"></div>
            <div className="absolute bottom-1/4 right-1/6 w-2 h-2 bg-indigo-400 rounded-full animate-float delay-2000"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
            <div className="text-center">
              <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  Chasing Dreams
                </span>{" "}
                through innovation & growth partnerships
              </h1>
              <p className="text-xl md:text-2xl mb-12 text-slate-300 max-w-4xl mx-auto">
                V Chase empowers businesses to reach their full potential
                through strategic marketing, cutting-edge technology solutions,
                and meaningful event sponsorship opportunities that drive
                sustainable growth
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link href="/auth/signup">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 px-8 py-4 text-lg font-semibold"
                  >
                    Let&apos;s Get Started
                  </Button>
                </Link>
                <Link href="/events">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-slate-300 text-slate-300 hover:bg-slate-300 hover:text-slate-900 px-8 py-4 text-lg"
                  >
                    Browse Events
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Pills Section */}
        <section className="py-24 bg-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              ref={animationSection.elementRef}
              className={`text-center mb-16 scroll-hidden ${
                animationSection.isVisible ? "scroll-visible" : ""
              }`}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                Explore our{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
                  innovative
                </span>{" "}
                solutions
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Experience mind-blowing animations and discover the dynamic
                services that make us a leading marketing & technology company.
                Watch our capabilities come to life with spectacular visual
                effects.
              </p>
            </div>
            <div
              className={`scroll-flip ${
                animationSection.isVisible ? "scroll-visible" : ""
              }`}
            >
              <MindBlowingAnimations />
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-24 bg-white relative">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              ref={servicesSection.elementRef}
              className={`text-center mb-20 scroll-hidden ${
                servicesSection.isVisible ? "scroll-visible" : ""
              }`}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                A plethora of{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
                  solutions
                </span>{" "}
                that leads you to success
              </h2>
            </div>

            <div
              ref={servicesStagger.elementRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {/* Business Consultancy */}
              <div
                className={`group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-slate-100 scroll-stagger ${
                  servicesStagger.visibleItems[0] ? "scroll-visible" : ""
                }`}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Briefcase className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Business Consultancy
                </h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Strategic business consulting that transforms operations and
                  accelerates growth through data-driven insights and proven
                  methodologies.
                </p>
                <Link
                  href="/services/business-consultancy"
                  className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                >
                  See More{" "}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Turn Key Projects */}
              <div
                className={`group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-slate-100 scroll-stagger ${
                  servicesStagger.visibleItems[1] ? "scroll-visible" : ""
                }`}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Lightbulb className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Turn Key Projects
                </h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Complete end-to-end project solutions from conception to
                  delivery, ensuring seamless execution and exceptional results
                  for your business goals.
                </p>
                <Link
                  href="/services/turnkey-projects"
                  className="inline-flex items-center text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
                >
                  See More{" "}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Personal Consultancy */}
              <div
                className={`group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-slate-100 scroll-stagger ${
                  servicesStagger.visibleItems[2] ? "scroll-visible" : ""
                }`}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <User className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Personal Consultancy
                </h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Personalized consulting services tailored to individual needs,
                  helping professionals and entrepreneurs achieve their personal
                  and business objectives.
                </p>
                <Link
                  href="/services/personal-consultancy"
                  className="inline-flex items-center text-purple-600 font-semibold hover:text-purple-700 transition-colors"
                >
                  See More{" "}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Digital Marketing */}
              <div
                className={`group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-slate-100 scroll-stagger ${
                  servicesStagger.visibleItems[3] ? "scroll-visible" : ""
                }`}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Megaphone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Digital Marketing
                </h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Comprehensive digital marketing strategies that amplify your
                  brand presence and drive measurable results across all digital
                  channels.
                </p>
                <Link
                  href="/services/digital-marketing"
                  className="inline-flex items-center text-rose-600 font-semibold hover:text-rose-700 transition-colors"
                >
                  See More{" "}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Marketing & Sales */}
              <div
                className={`group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-slate-100 scroll-stagger ${
                  servicesStagger.visibleItems[4] ? "scroll-visible" : ""
                }`}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Marketing & Sales
                </h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Integrated marketing and sales solutions that create synergy
                  between your brand messaging and revenue generation
                  strategies.
                </p>
                <Link
                  href="/services/marketing-sales"
                  className="inline-flex items-center text-purple-600 font-semibold hover:text-purple-700 transition-colors"
                >
                  See More{" "}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Organiser Sponsor Collaboration */}
              <div
                className={`group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-slate-100 scroll-stagger ${
                  servicesStagger.visibleItems[5] ? "scroll-visible" : ""
                }`}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Handshake className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Organiser Sponsor Collaboration
                </h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Strategic partnership facilitation between event organizers
                  and sponsors, creating mutually beneficial relationships that
                  drive success.
                </p>
                <Link
                  href="/services/organiser-sponsor"
                  className="inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
                >
                  See More{" "}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Client Success Stories */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              ref={successStoriesSection.elementRef}
              className={`text-center mb-20 scroll-hidden ${
                successStoriesSection.isVisible ? "scroll-visible" : ""
              }`}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                Brands we nurtured into{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 italic">
                  inspiring narratives
                </span>
              </h2>
            </div>

            {/* Testimonials */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
              <div className="bg-white rounded-3xl p-8 shadow-xl">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex-shrink-0"></div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">
                      Sarah Johnson
                    </h4>
                    <p className="text-slate-600 mb-4">
                      Event Director, TechConf 2024
                    </p>
                    <p className="text-slate-700 leading-relaxed">
                      &ldquo;V Chase transformed our approach to partnerships.
                      Their platform connected us with sponsors who truly
                      understood our vision, resulting in our most successful
                      event yet with 300% increased sponsorship revenue.&rdquo;
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-xl">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex-shrink-0"></div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">
                      Michael Chen
                    </h4>
                    <p className="text-slate-600 mb-4">CMO, Innovation Corp</p>
                    <p className="text-slate-700 leading-relaxed">
                      &ldquo;The V Chase team proved to be extremely passionate
                      and dedicated. Their business acumen and strategic
                      matching helped us find the perfect events to sponsor,
                      maximizing our brand exposure and ROI.&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Client Logos Marquee */}
            <div className="relative overflow-hidden">
              <div className="flex animate-marquee whitespace-nowrap">
                <div className="flex items-center gap-12 mr-12">
                  {/* Real Client Logos */}
                  <div className="h-20 w-32 flex items-center justify-center p-4 flex-shrink-0">
                    <Image
                      src="/images/clients/client-1.png"
                      alt="Client 1"
                      width={120}
                      height={60}
                      className="object-contain opacity-70 hover:opacity-100 transition-opacity"
                    />
                  </div>
                  <div className="h-20 w-32 flex items-center justify-center p-4 flex-shrink-0">
                    <Image
                      src="/images/clients/client-2.png"
                      alt="Client 2"
                      width={120}
                      height={60}
                      className="object-contain opacity-70 hover:opacity-100 transition-opacity"
                    />
                  </div>
                  <div className="h-20 w-32 flex items-center justify-center p-4 flex-shrink-0">
                    <Image
                      src="/images/clients/client-3.png"
                      alt="Client 3"
                      width={120}
                      height={60}
                      className="object-contain opacity-70 hover:opacity-100 transition-opacity"
                    />
                  </div>
                  <div className="h-20 w-32 flex items-center justify-center p-4 flex-shrink-0">
                    <Image
                      src="/images/clients/client-4.png"
                      alt="Client 4"
                      width={120}
                      height={60}
                      className="object-contain opacity-70 hover:opacity-100 transition-opacity"
                    />
                  </div>
                  <div className="h-20 w-32 flex items-center justify-center p-4 flex-shrink-0">
                    <Image
                      src="/images/clients/client-5.png"
                      alt="Client 5"
                      width={120}
                      height={60}
                      className="object-contain opacity-70 hover:opacity-100 transition-opacity"
                    />
                  </div>
                  <div className="h-20 w-32 flex items-center justify-center p-4 flex-shrink-0">
                    <Image
                      src="/images/clients/client-6.png"
                      alt="Client 6"
                      width={120}
                      height={60}
                      className="object-contain opacity-70 hover:opacity-100 transition-opacity"
                    />
                  </div>
                  <div className="h-20 w-32 flex items-center justify-center p-4 flex-shrink-0">
                    <Image
                      src="/images/clients/client-7.png"
                      alt="Client 7"
                      width={120}
                      height={60}
                      className="object-contain opacity-70 hover:opacity-100 transition-opacity"
                    />
                  </div>
                </div>
                {/* Duplicate for seamless loop */}
                <div className="flex items-center gap-12 mr-12">
                  <div className="h-20 w-32 flex items-center justify-center p-4 flex-shrink-0">
                    <Image
                      src="/images/clients/client-1.png"
                      alt="Client 1"
                      width={120}
                      height={60}
                      className="object-contain opacity-70 hover:opacity-100 transition-opacity"
                    />
                  </div>
                  <div className="h-20 w-32 flex items-center justify-center p-4 flex-shrink-0">
                    <Image
                      src="/images/clients/client-2.png"
                      alt="Client 2"
                      width={120}
                      height={60}
                      className="object-contain opacity-70 hover:opacity-100 transition-opacity"
                    />
                  </div>
                  <div className="h-20 w-32 flex items-center justify-center p-4 flex-shrink-0">
                    <Image
                      src="/images/clients/client-3.png"
                      alt="Client 3"
                      width={120}
                      height={60}
                      className="object-contain opacity-70 hover:opacity-100 transition-opacity"
                    />
                  </div>
                  <div className="h-20 w-32 flex items-center justify-center p-4 flex-shrink-0">
                    <Image
                      src="/images/clients/client-4.png"
                      alt="Client 4"
                      width={120}
                      height={60}
                      className="object-contain opacity-70 hover:opacity-100 transition-opacity"
                    />
                  </div>
                  <div className="h-20 w-32 flex items-center justify-center p-4 flex-shrink-0">
                    <Image
                      src="/images/clients/client-5.png"
                      alt="Client 5"
                      width={120}
                      height={60}
                      className="object-contain opacity-70 hover:opacity-100 transition-opacity"
                    />
                  </div>
                  <div className="h-20 w-32 flex items-center justify-center p-4 flex-shrink-0">
                    <Image
                      src="/images/clients/client-6.png"
                      alt="Client 6"
                      width={120}
                      height={60}
                      className="object-contain opacity-70 hover:opacity-100 transition-opacity"
                    />
                  </div>
                  <div className="h-20 w-32 flex items-center justify-center p-4 flex-shrink-0">
                    <Image
                      src="/images/clients/client-7.png"
                      alt="Client 7"
                      width={120}
                      height={60}
                      className="object-contain opacity-70 hover:opacity-100 transition-opacity"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section id="about-us" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              ref={aboutSection.elementRef}
              className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
            >
              <div
                className={`scroll-slide-left ${
                  aboutSection.isVisible ? "scroll-visible" : ""
                }`}
              >
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8">
                  About{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
                    V Chase
                  </span>
                </h2>
                <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                  V Chase is a premier marketing & technology company founded in
                  2020 with a mission to help businesses chase their dreams
                  through innovative solutions. We are the catalysts of
                  transformation, propelling brands to new heights through our
                  unwavering commitment to excellence and growth.
                </p>
                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                  With a global presence and local expertise, we collaborate
                  with businesses worldwide to craft high-impact strategies,
                  digital experiences, and comprehensive solutions that turn
                  dreams into reality. Our team combines creativity with
                  cutting-edge technology to deliver exceptional results.
                </p>
                <div
                  ref={statsStagger.elementRef}
                  className="grid grid-cols-2 gap-6"
                >
                  <div
                    className={`flex items-center space-x-3 scroll-stagger ${
                      statsStagger.visibleItems[0] ? "scroll-visible" : ""
                    }`}
                  >
                    <Users className="w-6 h-6 text-purple-500" />
                    <span className="text-slate-700 font-semibold">
                      500+ Clients Served
                    </span>
                  </div>
                  <div
                    className={`flex items-center space-x-3 scroll-stagger ${
                      statsStagger.visibleItems[1] ? "scroll-visible" : ""
                    }`}
                  >
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span className="text-slate-700 font-semibold">
                      99% Success Rate
                    </span>
                  </div>
                  <div
                    className={`flex items-center space-x-3 scroll-stagger ${
                      statsStagger.visibleItems[2] ? "scroll-visible" : ""
                    }`}
                  >
                    <MapPin className="w-6 h-6 text-blue-500" />
                    <span className="text-slate-700 font-semibold">
                      Global Presence
                    </span>
                  </div>
                  <div
                    className={`flex items-center space-x-3 scroll-stagger ${
                      statsStagger.visibleItems[3] ? "scroll-visible" : ""
                    }`}
                  >
                    <Clock className="w-6 h-6 text-purple-500" />
                    <span className="text-slate-700 font-semibold">
                      24/7 Support
                    </span>
                  </div>
                </div>
              </div>
              <div
                className={`relative scroll-slide-right ${
                  aboutSection.isVisible ? "scroll-visible" : ""
                }`}
              >
                <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl">
                  <Image
                    src="/images/team.jpg"
                    alt="Our professional team"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-8 left-8 right-8 text-white">
                    <h3 className="text-2xl font-bold mb-2">Our Expert Team</h3>
                    <p className="text-white/90">
                      Passionate professionals dedicated to accelerating your
                      business growth
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Us Section */}
        <section id="contact-us" className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              ref={contactSection.elementRef}
              className={`text-center mb-16 scroll-hidden ${
                contactSection.isVisible ? "scroll-visible" : ""
              }`}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                Contact{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
                  Us
                </span>
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Ready to accelerate your business growth? Get in touch with our
                team of experts and let&apos;s discuss how we can help you
                achieve your goals.
              </p>
            </div>

            <div
              ref={contactStagger.elementRef}
              className="grid grid-cols-1 lg:grid-cols-2 gap-16"
            >
              {/* Contact Information */}
              <div
                className={`space-y-8 scroll-slide-left ${
                  contactStagger.visibleItems[0] ? "scroll-visible" : ""
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      Email Us
                    </h3>
                    <p className="text-slate-600 mb-2">
                      For general inquiries and business opportunities
                    </p>
                    <a
                      href="mailto:hello@vchase.com"
                      className="text-purple-600 hover:text-purple-700 font-semibold"
                    >
                      hello@vchase.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      Call Us
                    </h3>
                    <p className="text-slate-600 mb-2">
                      Speak directly with our consultants
                    </p>
                    <a
                      href="tel:+1234567890"
                      className="text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      +1 (234) 567-8900
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      Visit Us
                    </h3>
                    <p className="text-slate-600 mb-2">
                      Our headquarters location
                    </p>
                    <p className="text-slate-700">
                      123 Business Avenue
                      <br />
                      Tech District, TD 12345
                      <br />
                      Innovation City
                    </p>
                  </div>
                </div>
              </div>

              {/* Chat Widget */}
              <div
                className={`bg-white rounded-2xl p-8 shadow-xl border border-slate-100 scroll-slide-right ${
                  contactStagger.visibleItems[1] ? "scroll-visible" : ""
                }`}
              >
                <div className="flex items-center space-x-3 mb-6">
                  <MessageCircle className="w-6 h-6 text-purple-500" />
                  <h3 className="text-xl font-bold text-slate-900">
                    Quick Message
                  </h3>
                </div>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      placeholder="Your full name"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Service Interest
                    </label>
                    <select className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Business Consultancy</option>
                      <option>Turn Key Projects</option>
                      <option>Personal Consultancy</option>
                      <option>Digital Marketing</option>
                      <option>Marketing & Sales</option>
                      <option>Organiser Sponsor Collaboration</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Message
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Tell us about your project or inquiry..."
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    ></textarea>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Service Policy Section */}
        <section id="service-policy" className="py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              ref={policySection.elementRef}
              className={`text-center mb-16 scroll-hidden ${
                policySection.isVisible ? "scroll-visible" : ""
              }`}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                Service{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
                  Policy
                </span>
              </h2>
              <p className="text-xl text-slate-600">
                Our commitment to excellence and transparency in every
                engagement
              </p>
            </div>

            <div ref={policyStagger.elementRef} className="space-y-8">
              <div
                className={`bg-slate-50 rounded-2xl p-8 scroll-stagger ${
                  policyStagger.visibleItems[0] ? "scroll-visible" : ""
                }`}
              >
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

              <div
                className={`bg-slate-50 rounded-2xl p-8 scroll-stagger ${
                  policyStagger.visibleItems[1] ? "scroll-visible" : ""
                }`}
              >
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

              <div
                className={`bg-slate-50 rounded-2xl p-8 scroll-stagger ${
                  policyStagger.visibleItems[2] ? "scroll-visible" : ""
                }`}
              >
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

              <div
                className={`bg-slate-50 rounded-2xl p-8 scroll-stagger ${
                  policyStagger.visibleItems[3] ? "scroll-visible" : ""
                }`}
              >
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

        {/* MOU Section */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              ref={mouSection.elementRef}
              className={`text-center mb-16 scroll-hidden ${
                mouSection.isVisible ? "scroll-visible" : ""
              }`}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                Memorandum of{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
                  Understanding
                </span>
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Formal agreements tailored for organizers, sponsors, and
                consultation clients to ensure clear expectations and mutual
                success
              </p>
            </div>

            <div
              ref={mouStagger.elementRef}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {/* Organizers MOU */}
              <div
                className={`bg-white rounded-2xl p-8 shadow-xl border border-slate-100 scroll-stagger ${
                  mouStagger.visibleItems[0] ? "scroll-visible" : ""
                }`}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  <Briefcase className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Organizers MOU
                </h3>
                <ul className="space-y-3 text-slate-600 mb-6">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Event planning and execution guidelines</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Sponsorship package development</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Revenue sharing agreements</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Performance metrics and KPIs</span>
                  </li>
                </ul>
                <Link href="/mou/organizers">
                  <Button
                    variant="outline"
                    className="w-full border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white"
                  >
                    Download MOU Template
                  </Button>
                </Link>
              </div>

              {/* Sponsors MOU */}
              <div
                className={`bg-white rounded-2xl p-8 shadow-xl border border-slate-100 ${
                  mouStagger.visibleItems[1]
                    ? "scroll-visible"
                    : "scroll-hidden"
                } transition-all duration-700 ease-out transform`}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6">
                  <Handshake className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Sponsors MOU
                </h3>
                <ul className="space-y-3 text-slate-600 mb-6">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Brand visibility and exposure terms</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Marketing rights and usage guidelines</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>ROI measurement and reporting</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Exclusivity and competition clauses</span>
                  </li>
                </ul>
                <Link href="/mou/sponsors">
                  <Button
                    variant="outline"
                    className="w-full border-green-500 text-green-600 hover:bg-green-500 hover:text-white"
                  >
                    Download MOU Template
                  </Button>
                </Link>
              </div>

              {/* Consultation Clients MOU */}
              <div
                className={`bg-white rounded-2xl p-8 shadow-xl border border-slate-100 scroll-stagger ${
                  mouStagger.visibleItems[2] ? "scroll-visible" : ""
                }`}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                  <User className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Consultation Clients MOU
                </h3>
                <ul className="space-y-3 text-slate-600 mb-6">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Consultation scope and deliverables</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Confidentiality and NDA terms</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Payment schedules and milestones</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Intellectual property agreements</span>
                  </li>
                </ul>
                <Link href="/mou/consultation">
                  <Button
                    variant="outline"
                    className="w-full border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white"
                  >
                    Download MOU Template
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0">
            <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-xl"></div>
            <div className="absolute bottom-10 left-10 w-40 h-40 bg-gradient-to-br from-purple-400/20 to-blue-500/20 rounded-full blur-xl"></div>
          </div>

          <div
            ref={ctaSection.elementRef}
            className={`relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 scroll-fade-scale ${
              ctaSection.isVisible ? "scroll-visible" : ""
            }`}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-8">
              Ready to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                chase your dreams
              </span>{" "}
              to success?
            </h2>
            <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
              Join thousands of event organizers and sponsors who are building
              meaningful partnerships and accelerating their growth with V Chase
              today
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 px-10 py-4 text-lg font-semibold"
                >
                  Let&apos;s Get Started
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-slate-300 text-slate-300 hover:bg-slate-300 hover:text-slate-900 px-10 py-4 text-lg"
                >
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
