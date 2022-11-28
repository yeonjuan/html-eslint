import type { FC, ReactNode } from "react";
import Link from "next/link";
import classnames from "classnames";

type Props = {
  isActive?: boolean;
  href: string;
  children: ReactNode;
  className?: string;
  activeClassName?: string;
};

const NavLink: FC<Props> = ({
  isActive,
  children,
  href,
  className = "text-slate-400",
  activeClassName = "text-white",
}) => {
  const hoverClassName = `hover:${activeClassName}`;
  return (
    <Link
      href={href}
      className={classnames(
        hoverClassName,
        isActive ? activeClassName : className
      )}
    >
      {children}
    </Link>
  );
};

export default NavLink;
