import styles from "./HomeMotionDivider.module.css";

export default function HomeMotionDivider() {
  return (
    <section className={styles.dividerSection}>
      <div className={styles.motionLine} aria-hidden="true" />

      <div className={styles.dividerCopy}>
        <p className={styles.manifestoKicker}>WHY NOW?</p>

        <p className={`${styles.manifestoKr} ${styles.manifestoTightPc}`}>
          최초라는 것을 증명 할려고 나왔어
        </p>

        <p className={styles.manifestoKr}>
          <span className={styles.pcOnly}>
            <span className={styles.manifestoEnInline}>TONY WANG</span>
          </span>
          <span className={styles.mobileOnly}>
            <span className={styles.manifestoEnInline}>TONY WANG</span>
          </span>
        </p>

        <p className={styles.manifestoKr}>
          <span className={styles.pcOnly}>
            생명공학 과 향장학 분야는 접근하는 방법이 다르다 바이오 생명공학은 신약 연구 분야고 향장학은 배합의 기술이야
          </span>
          <span className={styles.mobileOnly}>
            생명공학 과 향장학 분야는 접근하는 방법이 다르다
            <br />
            바이오 생명공학은 신약 연구 분야고
            <br />
            향장학은 배합의 기술이야
          </span>
        </p>

        <p className={`${styles.manifestoKr} ${styles.manifestoTightPc}`}>
          바이오 생명공학 은 창조의 세계관 이다
        </p>

        <div className={styles.manifestoHairline} aria-hidden="true" />

        <p className={`${styles.manifestoYear} ${styles.manifestoTightPc}`}>
          28 years
        </p>

        <p className={styles.manifestoKr}>
          <span className={styles.pcOnly}>
            28년 시간 신약 물질만 연구 개발{" "}
            <span className={styles.manifestoWhyInline}>WHY?</span>{" "}
            <span className={styles.editorialEnglishAccent}>SKIN CARE</span>를 연구 개발한 이유는
          </span>
          <span className={styles.mobileOnly}>
            28년 시간 신약 물질만 연구 개발
            <br />
            <span className={styles.manifestoWhyInline}>WHY?</span>{" "}
            <span className={styles.editorialEnglishAccent}>SKIN CARE</span>를 연구 개발한 이유는
          </span>
        </p>

        <p className={styles.manifestoKr}>
          <span className={styles.pcOnly}>
            아토피 신약 임상을 하는 과정에서 새로운 기전을 발견 하였고 임상 과정에서 놀라운 사실을 목격 했어
          </span>
          <span className={styles.mobileOnly}>
            아토피 신약 임상을 하는 과정에서 새로운 기전을
            <br />
            발견 하였고 임상 과정에서 놀라운 사실을 목격 했어
          </span>
        </p>

        <p className={styles.manifestoKr}>그것을 목격한 후로 나는 생각했고 결심했어</p>

        <p className={styles.manifestoKr}>
          <span className={styles.pcOnly}>
            <span className={styles.editorialEnglishAccent}>SKIN CARE</span>로도 세상을 뒤집어 놓을수있다는 것을 깨달게 되었어
          </span>
          <span className={styles.mobileOnly}>
            <span className={styles.editorialEnglishAccent}>SKIN CARE</span>로도 세상을 뒤집어
            <br />
            놓을수있다는 것을 깨달게 되었어
          </span>
        </p>

        <p className={styles.manifestoBenjamin}>The Curious Case of Benjamin Button</p>

        <p className={styles.manifestoKr}>상상이 아닌 현실로 . . . . .할수 있다는 것을</p>

        <div className={styles.manifestoHairline} aria-hidden="true" />

        <p className={styles.manifestoGold}>Proteo Phyto Complex</p>

        <p className={styles.manifestoKr}>
          식물 세포 유전자 단백질 복합 성분 <span className={styles.editorialEnglishAccent}>NIGAJUN</span>
        </p>

        <p className={styles.manifestoKr}>
          <span className={styles.pcOnly}>
            <span className={styles.editorialEnglishAccent}>Global</span> 최초 식물 세포 유전자 단백질{" "}
            <span className={styles.editorialEnglishAccent}>BIO</span> 생명공학{" "}
            <span className={styles.editorialEnglishAccent}>SKIN CARE</span>
            <br />
            <span className={styles.editorialEnglishAccent}>NIGAJUN</span>
            <br />
            믿기 힘든 피부 변혁이 이루어지는 기적을 보여주고 싶을 뿐 입니다
          </span>
          <span className={styles.mobileOnly}>
            <span className={styles.editorialEnglishAccent}>Global</span> 최초 식물 세포 유전자 단백질
            <br />
            <span className={styles.editorialEnglishAccent}>BIO</span> 생명공학{" "}
            <span className={styles.editorialEnglishAccent}>SKIN CARE</span>
            <br />
            <span className={styles.editorialEnglishAccent}>NIGAJUN</span>
            <br />
            믿기 힘든 피부 변혁이 이루어지는
            <br />
            기적을 보여주고 싶을 뿐 입니다
          </span>
        </p>

        <p className={`${styles.manifestoSignature} ${styles.manifestoTightPc} ${styles.manifestoEnglish14}`}>
          May 2026 TONY WANG
        </p>
      </div>

      <div className={styles.bottomMotionLine} aria-hidden="true" />
    </section>
  );
}
