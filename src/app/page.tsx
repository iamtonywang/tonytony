import type { ReactNode } from "react";
import styles from "./page.module.css";
import HomeMotionLine from "@/components/sections/HomeMotionLine/HomeMotionLine";
import HomeVideoSection from "@/components/sections/HomeVideoSection/HomeVideoSection";

type ThemeBanner =
  | { kind: "image"; src: string; alt: string }
  | { kind: "placeholder" };

type ThemeSection = {
  number: string;
  title: string;
  banner: ThemeBanner;
  body: ReactNode | null;
};

const HOME_THEME_SECTIONS: ThemeSection[] = [
  {
    number: "01",
    title: "WHY NOW?",
    banner: {
      kind: "image",
      src: "/landing-assets/home-hero-main-clean-pc.webp",
      alt: "WHY NOW editorial banner",
    },
    body: (
      <>
        <p className={styles.themeBodyPara}>최초라는 것을 증명 할려고 나왔어</p>
        <p className={styles.themeBodyPara}>
          <span className={styles.themeEnAccent}>TONY WANG</span>
        </p>
        <p className={styles.themeBodyPara}>
          생명공학 과 향장학 분야는 접근하는 방법이 다르다 바이오 생명공학은 신약 연구 분야고
          향장학은 배합의 기술이야
        </p>
        <p className={styles.themeBodyPara}>바이오 생명공학 은 창조의 세계관 이다</p>
      </>
    ),
  },
  {
    number: "02",
    title: "28 years",
    banner: {
      kind: "image",
      src: "/landing-assets/tonywang-interview-archive.jpg",
      alt: "28 years editorial banner",
    },
    body: (
      <>
        <p className={styles.themeBodyPara}>
          28년 시간 신약 물질만 연구 개발{" "}
          <span className={styles.themeEnInline}>WHY?</span>{" "}
          <span className={styles.themeEnAccent}>SKIN CARE</span>를 연구 개발한 이유는
        </p>
        <p className={styles.themeBodyPara}>
          아토피 신약 임상을 하는 과정에서 새로운 기전을 발견 하였고 임상 과정에서 놀라운 사실을
          목격 했어
        </p>
        <p className={styles.themeBodyPara}>그것을 목격한 후로 나는 생각했고 결심했어</p>
        <p className={styles.themeBodyPara}>
          <span className={styles.themeEnAccent}>SKIN CARE</span>로도 세상을 뒤집어 놓을수있다는
          것을 깨달게 되었어
        </p>
        <p className={styles.themeBodyPara}>The Curious Case of Benjamin Button</p>
        <p className={styles.themeBodyPara}>상상이 아닌 현실로 . . . . .할수 있다는 것을</p>
      </>
    ),
  },
  {
    number: "03",
    title: "Proteo Phyto Complex",
    banner: {
      kind: "image",
      src: "/landing-assets/home-hero-main-clean-pc-ee271f.webp",
      alt: "Proteo Phyto Complex editorial banner",
    },
    body: (
      <>
        <p className={styles.themeBodyPara}>
          식물 세포 유전자 단백질 복합 성분{" "}
          <span className={styles.themeEnAccent}>NIGAJUN</span>
        </p>
        <p className={styles.themeBodyPara}>
          <span className={styles.themeEnAccent}>Global</span> 최초 식물 세포 유전자 단백질{" "}
          <span className={styles.themeEnAccent}>BIO</span> 생명공학{" "}
          <span className={styles.themeEnAccent}>SKIN CARE</span>
        </p>
        <p className={styles.themeBodyPara}>
          <span className={styles.themeEnAccent}>NIGAJUN</span>
        </p>
        <p className={styles.themeBodyPara}>
          피부 변혁이 이루어지는 믿기 힘든 기적을 곧 보게 될 것 입니다
        </p>
      </>
    ),
  },
  {
    number: "04",
    title: "May 2026 TONY WANG",
    banner: {
      kind: "image",
      src: "/landing-assets/login-bg-main.webp",
      alt: "May 2026 TONY WANG editorial banner",
    },
    body: null,
  },
];

export default function HomePage() {
  return (
    <div className={styles.homePage}>
      <HomeMotionLine />
      <HomeVideoSection />
      <section className={styles.themeSections} aria-label="Editorial themes">
        {HOME_THEME_SECTIONS.map((theme, index) => (
          <article key={theme.number} className={styles.themeSection}>
            {index > 0 ? <div className={styles.themeHairline} aria-hidden /> : null}
            <div className={styles.themeBannerWrap}>
              {theme.banner.kind === "image" ? (
                <img
                  src={theme.banner.src}
                  alt={theme.banner.alt}
                  className={styles.themeBannerImage}
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                  draggable={false}
                />
              ) : (
                <div className={styles.themeBannerPlaceholder} aria-hidden />
              )}
            </div>
            <p className={styles.themeNumber}>{theme.number}</p>
            <h2
              className={`${styles.themeTitle} ${
                theme.body === null ? styles.themeTitleFinale : ""
              }`}
            >
              {theme.title}
            </h2>
            {theme.body ? <div className={styles.themeBody}>{theme.body}</div> : null}
          </article>
        ))}
      </section>
    </div>
  );
}