import Logo from "./Logo";
import NavLink from "./NavLink";
import { useRouter } from "next/router";
import Link from "next/link";

const NAV_ITEMS = [
  {
    path: "/docs",
    title: "Docs",
  },
  {
    path: "/playground",
    title: "Playground",
  },
  {
    path: "https://github.com/yeonjuan/html-eslint",
    title: "GitHub",
  },
];

const Header = () => {
  const router = useRouter();

  return (
    <header className="bg-slate-900 text-white flex py-3 pl-3 pr-6 items-center fixed w-full">
      <Link href="/" className="flex flex-row items-center">
        <Logo width="35px" height="35px" />
        <h2>HTML ESLint</h2>
      </Link>
      <nav className="ml-auto">
        <ul className="flex gap-4">
          {NAV_ITEMS.map((item) => (
            <li key={item.path}>
              <NavLink
                href={item.path}
                isActive={item.path === router.pathname}
              >
                {item.title}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
