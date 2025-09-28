import React from "react";
import SignUpForm from "@/components/auth/SignUpForm";
import Layout from "@/components/layout/Layout";
import Head from "next/head";

const SignUpPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Sign Up - EventSponsor</title>
        <meta name="description" content="Create your EventSponsor account" />
      </Head>
      <Layout>
        <SignUpForm />
      </Layout>
    </>
  );
};

export default SignUpPage;
