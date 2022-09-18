import LinkButton from "../components/LinkButton";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>HTML ESLint</h2>
      <span className={styles.description}>ESLint plugin for HTML</span>
      <div className={styles.buttonsContainer}>
        <div className={styles.buttonContainer}>
          <LinkButton href="/playground">PLAYGROUND</LinkButton>
        </div>
        <div className={styles.buttonContainer}>
          <LinkButton href="/docs/getting-started">Getting Started</LinkButton>
        </div>
        <div className={styles.buttonContainer}>
          <LinkButton href="/docs">GITHUB</LinkButton>
        </div>
      </div>
    </div>
  );
}
