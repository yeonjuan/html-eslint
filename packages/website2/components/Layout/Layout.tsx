import { FC, ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

const Layout: FC = ({ children }) => {
  return (
    <div className="min-h-[100%]">
      <Header />
      <main className="pt-[60px] min-h-[100vh] px-8">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
