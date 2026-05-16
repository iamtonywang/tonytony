import styles from "./page.module.css";

export default function OurWorkPage() {
  return (
    <div className={styles.ourWorkPage}>
      <section className={styles.ourWorkLandingSection} aria-label="OurWork 랜딩">
        <div className={styles.ourWorkLandingMotionLine} aria-hidden="true" />

        <div className={styles.ourWorkLandingCopy}>
          <h1 className={styles.ourWorkLandingHeroTitle}>TONY WANG</h1>

          <h3 className={styles.ourWorkLandingSubTitle}>plant cell genetic protein</h3>

          <h2 className={styles.ourWorkLandingKoreanTitle}>식물 세포 유전자 단백질 연구</h2>

          <div className={styles.ourWorkLandingDescription}>
            <p>What we prove in the lab becomes the structure your skin can trust.</p>
            <p>
              Cloning and recombination across different cell DNA, the third structure where new cells
              <br />
              assemble new efficacy — documented step by step.
            </p>
            <p>Precisely regulate skin cell signal transmission and activate ECM reconstruction</p>
          </div>

          <div className={styles.ourWorkLandingMidLine} aria-hidden="true" />

          <div className={styles.ourWorkLandingEnding}>
            <h2 className={styles.ourWorkLandingEndingTitle}>TONY WANG</h2>

            <p className={styles.ourWorkLandingEndingText}>
              I thought about it and made up my mind
            </p>

            <div className={styles.ourWorkLandingEndingLine} aria-hidden="true" />
          </div>
        </div>
      </section>

      <section className={styles.editorialIntroSection} aria-label="OurWork editorial body">
        <div className={styles.editorialIntroInner}>
          <div className={styles.editorialIntroVisualWrap}>
          <img
            src="/landing-assets/ourwork-editorial-droplet-03.webp"
            alt=""
            className={styles.editorialIntroVisual}
            loading="lazy"
            decoding="async"
            draggable={false}
          />
          </div>

          <div className={styles.editorialIntroCopy}>
            <p className={`${styles.editorialIntroKicker} ${styles.elMessiriText}`}>
              Global first No1
            </p>
            <h2 className={styles.editorialIntroHeadline}>plant cell genetic protein</h2>
          <p className={styles.editorialIntroKorean}>식물 세포 유전자 단백질</p>
          <div className={styles.editorialIntroHairline} aria-hidden />
          <div className={styles.editorialIntroDescription}>
            <p className={styles.elMessiriText}>
              Plant Cell Gene Protein principle of cloning and recombination of different cell DNA
            </p>
            <p className={styles.elMessiriText}>New cell structure when cell DNA is combined</p>
            <p className={styles.elMessiriText}>
              Newly formed cells create new components in a third structure
            </p>
          </div>
          </div>
        </div>
      </section>

      <section className={styles.bioProcessSection} aria-label="생명공학 DNA 공정">
        <div className={styles.bioProcessCaption}>
          <p>식물세포 유전자 재 조합 단백질 합성 연구</p>
          <p>세포 DNA 클로닝 유전자 단백질 생성</p>
        </div>

        <div className={styles.bioProcessTrack}>
          <div className={styles.bioProcessNodes}>
            <div className={`${styles.bioCapsule} ${styles.greenCapsule}`}>
              <span>식물 세포 정제</span>
            </div>

            <div className={`${styles.bioCapsule} ${styles.yellowCapsule}`}>
              <span>Protein 추출</span>
            </div>

            <div className={`${styles.bioCapsule} ${styles.whiteCapsule}`}>
              <span>cloning 분리</span>
            </div>

            <div className={`${styles.bioCapsule} ${styles.orangeCapsule}`}>
              <span>제3세포 주입</span>
            </div>

            <div className={`${styles.bioCapsule} ${styles.blueCapsule}`}>
              <span>단백질 재조합</span>
            </div>

            <div className={`${styles.bioCapsule} ${styles.greenCapsule}`}>
              <span>NEW 단백질</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.mobileKoreanSection} aria-hidden="true">
        <div className={styles.mobileProcessCaptionNearLine}>
          <p>식물세포 유전자 재 조합 단백질 합성 연구</p>
          <p>세포 DNA 클로닝 유전자 단백질 생성</p>
        </div>
      </section>

      <div className={styles.processQuoteBlock}>
        <div className={styles.processQuoteLine} aria-hidden="true" />

        <p className={styles.processQuoteText}>
          <span className={styles.pcOnly}>
            {"I'll show you the reality, not a dream the greatness of Tony Wang"}
          </span>
          <span className={styles.mobileOnly}>
            {"I'll show you the reality,"}
            <br />
            not a dream the greatness of Tony Wang
          </span>
        </p>

        <p className={styles.processQuoteText}>It starts in May, 2026</p>

        <div className={styles.processQuoteLine} aria-hidden="true" />
      </div>
    </div>
  );
}
