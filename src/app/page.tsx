import styles from "./page.module.css";
import HomeMotionLine from "@/components/sections/HomeMotionLine/HomeMotionLine";
import HomeVideoSection from "@/components/sections/HomeVideoSection/HomeVideoSection";
import HomeMotionDivider from "@/components/sections/HomeMotionDivider/HomeMotionDivider";

export default function HomePage() {
  return (
    <div className={styles.homePage}>
      <HomeMotionLine />
      <HomeVideoSection />
      <HomeMotionDivider />
    </div>
  );
}
