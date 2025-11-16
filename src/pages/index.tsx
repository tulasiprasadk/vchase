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
  TrendingUp,
  ArrowRight,
  Star,
  Briefcase,
  Lightbulb,
  User,
  Megaphone,
  Users,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle,
} from "lucide-react";
import ChatbotWidget from "@/components/ui/ChatbotWidget";
import AdPlaceholder from "@/components/ui/AdPlaceholder";

export default function Home() {
  // Scroll animation hooks
  const animationSection = useScrollAnimation();
  const servicesSection = useScrollAnimation();
  const aboutSection = useScrollAnimation();
  const contactSection = useScrollAnimation();
  const ctaSection = useScrollAnimation();
  const successStoriesSection = useScrollAnimation();
  const servicesStagger = useStaggeredScrollAnimation(6, 150);
  const statsStagger = useStaggeredScrollAnimation(8, 100);
  const contactStagger = useStaggeredScrollAnimation(3, 120);
  const clientLogos = Array.from({ length: 8 }, (_, index) => index + 1);
  const topBrandSlots = [
    { label: "Featured", image: "/images/clients/client-1.png" },
    { label: "Leaderboard", image: "/images/clients/client-2.png" },
    { label: "Sidebar", image: "/images/clients/client-3.png" },
    { label: "Mobile", image: "/images/clients/client-7.png" },
  ];

  return (
    <>
      <Head>
        <title>VChase - Chasing Dreams Through Innovation & Growth</title>
        <meta
          name="description"
          content="VChase helps businesses chase their dreams through innovative marketing & technology solutions, event sponsorship opportunities, and strategic partnerships"
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
                VChase empowers businesses to reach their full potential through
                strategic marketing, cutting-edge technology solutions, and
                meaningful event sponsorship opportunities that drive
                sustainable growth
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link href="/auth/role-selection">
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
            {/* Subtle sponsor placements removed from hero and added inline in sections for flow */}
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
              {/* Inline sponsor logo placement */}
              <div className="hidden lg:flex lg:col-span-1 items-stretch">
                <div className="w-full bg-white rounded-2xl p-8 shadow-lg border border-slate-100 flex flex-col items-center justify-center gap-4">
                  <p className="text-lg font-semibold text-slate-900">Sponsor</p>
                  <Image
                    src="/images/logo.png"
                    alt="VChase Logo"
                    width={220}
                    height={220}
                    className="w-auto h-32 object-contain"
                  />
                </div>
              </div>
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

              {/* Organiser Sponsor Collaboration removed per request */}
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
                      Gautham
                    </h4>
                    <p className="text-slate-600 mb-4">Marketing Director</p>
                    <p className="text-slate-700 leading-relaxed">
                      &ldquo;Our partnership through this platform doubled our
                      brand visibility at the Expo. The targeted audience
                      alignment delivered measurable results that exceeded our
                      projections.&rdquo;
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-xl">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex-shrink-0"></div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">
                      Rajesh D N
                    </h4>
                    <p className="text-slate-600 mb-4">
                      Event Director, Ichase Fitness
                    </p>
                    <p className="text-slate-700 leading-relaxed">
                      &ldquo;The platform&rsquo;s intelligent matchmaking saved us
                      months of cold outreach and negotiation. We connected with
                      sponsors who genuinely understood our event&rsquo;s mission and
                      audience.&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Client Logos Marquee */}
            <div className="relative overflow-hidden marquee-track">
              <div className="flex animate-marquee whitespace-nowrap">
                {[0, 1].map((cycle) => (
                  <div
                    key={`client-logo-cycle-${cycle}`}
                    className="flex items-center gap-12"
                  >
                    {clientLogos.map((logo) => (
                      <div
                        key={`client-logo-${cycle}-${logo}`}
                        className="h-24 w-44 flex items-center justify-center p-3 flex-shrink-0"
                      >
                        <Image
                          src={`/images/clients/client-${logo}.png`}
                          alt={`Client ${logo}`}
                          width={150}
                          height={75}
                          className="object-contain opacity-70 hover:opacity-100 transition-opacity"
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Advertisement Section */}
        <section id="advertisement" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                Top Brands
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Top Brands sections — promote your brand in strategic locations
                across our platform.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {topBrandSlots.map((slot) => (
                <div
                  key={slot.label}
                  className="flex items-center justify-center border border-dashed border-slate-300 bg-white rounded-xl p-6"
                >
                  <Image
                    src={slot.image}
                    alt={`${slot.label} sponsor logo`}
                    width={180}
                    height={80}
                    className="object-contain w-auto max-h-20"
                  />
                </div>
              ))}
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
              className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
            >
              {/* Email */}
              <div
                className={`h-48 bg-white rounded-2xl p-6 shadow scroll-slide-up ${
                  contactStagger.visibleItems[0] ? "scroll-visible" : ""
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">
                      Email Us
                    </h3>
                    <p className="text-slate-600 mb-2">For general inquiries</p>
                    <a
                      href="mailto:hello@vchase.com"
                      className="text-purple-600 font-semibold"
                    >
                      hello@vchase.in
                    </a>
                  </div>
                </div>
              </div>

              {/* Call */}
              <div
                className={`h-48 bg-white rounded-2xl p-6 shadow scroll-slide-up ${
                  contactStagger.visibleItems[1] ? "scroll-visible" : ""
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">
                      Call Us
                    </h3>
                    <p className="text-slate-600 mb-2">
                      Speak with our consultants
                    </p>
                    <a
                      href="tel:+1234567890"
                      className="text-blue-600 font-semibold"
                    >
                      +91 9900993926
                    </a>
                  </div>
                </div>
              </div>

              {/* Visit */}
              <div
                className={`h-48 bg-white rounded-2xl p-6 shadow scroll-slide-up ${
                  contactStagger.visibleItems[2] ? "scroll-visible" : ""
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">
                      Visit Us
                    </h3>
                    <p className="text-slate-600 mb-2">Headquarters</p>
                    <p className="text-slate-700">
                      Bengaluru, Karnataka, INDIA
                    </p>
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
                    VChase
                  </span>
                </h2>
                <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                  VChase is a premier marketing & technology company founded in
                  2017 with a mission to help businesses chase their dreams
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
              meaningful partnerships and accelerating their growth with VChase
              today
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/auth/role-selection">
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
      <ChatbotWidget />
    </>
  );
}
