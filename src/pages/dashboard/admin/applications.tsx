import React from "react";
import Head from "next/head";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import CareerApplicationsManager from "@/components/careers/CareerApplicationsManager";

const AdminApplicationsPage: React.FC = () => {
  return (
    <ProtectedRoute
      requireAuth={true}
      allowedRoles={["admin", "executive", "super_admin", "supervisor"]}
    >
      <Head>
        <title>Application Management - Admin</title>
      </Head>
      <DashboardLayout title="Application Management">
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-700">
            Job Applications
          </h2>
          <CareerApplicationsManager />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default AdminApplicationsPage;
