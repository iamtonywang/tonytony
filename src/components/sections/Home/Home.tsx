import styles from "./Home.module.css";
import HeroSection from "./HeroSection";
import TextSection from "./TextSection";
import VisualSection from "./VisualSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <div className={styles.homeDividerLine} aria-hidden="true" />
      <TextSection />
      <VisualSection />
    </>
  );
}
