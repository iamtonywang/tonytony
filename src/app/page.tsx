import HomeHero from "@/components/sections/HomeHero/HomeHero";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <div className={styles.homePage}>
      <HomeHero />
    </div>
  );
}
