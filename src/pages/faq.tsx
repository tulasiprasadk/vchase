import Head from "next/head";
import Layout from "@/components/layout/Layout";
import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string | JSX.Element;
}

const faqs: FAQItem[] = [
  {
    question: "What is VChase?",
    answer:
      "VChase is an innovative sponsorship and brand-collaboration platform that connects creators, events, and businesses with verified sponsors. It helps brands gain visibility while helping creators monetize through partnerships.",
  },
  {
    question: "How does VChase work?",
    answer:
      "Users can submit their event, campaign, or brand requirement. VChase matches you with suitable sponsors or creators based on industry, audience, and budget.",
  },
  {
    question: "Who can use VChase?",
    answer: (
      <ul className="list-disc list-inside space-y-1 mt-2">
        <li>Event organizers</li>
        <li>Influencers & content creators</li>
        <li>Brands looking for promotion</li>
        <li>Startups seeking collaborations</li>
        <li>Agencies handling marketing campaigns</li>
      </ul>
    ),
  },
  {
    question: "Is VChase free to start?",
    answer:
      "Yes. Basic listing and initial sponsor matching are free. Premium or managed services may have additional fees.",
  },
  {
    question: "How long does sponsor matching take?",
    answer:
      "Typically 1-15 days, depending on the category and demand. High-value or niche campaigns may take longer.",
  },
  {
    question: "What types of sponsorships are available?",
    answer: (
      <ul className="list-disc list-inside space-y-1 mt-2">
        <li>Cash sponsorships</li>
        <li>Product sponsorships</li>
        <li>Coupon/offer partnerships</li>
        <li>Cross-promotions</li>
        <li>Influencer shoutouts</li>
        <li>Event branding</li>
      </ul>
    ),
  },
  {
    question: "Does VChase verify sponsors and creators?",
    answer: (
      <div>
        Yes. VChase performs screening for:
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>Authenticity</li>
          <li>Industry relevance</li>
          <li>Previous partnership history</li>
          <li>Audience quality (for creators)</li>
        </ul>
      </div>
    ),
  },
  {
    question: "Can brands promote through VChase visuals and creatives?",
    answer:
      "Yes. VChase provides professional promotional designs, videos, and branding kits for campaigns.",
  },
  {
    question: "Do I need a large following to get sponsors?",
    answer:
      "Not necessarily. Micro-influencers and niche creators often receive targeted sponsorships.",
  },
  {
    question: "Can I track my sponsorship status?",
    answer: (
      <div>
        Yes. VChase provides transparent progress updates, including:
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>Review status</li>
          <li>Matching progress</li>
          <li>Sponsor interest</li>
          <li>Final confirmation</li>
        </ul>
      </div>
    ),
  },
  {
    question: "What industries does VChase support?",
    answer: (
      <div>
        Almost all major categories:
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>Tech</li>
          <li>Fashion</li>
          <li>Education</li>
          <li>Food & Beverage</li>
          <li>Events & festivals</li>
          <li>Healthcare</li>
          <li>Fitness</li>
          <li>Entertainment</li>
        </ul>
      </div>
    ),
  },
  {
    question: "How do I contact VChase support?",
    answer: (
      <div>
        You can reach support via:
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>Email</li>
          <li>WhatsApp</li>
          <li>Website chat module</li>
        </ul>
      </div>
    ),
  },
  {
    question: "Does VChase offer marketing or content creation services?",
    answer:
      "Yes. Branding design, video creation, promotional kits, and ad optimization services are available.",
  },
  {
    question: "Can sponsors promote their campaigns through VChase?",
    answer:
      "Absolutely. Brands can run promotional campaigns, list sponsorship opportunities, and collaborate with multiple creators.",
  },
  {
    question: "How safe is my data?",
    answer:
      "VChase follows strict privacy and data protection protocols. Personal and campaign data is secured and used only for sponsor matching.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <Head>
        <title>Frequently Asked Questions (FAQs) - VChase</title>
        <meta
          name="description"
          content="Find answers to common questions about VChase platform, sponsorship opportunities, and how to get started"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <section className="py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center mb-6">
                <HelpCircle className="w-16 h-16 text-purple-500" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                Frequently Asked{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
                  Questions
                </span>
              </h1>
              <p className="text-xl text-slate-600">
                Find answers to common questions about VChase platform
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                  <div
                    key={index}
                    className={`rounded-2xl overflow-hidden border transition-colors ${
                      isOpen
                        ? "border-purple-500 bg-purple-50/40"
                        : "border-slate-200 bg-slate-50 hover:border-purple-300"
                    }`}
                  >
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full px-6 py-5 text-left flex items-center justify-between focus:outline-none"
                      aria-expanded={isOpen}
                    >
                    <span className="text-lg font-semibold text-slate-900 pr-4">
                      {faq.question}
                    </span>
                      {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-purple-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    )}
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-5">
                        <div className="text-slate-600 leading-relaxed border-t border-slate-200 pt-4">
                          {faq.answer}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-12 text-center bg-purple-50 rounded-2xl p-8 border border-purple-100">
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Still have questions?
              </h3>
              <p className="text-slate-600 mb-4">
                Can&apos;t find the answer you&apos;re looking for? Please reach
                out to our friendly team.
              </p>
              <a
                href="/#contact-us"
                className="inline-block text-purple-600 font-semibold hover:text-purple-700 transition-colors"
              >
                Contact Us →
              </a>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}

