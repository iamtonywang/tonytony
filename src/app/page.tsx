import styles from "./page.module.css";
import HomeImageHero from "@/components/sections/HomeImageHero/HomeImageHero";

export default function HomePage() {
  return (
    <div className={styles.homePage}>
      <HomeImageHero />
    </div>
  );
}
