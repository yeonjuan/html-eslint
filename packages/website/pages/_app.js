import "../styles/globals.css";
import Header from "../components/Header";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>HTML ESLint</title>
        <meta name="description" content="ESLint plugin for HTML" />
        <meta name="keywords" content="HTML ESLint,HTML Linter,ESLint plugin" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
