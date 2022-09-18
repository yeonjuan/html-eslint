import "../styles/globals.css";
import Header from "../components/Header";
import Head from "next/head";
import Footer from "../components/Footer";
import NavPusher from "../components/NavPusher";

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
      <NavPusher>
        <Component {...pageProps} />
        <Footer />
      </NavPusher>
    </>
  );
}

export default MyApp;
