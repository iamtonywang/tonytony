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

          <div className={styles.copyDividerLine} aria-hidden="true" />

          <p className={styles.heroKoreanDescription}>
            식물세포 유전자 재조합 단백질 <br />
            각기 다른 세포 DNA를 클로닝 하여 재결합하는 원리 <br />
            세포 DNA를 결합했을 때 새로운 세포 구조 형셩 <br />
            새롭게 형성된 세포는 제3의 구조화 속에 새로운 성분 생성 <br />
            TONY WANG <br />
            세포의 DNA를 새롭게 창출하는 연구 개발 <br />
            새롭게 형성된 세포는 복합 구성체로써 새로운 효능 구조 생성 <br />
            식물세포 유전자 단백질 재 조합 기술 <br />
            피부 독소, 노화피부, 화장 독. 경피 독 감염에 의한 피부 손상. <br />
            피부 트러블. 피부 조직 복원 목적 단백질 연구 개발
          </p>

          <div className={styles.pcOverlayProcessLine} aria-hidden="true" />
        </div>
      </section>

      <section className={styles.mobileKoreanSection}>
        <div className={styles.mobileDividerLine} aria-hidden="true" />
        <p className={styles.mobileKoreanDescription}>
          식물세포 유전자 재조합 단백질 <br />
          각기 다른 세포 DNA를 클로닝 하여 재결합하는 원리 <br />
          세포 DNA를 결합했을 때 새로운 세포 구조 형셩 <br />
          <span className={styles.pcOnly}>새롭게 형성된 세포는 제3의 구조화 속에 새로운 성분 생성</span>
          <span className={styles.mobileOnly}>
            새롭게 형성된 세포는 제3의 구조화 속에
            <br />
            새로운 성분 생성
          </span>
          <br />
          TONY WANG <br />
          세포의 DNA를 새롭게 창출하는 연구 개발 <br />
          <span className={styles.pcOnly}>새롭게 형성된 세포는 복합 구성체로써 새로운 효능 구조 생성</span>
          <span className={styles.mobileOnly}>
            새롭게 형성된 세포는 복합 구성체로써
            <br />
            새로운 효능 구조 생성
          </span>
          <br />
          식물세포 유전자 단백질 재 조합 기술 <br />
          <span className={styles.pcOnly}>피부 독소, 노화피부, 화장 독. 경피 독 감염에 의한 피부 손상.</span>
          <span className={styles.mobileOnly}>
            피부 독소, 노화피부, 화장 독. 경피 독
            <br />
            감염에 의한 피부 손상.
          </span>
          <br />
          피부 트러블. 피부 조직 복원 목적 단백질 연구 개발
        </p>
      </section>

      <section className={styles.bioProcessSection} aria-label="생명공학 DNA 공정">
        <div className={styles.bioProcessCaption}>
          <p>식물세포 유전자 재 조합 단백질 합성 연구</p>
          <p>세포 DNA 클로닝 유전자 단백질 생성</p>
        </div>

        <div className={styles.bioProcessTrack}>
          <div className={styles.bioProcessLine} aria-hidden="true" />

          <div className={styles.bioProcessNodes}>
            <div className={styles.bioNode}>
              <span className={styles.bioDot} />
              <p>식물 세포 정제</p>
            </div>

            <div className={styles.bioNode}>
              <span className={styles.bioDot} />
              <p>Protein 추출</p>
            </div>

            <div className={styles.bioNode}>
              <span className={`${styles.bioDot} ${styles.bioAccentDot}`} />
              <p>cloning 분리</p>
            </div>

            <div className={styles.bioNode}>
              <span className={`${styles.bioDot} ${styles.bioAccentDot}`} />
              <p>제3세포 주입</p>
            </div>

            <div className={styles.bioNode}>
              <span className={styles.bioDot} />
              <p>단백질 재조합</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
