import Link from "next/link";
import styles from "./styles.module.css";

const LinkText = ({ children, href }) => {
  return (
    <Link href={href}>
      <a className={styles.linkText}>{children}</a>
    </Link>
  );
};

export default LinkText;
