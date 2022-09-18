import Link from "next/link";
import styles from "./styles.module.css";

const LinkButton = ({ href, children }) => {
  return (
    <Link href={href}>
      <a className={styles.button}>{children}</a>
    </Link>
  );
};

export default LinkButton;
