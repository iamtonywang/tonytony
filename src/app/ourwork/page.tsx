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
            <p className={`${styles.editorialIntroHeadlineKicker} ${styles.elMessiriText}`}>
              Global first No1
            </p>

            <h2 className={styles.editorialIntroHeadline}>
              <span className={styles.editorialIntroHeadlineLine}>plant cell genetic</span>
              <span className={styles.editorialIntroHeadlineLine}>protein</span>
            </h2>

            <p className={styles.editorialIntroKorean}>식물 세포 유전자 단백질</p>

            <div className={styles.editorialIntroLead}>
              <p className={styles.elMessiriText}>
                Plant Cell Gene Protein principle of cloning and recombination of different cell DNA
              </p>
              <p className={styles.elMessiriText}>New cell structure when cell DNA is combined</p>
              <p className={styles.elMessiriText}>
                Newly formed cells create new components in a third structure
              </p>
            </div>

            <div className={styles.editorialIntroLeadDivider} aria-hidden="true" />

            <div className={styles.editorialIntroAsymmetricRow}>
              <div className={styles.editorialIntroSecondaryVisualWrap}>
                <img
                  src="/landing-assets/home-theme-clean-01.webp"
                  alt=""
                  className={styles.editorialIntroSecondaryVisual}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
              </div>

              <div className={styles.editorialIntroArchiveBlock}>
                <p className={`${styles.editorialIntroKicker} ${styles.elMessiriText}`}>
                  Global first No1
                </p>

                <div className={styles.editorialIntroDivider} aria-hidden="true" />

                <p className={`${styles.editorialIntroArchiveLabel} ${styles.elMessiriText}`}>
                  TONY WANG
                </p>

                <div className={styles.editorialIntroArchiveNote}>
                  <p className={styles.elMessiriText}>
                    Research and development to create new DNA for cells
                  </p>
                  <p className={styles.elMessiriText}>
                    Newly formed cells create new efficacy structures as complex members
                  </p>
                  <p className={styles.elMessiriText}>
                    Plant cell gene protein recombination technology
                  </p>
                  <p className={styles.elMessiriText}>
                    Skin toxin, aging skin, cosmetic poison.
                    <br />
                    Skin damage caused by percutaneous poison infection.
                  </p>
                  <p className={styles.elMessiriText}>
                    Skin trouble.
                    <br />
                    Protein research and development for skin tissue restoration
                  </p>
                </div>
              </div>

              <div className={styles.editorialKoreanArchiveSection}>
                <div className={styles.editorialKoreanArchiveDivider} aria-hidden="true" />

                <div className={styles.editorialKoreanArchiveVisualWrap}>
                  <img
                    src="/landing-assets/ourwork-editorial-droplet-02.webp"
                    alt=""
                    className={styles.editorialKoreanArchiveVisual}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                  />
                </div>

                <div className={styles.editorialKoreanArchiveCopy}>
                  <p className={`${styles.editorialKoreanArchiveKicker} ${styles.elMessiriText}`}>
                    Global first No1
                  </p>

                  <p className={styles.editorialKoreanArchiveHeadline}>
                    세포 DNA 클로닝 후 세포{" "}
                    <span className={styles.editorialKoreanArchiveHeadlinePcTail}>
                      결합 재 조합 연구 개발
                    </span>
                    <span className={styles.editorialKoreanArchiveHeadlineMobileTail}>
                      결합
                      <br />
                      재 조합 연구 개발
                    </span>
                  </p>
                  <p className={styles.editorialKoreanArchiveLine}>
                    식물 세포 유전자 단백질 세포 DNA를 결합했을 때 변이 세포 형성
                  </p>
                  <p className={styles.editorialKoreanArchiveLine}>
                    변이 세포 복합 구성 체 구조적 생성 피부 독소, 노화피부, 화장 독. 경피 독 , 피부 손상.
                  </p>
                  <p className={styles.editorialKoreanArchiveLine}>
                    피부 트러블. 피부 조직 복원 목적 단백질 연구 개발
                  </p>

                  <div className={styles.editorialKoreanArchiveVialBlock}>
                    <div className={styles.editorialKoreanArchiveVialDivider} aria-hidden="true" />

                    <div className={styles.editorialKoreanArchiveVialVisualWrap}>
                      <img
                        src="/landing-assets/ourwork-editorial-vial-01.jpg"
                        alt=""
                        className={styles.editorialKoreanArchiveVialVisual}
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                      />
                      <div className={styles.editorialKoreanArchiveVialOverlay}>
                        <div className={styles.editorialKoreanArchiveVialOverlayTop}>
                          <div
                            className={styles.editorialKoreanArchiveVialProcessDivider}
                            aria-hidden="true"
                          />
                          <p
                            className={`${styles.editorialKoreanArchiveVialProcessLabel} ${styles.elMessiriText}`}
                          >
                            BIO PROCESS 01
                          </p>
                          <p className={styles.editorialKoreanArchiveVialProcessLine}>
                            식물 세포 유전자 단백질 생성
                          </p>
                          <p className={styles.editorialKoreanArchiveVialProcessLine}>
                            세포 DNA 유전자 단백질 합성
                          </p>
                        </div>

                        <div className={styles.editorialKoreanArchiveVialOverlayBottom}>
                          <div
                            className={styles.editorialKoreanArchiveVialProcessDivider}
                            aria-hidden="true"
                          />
                          <p
                            className={`${styles.editorialKoreanArchiveVialSequenceLabel} ${styles.elMessiriText}`}
                          >
                            PROCESS SEQUENCE
                          </p>
                          <ol className={styles.editorialKoreanArchiveVialSequenceList}>
                            <li className={styles.editorialKoreanArchiveVialSequenceItem}>
                              <span className={styles.editorialKoreanArchiveVialSequenceNum}>01</span>
                              <span className={styles.editorialKoreanArchiveVialSequenceText}>
                                식물 세포 정제 / Plant Cell Refinement
                              </span>
                            </li>
                            <li className={styles.editorialKoreanArchiveVialSequenceItem}>
                              <span className={styles.editorialKoreanArchiveVialSequenceNum}>02</span>
                              <span className={styles.editorialKoreanArchiveVialSequenceText}>
                                단백질 추출 / Protein Extraction
                              </span>
                            </li>
                            <li className={styles.editorialKoreanArchiveVialSequenceItem}>
                              <span className={styles.editorialKoreanArchiveVialSequenceNum}>03</span>
                              <span className={styles.editorialKoreanArchiveVialSequenceText}>
                                DNA 클로닝 / DNA Cloning
                              </span>
                            </li>
                            <li className={styles.editorialKoreanArchiveVialSequenceItem}>
                              <span className={styles.editorialKoreanArchiveVialSequenceNum}>04</span>
                              <span className={styles.editorialKoreanArchiveVialSequenceText}>
                                세포 결합 / Cell Binding
                              </span>
                            </li>
                            <li className={styles.editorialKoreanArchiveVialSequenceItem}>
                              <span className={styles.editorialKoreanArchiveVialSequenceNum}>05</span>
                              <span className={styles.editorialKoreanArchiveVialSequenceText}>
                                재조합 / Recombination
                              </span>
                            </li>
                            <li className={styles.editorialKoreanArchiveVialSequenceItem}>
                              <span className={styles.editorialKoreanArchiveVialSequenceNum}>06</span>
                              <span className={styles.editorialKoreanArchiveVialSequenceText}>
                                새로운 단백질 구조 / New Protein Structure
                              </span>
                            </li>
                          </ol>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
