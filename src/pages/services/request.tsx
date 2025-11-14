import React from "react";
import Head from "next/head";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { useRouter } from "next/router";
import ServiceRequestForm from "@/components/services/ServiceRequestForm";

const ServiceRequestPage: React.FC = () => {
  const router = useRouter();
  const { type } = router.query;

  return (
    <>
      <Head>
        <title>Request a Service - EventSponsor</title>
        <meta name="description" content="Request a service from our network" />
      </Head>

      <ProtectedRoute
        requireAuth={true}
        allowedRoles={["admin", "super_admin", "supervisor", "executive"]}
      >
        <Layout>
          <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
              <Card>
                <CardHeader className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900">
                    Request a Service
                  </h2>
                  <p className="text-gray-600">
                    Fill the form and our team will get back to you.
                  </p>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ServiceRequestForm defaultType={type as string} />
                </CardContent>
              </Card>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    </>
  );
};

export default ServiceRequestPage;
