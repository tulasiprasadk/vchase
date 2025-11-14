import React from "react";
import { useRouter } from "next/router";
import Layout from "@/components/layout/Layout";
import Head from "next/head";
import dynamic from "next/dynamic";

const SignUpForm = dynamic(() => import("@/components/auth/SignUpForm"), {
  ssr: false,
});

const SignUpPage: React.FC = () => {
  const router = useRouter();
  const { role } = router.query;

  return (
    <>
      <Head>
        <title>Sign Up - EventSponsor</title>
        <meta name="description" content="Create your EventSponsor account" />
      </Head>
      <Layout>
        <SignUpForm selectedRole={role as string} />
      </Layout>
    </>
  );
};

export default SignUpPage;
