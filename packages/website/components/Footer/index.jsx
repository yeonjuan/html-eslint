import LinkText from "../LinkText";
import styles from "./styles.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <section className={styles.sitemap}>
        <div>
          <h5>Docs</h5>
          <LinkText href="/docs/getting-started">Getting Started</LinkText>
          <LinkText href="/docs/all-rules">All Rules</LinkText>
          <LinkText href="/playground">Playground</LinkText>
        </div>
        <div>
          <h5>More</h5>
          <LinkText href="https://github.com/yeonjuan/html-eslint">
            Github
          </LinkText>
        </div>
      </section>
    </footer>
  );
};

export default Footer;
