import "../styles/globals.css";
import "../styles/markdown.css";
import "highlight.js/styles/github.css";
import type { AppProps } from "next/app";
import Layout from "../components/Layout";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      {/* @ts-ignore*/}
      <Component {...pageProps} />
    </Layout>
  );
}
