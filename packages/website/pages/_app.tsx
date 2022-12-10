import React from "react";
import "../styles/globals.css";
import "../styles/markdown.css";
import "highlight.js/styles/github.css";
import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import Head from "next/head";
import Script from "next/script";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Head>
        <title>HTML ESLint</title>
        <link rel="shortcut icon" href="/html-eslint/favicon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="ESLint plugin for linting HTML. Find and fix problems in your HTML code"
        />
        <meta name="og:title" content="ESLint plugin for linting HTML." />
        <meta
          name="og:description"
          content="Find and fix problems in your HTML code"
        />
        <meta name="twitter:title" content="ESLint plugin for linting HTML." />
        <meta
          name="twitter:description"
          content="Find and fix problems in your HTML code"
        />
        <meta name="color-scheme" content="light only" />
        {/* <Script src="/theme.js">{themeScript}</Script> */}
      </Head>
      {/* @ts-ignore*/}
      <Component {...pageProps} />
    </Layout>
  );
}
