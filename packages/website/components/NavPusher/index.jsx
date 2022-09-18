import styles from "./styles.module.css";

const NavPusher = ({ children }) => {
  return <div className={styles.navPusher}>{children}</div>;
};

export default NavPusher;
