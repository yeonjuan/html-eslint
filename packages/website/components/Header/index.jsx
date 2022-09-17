import Link from "next/link";
import styles from "./styles.module.css";
import LogoImg from "../../public/logo.svg";

const Header = () => {
  return (
    <div className={styles.headerContainer}>
      <div>
        <header className={styles.header}>
          <Link href="/">
            <a>
              <img className={styles.log} alt="" src={LogoImg.src} />
              <h2 className={styles.titleWithLogo}>HTML ESLint</h2>
            </a>
          </Link>
          <div className={styles.navContainer}>
            <nav className={styles.nav}>
              <ul className={styles.navList}>
                <li>
                  <Link href="/docs">Docs</Link>
                </li>
                <li>
                  <Link href="https://github.com/yeonjuan/html-eslint">
                    Github
                  </Link>
                </li>
                <li>
                  <Link href="/playground">Playground</Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>
      </div>
    </div>
  );
};

export default Header;
