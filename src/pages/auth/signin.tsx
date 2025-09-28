import React from "react";
import { NextPage } from "next";
import Head from "next/head";
import SignInForm from "@/components/auth/SignInForm";

const SignInPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Sign In | EventSponsor</title>
        <meta
          name="description"
          content="Sign in to your EventSponsor account"
        />
      </Head>
      <SignInForm />
    </>
  );
};

export default SignInPage;
