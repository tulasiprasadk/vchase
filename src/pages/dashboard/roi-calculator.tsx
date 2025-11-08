import React from "react";
import Head from "next/head";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import SponsorshipROICalculator from "@/components/SponsorshipROICalculator";

const DashboardROICalculator: React.FC = () => {
  return (
    <ProtectedRoute
      requireAuth={true}
      allowedRoles={["organizer", "sponsor", "admin", "super_admin"]}
    >
      <Head>
        <title>ROI Calculator - Dashboard</title>
      </Head>

      <DashboardLayout title="ROI Calculator">
        <div className="py-6">
          <SponsorshipROICalculator title="ROI Calculator" />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default DashboardROICalculator;
