import styles from "./page.module.css";

export default function HomePage() {
  return (
    <div className={styles.homePage}>
      <div className={styles.hairline} aria-hidden />
      <section className={styles.brandSection} aria-label="Brand copy">
        <p className={styles.brandName}>TONYWANG</p>
        <p className={styles.brandCopy}>plant cell genetic protein</p>
        <p className={styles.brandCopyKo}>식물 세포 유전자 단백질 연구소</p>
        <p className={styles.brandCopy}>What is creation?</p>
        <p className={styles.brandCopy}>
          I made something that didn&apos;t exist in the world
          <br />
          I came to the world to change my skin
        </p>
        <p className={styles.brandCopy}>
          Precisely regulate skin cell signal transmission and activate ECM reconstruction
        </p>
        <p className={styles.brandCopyLead}>NIGAJUN</p>
        <p className={styles.brandCopy}>I thought about it and made up my mind</p>
      </section>
      <div className={styles.hairline} aria-hidden />
    </div>
  );
}
