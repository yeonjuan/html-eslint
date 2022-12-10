import React from "react";
import { FC, ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

type Props = {
  children: ReactNode;
};

const Layout: FC<Props> = ({ children }) => {
  return (
    <div className="min-h-[100%]">
      <Header />
      <main
        className="pt-[60px] md:px-8"
        style={{ minHeight: "calc(100vh - 132px)" }}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
