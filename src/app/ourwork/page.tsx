import styles from "./page.module.css";

const DROPLET_PROCESS_STEPS = [
  "DNA Cloning",
  "Cell Binding",
  "Protein Structuring",
  "Recombination",
  "New Material",
] as const;

const DROPLET_STEP_DURATION_S = 4.5;
const DROPLET_CYCLE_DURATION_S = DROPLET_STEP_DURATION_S * DROPLET_PROCESS_STEPS.length;

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

      <section className={styles.ourWorkBioFounderVisual} aria-label="OurWork stone hero visual">
        <div className={styles.ourWorkBioFounderVisualWrap}>
          <img
            src="/landing-assets/why-note-break-visual-01.jpg"
            alt=""
            className={styles.ourWorkBioFounderVisualImage}
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        </div>
      </section>

      <section
        className={styles.ourWorkDnaEditorialSection}
        aria-label="세포 DNA 재조합 연구 개발"
      >
        <div className={styles.ourWorkDnaEditorialInner}>
          <h2 className={styles.ourWorkDnaEditorialTitle}>
            세포 DNA 클로닝 후 세포 재 조합 연구 개발
          </h2>
          <div className={styles.ourWorkDnaEditorialBody}>
            <div className={styles.ourWorkDnaEditorialBodyDesktop}>
              <p className={styles.ourWorkDnaEditorialBodyPara}>
                식물 세포 유전자 재 조합 단백질 세포 간 DNA 결합 변이 세포 연구 변이 세포 물질 변환 과정 후 신규 성분 연구
              </p>
              <p className={styles.ourWorkDnaEditorialBodyPara}>
                세포 DNA 형질 전환 변이 세포 생성 후 효능 구조 연구 신규 변이 세포 복합 구성 체 효능 연구 개발
              </p>
            </div>
            <div className={styles.ourWorkDnaEditorialBodyMobile}>
              <p className={styles.ourWorkDnaEditorialBodyPara}>
                식물 세포 유전자 재 조합 단백질
              </p>
              <p className={styles.ourWorkDnaEditorialBodyPara}>
                세포 간 DNA 결합 변이 세포 연구
              </p>
              <p className={styles.ourWorkDnaEditorialBodyPara}>
                변이 세포 물질 변환 과정 후 신규 성분 연구
              </p>
              <p className={styles.ourWorkDnaEditorialBodyPara}>
                세포 DNA 형질 전환 변이 세포 생성 후 효능 구조 연구
              </p>
              <p className={styles.ourWorkDnaEditorialBodyPara}>
                신규 변이 세포 복합 구성 체 효능 연구 개발
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        className={styles.ourWorkVialArchiveSection}
        aria-label="식물세포 유전자 단백질 재조합 연구"
      >
        <div className={styles.ourWorkVialArchiveInner}>
          <div className={styles.ourWorkVialArchiveHairline} aria-hidden />

          <div className={styles.ourWorkVialArchiveVisual}>
            <img
              src="/landing-assets/ourwork-editorial-vial-01.jpg"
              alt=""
              className={styles.ourWorkVialArchiveVisualImage}
              loading="lazy"
              decoding="async"
              draggable={false}
            />
          </div>

          <h2 className={styles.ourWorkVialArchiveTitle}>
            식물세포 유전자 단백질 재 조합 연구 개발
          </h2>

          <div className={styles.ourWorkVialArchiveBody}>
            <p className={styles.ourWorkVialArchiveBodyPara}>
              피부 독소 ,노화피부, 화장 독. 경피 독, 피부 손상. 피부 트러블
            </p>
            <p className={styles.ourWorkVialArchiveBodyPara}>
              피부 조직 복원 목적 단백질 연구 개발
            </p>
          </div>
        </div>
      </section>

      <section
        className={styles.ourWorkDropletSignalSection}
        aria-label="Droplet process signal flow"
      >
        <div className={styles.ourWorkDropletSignalInner}>
          <div className={styles.ourWorkDropletSignalHairline} aria-hidden />

          <div className={styles.ourWorkDropletSignalVisual}>
            <img
              src="/landing-assets/ourwork-editorial-droplet-02.webp"
              alt=""
              className={styles.ourWorkDropletSignalImage}
              loading="lazy"
              decoding="async"
              draggable={false}
            />
            <div className={styles.ourWorkDropletSignalOverlay} aria-live="polite">
              <p className={styles.ourWorkDropletSignalKicker}>PROCESS SIGNAL FLOW</p>
              <div className={styles.ourWorkDropletSignalStepStage}>
                {DROPLET_PROCESS_STEPS.map((step, index) => (
                  <span
                    key={step}
                    className={styles.ourWorkDropletSignalStep}
                    style={{
                      animationDelay: `${index * DROPLET_STEP_DURATION_S}s`,
                      animationDuration: `${DROPLET_CYCLE_DURATION_S}s`,
                    }}
                  >
                    {step}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.ourWorkDropletClosingCopy}>
            <h2 className={styles.ourWorkDropletClosingTitle}>
              하나의 메커니즘으로 변혁을 완성하는 것은
            </h2>
            <p className={styles.ourWorkDropletClosingBody}>
              창조적 물질만이 할수 있는것이다
            </p>
          </div>
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
