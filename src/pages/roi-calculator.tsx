import React from "react";
import Head from "next/head";
import Layout from "@/components/layout/Layout";
import SponsorshipROICalculator from "@/components/SponsorshipROICalculator";

const ROICalculatorPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>ISWPL Sponsorship ROI Calculator - VChase</title>
        <meta
          name="description"
          content="Calculate the return on investment for your ISWPL sponsorship in INR"
        />
      </Head>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              ISWPL Sponsorship ROI Calculator
            </h1>
            <p className="text-lg text-gray-600">
              Calculate the return on investment for your sponsorship in Indian
              Rupees (INR)
            </p>
          </div>
          <SponsorshipROICalculator />
        </div>
      </Layout>
    </>
  );
};

export default ROICalculatorPage;
