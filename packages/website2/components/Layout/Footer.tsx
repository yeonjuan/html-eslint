import { FC, ReactNode } from "react";
import NavLink from "./NavLink";

const FooterLink = (props: { href: string; children: ReactNode }) => {
  return (
    <NavLink href={props.href} className="text-xs">
      {props.children}
    </NavLink>
  );
};

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-4 px-16">
      <section className="flex justify-between my-4">
        <div className="flex-1">
          <h5 className="text-white text-sm">Docs</h5>
          <div className="pl-1">
            <FooterLink href="/docs/getting-started">
              Getting Started
            </FooterLink>
          </div>
        </div>
        <div className="flex-1">
          <h5 className="text-white text-sm">Playground</h5>
          <div className="pl-1">
            <FooterLink href="/docs/getting-started">Playground</FooterLink>
          </div>
        </div>
        <div className="flex-1">
          <h5 className="text-white text-sm">More</h5>
          <div className="pl-1">
            <FooterLink href="/docs/getting-started">GitHub</FooterLink>
          </div>
        </div>
      </section>
    </footer>
  );
};

export default Footer;
