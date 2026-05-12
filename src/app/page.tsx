import styles from "./page.module.css";
import HomeMotionLine from "@/components/sections/HomeMotionLine/HomeMotionLine";
import HomeImageHero from "@/components/sections/HomeImageHero/HomeImageHero";
import HomeMotionDivider from "@/components/sections/HomeMotionDivider/HomeMotionDivider";

export default function HomePage() {
  return (
    <div className={styles.homePage}>
      <HomeMotionLine />
      <HomeImageHero />
      <HomeMotionDivider />
    </div>
  );
}
