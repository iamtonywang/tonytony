"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./HeroSection.module.css";

const HERO_SEQUENCE = [
  "HEY",
  "TONY WANG",
  "Do you know the reality?",
  "People don't know TONY WANG",
  "I don't have a presence",
  "No one knows TONY WANG",
  "Why is it coming out to the world?",
  "I want to prove that I'm the best",
  "And",
  "I want to enjoy the new challenge to my heart's content",
  "revolution",
  "Not everyone can do it",
  "TONY WANG",
  "only one who can do it",
  "It's only possible for the Creation",
  "Creation !",
  "You have to be crazy to have it"
];

const HERO_FINAL_BLOCK = (
  <>
    TONY WANG<br />
    All right.<br />
    I've been studying cells for 28 years<br />
    I've never thought about making trashy cosmetics<br />
    It's their lies that made me angry<br />
    I decided to change all my trashy cosmetics<br />
    I decided to make a crazy new creation this time<br />
    I researched and developed NIGAJUN<br />
    I want to prove that the past and present are the first<br />
    I want to show you that I'm the best<br />
    I think it's going to be a fun game<br />
    I thought about it and decided<br />
    You can turn the world around with skincare<br />
    What excites me even more is that<br />
    It's a bad skincare culture that only lies<br />
    I want to break it down<br />
    You have to be crazy to win<br />
    This is my TONY WANG's belief<br />
    You have to be crazy to get what you want<br />
    It's a very good and valuable work<br />
    TONY WANG
  </>
);

export default function HeroSection() {
  const heroVisualRef = useRef<HTMLDivElement | null>(null);
  const videoOverlayRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hideText, setHideText] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasVideo, setHasVideo] = useState(false);
  const [seqIndex, setSeqIndex] = useState(0);
  const [showFinalBlock, setShowFinalBlock] = useState(false);
  const [hasPlaybackStarted, setHasPlaybackStarted] = useState(false);
  const [isSequenceExiting, setIsSequenceExiting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let hasMountedVideo = false;
    let timeoutId: number | null = null;
    let observer: IntersectionObserver | null = null;

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
          if (entry && entry.isIntersecting) {
            timeoutId = window.setTimeout(() => {
              setHideText(true);
              mountVideoOverlay();
              if (observer) {
                observer.disconnect();
              }
            }, 2000);
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
      setIsSequenceExiting(false);
    };

    video.addEventListener("ended", handleEnded);
    return () => {
      video.removeEventListener("ended", handleEnded);
    };
  }, [hasVideo]);

  useEffect(() => {
    if (!hasPlaybackStarted) return;

    setSeqIndex(0);
    setShowFinalBlock(false);
    setIsSequenceExiting(false);

    let currentIndex = 0;
    let stepTimeout: ReturnType<typeof setTimeout> | null = null;
    let exitTimeout: ReturnType<typeof setTimeout> | null = null;

    const runSequence = () => {
      exitTimeout = setTimeout(() => {
        setIsSequenceExiting(true);
      }, 3360);

      stepTimeout = setTimeout(() => {
        currentIndex += 1;

        if (currentIndex >= HERO_SEQUENCE.length) {
          setIsSequenceExiting(false);
          setShowFinalBlock(true);
          return;
        }

        setSeqIndex(currentIndex);
        setIsSequenceExiting(false);
        runSequence();
      }, 4440);
    };

    runSequence();

    return () => {
      if (exitTimeout) clearTimeout(exitTimeout);
      if (stepTimeout) clearTimeout(stepTimeout);
    };
  }, [hasPlaybackStarted]);

  const handleToggle = async () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.muted = false;
      video.currentTime = 0;
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
      setSeqIndex(0);
      setShowFinalBlock(false);
      setIsSequenceExiting(false);
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
            TONY WANG<br/>
            Plant Cell Genetic Protein Laboratory<br/>
            식물세포유전자단백질연구개발<br/>
            분자생물학 바이오생명공학연구소
          </p>

          <div
            className={`${styles.videoTextWrap} ${hideText ? styles.videoTextWrapVisible : ""}`}
            aria-hidden="true"
          >
            {hasPlaybackStarted ? (
              showFinalBlock ? (
                <p className={styles.videoText}>
                  {HERO_FINAL_BLOCK}
                </p>
              ) : (
                <p
                  key={seqIndex}
                  className={`${styles.videoText} ${isSequenceExiting ? styles.videoTextExit : ""}`}
                >
                  {HERO_SEQUENCE[seqIndex]}
                </p>
              )
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
