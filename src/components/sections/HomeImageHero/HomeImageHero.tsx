import styles from "./HomeImageHero.module.css";

export default function HomeImageHero() {
  return (
    <section className={styles.heroSection}>
      <div className={styles.heroImage} aria-hidden="true" />
      <div className={styles.heroOverlay}>
        <h2 className={styles.heroSubTitle}>plant cell genetic protein</h2>
        <h2 className={styles.heroKoreanTitle}>식물 세포 유전자 단백질 연구소</h2>

        <h1 className={styles.heroTitle}>TONY WANG</h1>

        <p className={styles.heroDescription}>
          Plant cell gene recombinant protein synthesis technology is the principle of cloning and recombining cell DNA When different cell DNAs are combined, they form a new cell structure Newly formed cells form components in a third structure TONYWANG is working on research and development to create new DNA for cells Newly formed cells develop new efficacy as complex members Bio&apos;s Gene Recombination Technology we team is aging skin, makeup poison, skin damage caused by percutaneou poison infection. Skin trouble. Skin tissue Research and develop proteins for restoration
        </p>

        <p className={styles.heroDescription}>
          식물세포 유전자 재조합 단백질 합성 기술은 세포 DNA를 클로닝 하여 재결합하는 원리
          <br />
          서로 다른 세포 DNA를 결합했을 때 새로운 세포 구조 생성
          <br />
          새롭게 형성된 세포는 제3의 구조화 속에 성분 형성
          <br />
          TONYWANG 세포 DNA를 새롭게 창출하는 연구 개발
          <br />
          새롭게 형성된 세포는 복합 구성체로써 새로운 효능 발생
          <br />
          식물세포 바이오 유전자 재 조합 기술
          <br />
          TONYWANG 독소감염 피부, 화장 독. 경피 독 에 의한 피부 손상.
          <br />
          피부 트러블 .피부 조직 복원을 위한 단백질 연구 개발
        </p>
      </div>
    </section>
  );
}
