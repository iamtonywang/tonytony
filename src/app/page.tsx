import styles from "./page.module.css";
import HomeImageHero from "@/components/sections/HomeImageHero/HomeImageHero";
import HomeMotionDivider from "@/components/sections/HomeMotionDivider/HomeMotionDivider";

export default function HomePage() {
  return (
    <div className={styles.homePage}>
      <HomeImageHero />
      <HomeMotionDivider />
    </div>
  );
}
