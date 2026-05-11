import styles from "./page.module.css";

export default function OurWorkPage() {
  return (
    <div className={styles.ourWorkPage}>
      <section className={styles.fadeHeroSection} aria-hidden="true">
        <div className={styles.fadePortrait} />
        <div className={styles.heroTextOverlay}>
          <h1 className={styles.heroMainText}>plant cell genetic protein</h1>
          <p className={styles.heroSubText}>식물 세포 유전자 단백질</p>
          <p className={styles.heroDescription}>
            Plant Cell Gene Protein principle of cloning and recombination of different cell DNA
            <br />
            New cell structure when cell DNA is combined Newly formed cells create
            <br />
            new components in a third structure
            <br />
            <br />
            TONY WANG
            <br />
            <br />
            Research and development to create new DNA for cells
            <br />
            Newly formed cells create new efficacy structures as complex members
            <br />
            Plant cell gene protein recombination technology
            <br />
            <br />
            Skin toxin, aging skin, cosmetic poison. Skin damage caused by percutaneous poison infection.
            <br />
            Skin trouble. Protein research and development for skin tissue restoration
          </p>
        </div>
      </section>
    </div>
  );
}
