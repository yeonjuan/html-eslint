import type { FC, ReactNode } from "react";
import Link from "next/link";
import classnames from "classnames";

type Props = {
  isActive: boolean;
  href: string;
  children: ReactNode;
};

const NavLink: FC<Props> = ({ isActive, children, href }) => {
  return (
    <Link
      href={href}
      className={classnames(
        "hover:text-white",
        isActive ? "text-white" : "text-slate-400"
      )}
    >
      {children}
    </Link>
  );
};

export default NavLink;
