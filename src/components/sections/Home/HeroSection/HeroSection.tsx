"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./HeroSection.module.css";

const HERO_BLOCKS = [
  ["HEY", "TONY WANG"],
  ["Why?"],
  ["Did you come out into the", "world?"],
  ["NIGAJUN", "SKINCARE"],
  ["I wanted"],
  ["enjoy it"],
  ["Okay."],
  ["waste"],
  ["Fake"],
  ["All"],
  ["Throw it away"],
  ["What's the best"],
  ["I will show you."],
  ["NIGAJUN"],
  ["TONY WANG"],
  ["TONY WANG", "SINCE May 2026"],
];

export default function HeroSection() {
  const heroVisualRef = useRef<HTMLDivElement | null>(null);
  const videoOverlayRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hideText, setHideText] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasVideo, setHasVideo] = useState(false);
  const [hasPlaybackStarted, setHasPlaybackStarted] = useState(false);
  const [blockIndex, setBlockIndex] = useState(0);
  const [typedLines, setTypedLines] = useState<string[]>([]);
  const [isTextExiting, setIsTextExiting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let hasMountedVideo = false;
    let timeoutId: number | null = null;
    let observer: IntersectionObserver | null = null;
    let hasScheduledMount = false;

    const mountVideoOverlay = () => {
      if (!isMounted || hasMountedVideo || !videoOverlayRef.current) {
        return;
      }

      const videoEl = document.createElement("video");
      videoEl.className = styles.videoElement;
      videoEl.muted = true;
      videoEl.playsInline = true;
      videoEl.preload = "metadata";
      videoEl.setAttribute("aria-hidden", "true");
      console.log("video created");

      // attach desktop/mobile sources with media queries
      const sourcePc = document.createElement("source");
      sourcePc.src = "/landing-assets/home-hero-pc.mp4";
      sourcePc.type = "video/mp4";
      sourcePc.media = "(min-width: 769px)";

      const sourceMobile = document.createElement("source");
      sourceMobile.src = "/landing-assets/home-hero-mobile.mp4";
      sourceMobile.type = "video/mp4";
      sourceMobile.media = "(max-width: 768px)";

      console.log("source pc:", sourcePc.src);
      console.log("source mobile:", sourceMobile.src);

      videoEl.appendChild(sourcePc);
      videoEl.appendChild(sourceMobile);

      videoOverlayRef.current.appendChild(videoEl);
      console.log("video appended");
      videoRef.current = videoEl;
      setHasVideo(true);
      try {
        console.log("video load called");
        videoEl.load();
        console.log("video readyState:", videoEl.readyState);
        // autoplay disabled: start only on button click
      } catch {}
      hasMountedVideo = true;
    };

    const rafId = requestAnimationFrame(() => {
      if (!heroVisualRef.current) {
        return;
      }

      observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry && entry.isIntersecting && !hasScheduledMount) {
            hasScheduledMount = true;
            timeoutId = window.setTimeout(() => {
              setHideText(true);
              mountVideoOverlay();
              if (observer) {
                observer.disconnect();
              }
            }, 1000);
          }
        },
        { threshold: 0.2 }
      );

      observer.observe(heroVisualRef.current);
    });

    return () => {
      isMounted = false;
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
      if (observer) {
        observer.disconnect();
      }
      cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      video.pause();
      video.currentTime = 0;
      setIsPlaying(false);
      setHasPlaybackStarted(false);
      setBlockIndex(0);
      setTypedLines([]);
      setIsTextExiting(false);
    };

    video.addEventListener("ended", handleEnded);
    return () => {
      video.removeEventListener("ended", handleEnded);
    };
  }, [hasVideo]);

  useEffect(() => {
    if (!hasPlaybackStarted) return;

    let cancelled = false;

    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        setTimeout(resolve, ms);
      });

    const runBlocks = async () => {
      let current = 0;
      setBlockIndex(0);
      setTypedLines([]);
      setIsTextExiting(false);

      while (!cancelled && current < HERO_BLOCKS.length) {
        const lines = HERO_BLOCKS[current];
        const buffer: string[] = [];

        for (let i = 0; i < lines.length; i += 1) {
          const line = lines[i];
          let typed = "";

          for (const ch of line) {
            if (cancelled) return;
            typed += ch;
            buffer[i] = typed;
            setTypedLines([...buffer]);
            await sleep(65);
          }

          if (cancelled) return;
          await sleep(220);
        }

        if (cancelled) return;
        await sleep(900);
        if (cancelled) return;

        setIsTextExiting(true);
        await sleep(650);
        if (cancelled) return;

        setTypedLines([]);
        setIsTextExiting(false);
        current += 1;
        setBlockIndex(current);
      }

      if (cancelled) return;
      setTypedLines([]);
      setIsTextExiting(false);
      setBlockIndex(0);
    };

    runBlocks();

    return () => {
      cancelled = true;
    };
  }, [hasPlaybackStarted]);

  const handleToggle = async () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.muted = false;
      const playResult = await video.play().catch(() => null);
      if (playResult === undefined || playResult) {
        setIsPlaying(true);
        setHasPlaybackStarted(true);
      } else {
        setIsPlaying(false);
        setHasPlaybackStarted(false);
      }
    } else {
      video.pause();
      video.currentTime = 0;
      setIsPlaying(false);
      setHasPlaybackStarted(false);
      setBlockIndex(0);
      setTypedLines([]);
      setIsTextExiting(false);
    }
  };

  return (
    <section className={styles.heroSection}>
      <div ref={heroVisualRef} className={styles.heroVisual}>
        <div className={styles.videoArea}>
          <div className={styles.backgroundLayer} />
          <div ref={videoOverlayRef} className={styles.videoOverlay} aria-hidden="true" />
        </div>
        <button
          type="button"
          className={styles.playButton}
          onClick={handleToggle}
          aria-label={isPlaying ? "Pause video" : "Play video"}
        />
        <div className={styles.heroOverlay}>
          <p className={`${styles.introText} ${hideText ? styles.introTextHidden : ""}`}>
            TONY WANG<br />
            Plant Cell Genetic Protein Laboratory<br />
            식물세포유전자단백질연구개발<br />
            분자생물학 바이오생명공학연구소<br />
            My job is to develop a plant cell gene protein
          </p>

          <div
            className={`${styles.videoTextWrap} ${hideText ? styles.videoTextWrapVisible : ""}`}
            aria-hidden="true"
          >
            {hasPlaybackStarted ? (
              <p className={`${styles.videoText} ${isTextExiting ? styles.videoTextExit : ""}`}>
                {typedLines.map((line, i) => (
                  <span key={`${blockIndex}-${i}`}>
                    {line}
                    {i < typedLines.length - 1 ? <br /> : null}
                  </span>
                ))}
              </p>
            ) : null}
          </div>

          <div className={styles.brandText}>
            TONYWANG
          </div>
        </div>
      </div>
    </section>
  );
}
