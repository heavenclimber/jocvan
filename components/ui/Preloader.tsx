"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";

/* ─────────────────────────────────────────────
 * Configuration
 * ───────────────────────────────────────────── */
const NUM_POINTS = 10;
const NUM_PATHS = 3;
const DELAY_POINTS_MAX = 0.3;
const DELAY_PER_PATH = 0.25;

const GRADIENTS = [
  { id: "gradient1", stops: ["#00c99b", "#ff0ea1"] },
  { id: "gradient2", stops: ["#ffd392", "#ff3898"] },
  { id: "gradient3", stops: ["#110046", "#32004a"] },
];

/* ─────────────────────────────────────────────
 * Asset pre-loading helper
 * ───────────────────────────────────────────── */
function preloadAssets(onProgress: (pct: number) => void): Promise<void> {
  return new Promise((resolve) => {
    // Collect all <img> on the page (including those in the preloader itself).
    const images = Array.from(document.querySelectorAll("img")) as HTMLImageElement[];

    // Collect all CSS background images that are visible
    const bgImages: string[] = [];
    document.querySelectorAll("*").forEach((el) => {
      const bg = getComputedStyle(el).backgroundImage;
      if (bg && bg !== "none") {
        const match = bg.match(/url\(["']?(.+?)["']?\)/);
        if (match) bgImages.push(match[1]);
      }
    });

    // Create image elements for bg images
    const bgImgEls = bgImages.map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    });

    const allImages = [...images, ...bgImgEls];
    const total = allImages.length || 1;
    let loaded = 0;

    const tick = () => {
      loaded++;
      onProgress(Math.min((loaded / total) * 100, 100));
      if (loaded >= total) resolve();
    };

    if (allImages.length === 0) {
      // No images to load — simulate a short progress
      let fakeProgress = 0;
      const iv = setInterval(() => {
        fakeProgress += 20;
        onProgress(Math.min(fakeProgress, 100));
        if (fakeProgress >= 100) {
          clearInterval(iv);
          resolve();
        }
      }, 120);
      return;
    }

    allImages.forEach((img) => {
      if (img.complete) {
        tick();
      } else {
        img.addEventListener("load", tick, { once: true });
        img.addEventListener("error", tick, { once: true });
      }
    });

    // Safety timeout so we never hang forever
    setTimeout(() => {
      onProgress(100);
      resolve();
    }, 8000);
  });
}

/* ─────────────────────────────────────────────
 * SVG path builder (matches the reference code)
 * ───────────────────────────────────────────── */
function buildPathD(points: number[], opening: boolean): string {
  let d = opening
    ? `M 0 0 V ${points[0]} C`
    : `M 0 ${points[0]} C`;

  for (let j = 0; j < points.length - 1; j++) {
    const p = ((j + 1) / (points.length - 1)) * 100;
    const cp = p - (1 / (points.length - 1) * 100) / 2;
    d += ` ${cp} ${points[j]} ${cp} ${points[j + 1]} ${p} ${points[j + 1]}`;
  }

  d += opening ? ` V 100 H 0` : ` V 0 H 0`;
  return d;
}

/* ─────────────────────────────────────────────
 * Preloader Component
 * ───────────────────────────────────────────── */
interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const overlayRef = useRef<SVGSVGElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const [progress, setProgress] = useState(0);
  const isTransitioningRef = useRef(false);

  // Store points for the SVG paths
  const allPointsRef = useRef<number[][]>([]);

  // Initialise points arrays
  useEffect(() => {
    const pts: number[][] = [];
    for (let i = 0; i < NUM_PATHS; i++) {
      const points: number[] = [];
      for (let j = 0; j < NUM_POINTS; j++) {
        points.push(100); // start fully covering the viewport
      }
      pts.push(points);
    }
    allPointsRef.current = pts;

    // Render the initial covering state
    renderPaths(true);
  }, []);

  /* ── render SVG paths from current points ── */
  const renderPaths = useCallback((isOpened: boolean) => {
    const allPoints = allPointsRef.current;
    for (let i = 0; i < NUM_PATHS; i++) {
      const path = pathRefs.current[i];
      if (!path) continue;
      const d = buildPathD(allPoints[i], isOpened);
      path.setAttribute("d", d);
    }
  }, []);

  /* ── Shape overlay reveal transition ── */
  const playRevealTransition = useCallback(() => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;

    const allPoints = allPointsRef.current;

    // Generate random delays for each control point
    const pointsDelay: number[] = [];
    for (let i = 0; i < NUM_POINTS; i++) {
      pointsDelay[i] = Math.random() * DELAY_POINTS_MAX;
    }

    const tl = gsap.timeline({
      onUpdate: () => renderPaths(true),
      onComplete: () => {
        // Hide the entire preloader
        if (containerRef.current) {
          containerRef.current.style.display = "none";
        }
        onComplete();
      },
      defaults: {
        ease: "power2.inOut",
        duration: 0.9,
      },
    });

    // Animate each path's points from 100 → 0 (reveal)
    for (let i = 0; i < NUM_PATHS; i++) {
      const points = allPoints[i];
      const pathDelay = DELAY_PER_PATH * (NUM_PATHS - i - 1);

      for (let j = 0; j < NUM_POINTS; j++) {
        const delay = pointsDelay[j];
        tl.to(
          points,
          { [j]: 0, duration: 0.9, ease: "power2.inOut" },
          delay + pathDelay
        );
      }
    }

    return tl;
  }, [renderPaths, onComplete]);

  /* ── Loading phase ── */
  useEffect(() => {
    // Entrance animation for preloader UI
    const ctx = gsap.context(() => {
      const entranceTl = gsap.timeline();

      entranceTl
        .from(logoRef.current, {
          scale: 0.5,
          opacity: 0,
          duration: 0.8,
          ease: "back.out(1.7)",
        })
        .from(
          taglineRef.current,
          { y: 20, opacity: 0, duration: 0.6, ease: "power2.out" },
          "-=0.3"
        )
        .from(
          progressBarRef.current?.parentElement || null,
          { scaleX: 0, opacity: 0, duration: 0.5, ease: "power2.out" },
          "-=0.2"
        );
    }, containerRef);

    // Start preloading assets
    const handle = requestAnimationFrame(() => {
      preloadAssets((pct) => {
        setProgress(Math.round(pct));

        // Animate the progress bar width
        if (progressBarRef.current) {
          gsap.to(progressBarRef.current, {
            width: `${pct}%`,
            duration: 0.3,
            ease: "power1.out",
          });
        }

        // Animate the counter
        if (progressRef.current) {
          progressRef.current.textContent = `${Math.round(pct)}%`;
        }
      }).then(() => {
        // Small pause after loading completes, then transition out
        gsap.delayedCall(0.6, () => {
          // Fade out loader UI first
          const fadeOutTl = gsap.timeline({
            onComplete: () => {
              playRevealTransition();
            },
          });

          fadeOutTl
            .to(logoRef.current, {
              y: -30,
              opacity: 0,
              duration: 0.4,
              ease: "power2.in",
            })
            .to(
              taglineRef.current,
              { y: -20, opacity: 0, duration: 0.3, ease: "power2.in" },
              "-=0.25"
            )
            .to(
              progressBarRef.current?.parentElement || null,
              { y: -15, opacity: 0, duration: 0.3, ease: "power2.in" },
              "-=0.2"
            )
            .to(
              progressRef.current,
              { y: -10, opacity: 0, duration: 0.3, ease: "power2.in" },
              "-=0.2"
            );
        });
      });
    });

    return () => {
      cancelAnimationFrame(handle);
      ctx.revert();
    };
  }, [playRevealTransition]);

  return (
    <div
      ref={containerRef}
      className="preloader"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        pointerEvents: "none",
      }}
    >
      {/* ── Loader UI Content ── */}
      <div className="preloader__content">
        {/* Animated logo / initials */}
        <div ref={logoRef} className="preloader__logo">
          <span className="preloader__logo-text">JB</span>
          <div className="preloader__logo-ring" />
        </div>

        {/* Tagline */}
        <p ref={taglineRef} className="preloader__tagline">
          Loading Experience…
        </p>

        {/* Progress bar */}
        <div className="preloader__progress-track">
          <div ref={progressBarRef} className="preloader__progress-bar" />
        </div>

        {/* Percentage */}
        <span ref={progressRef} className="preloader__percent">
          0%
        </span>
      </div>

      {/* ── SVG Shape Overlay ── */}
      <svg
        ref={overlayRef}
        className="preloader__overlay"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          {GRADIENTS.map((g) => (
            <linearGradient
              key={g.id}
              id={g.id}
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor={g.stops[0]} />
              <stop offset="100%" stopColor={g.stops[1]} />
            </linearGradient>
          ))}
        </defs>
        {GRADIENTS.map((g, i) => (
          <path
            key={g.id}
            ref={(el) => {
              pathRefs.current[i] = el;
            }}
            className="preloader__overlay-path"
            fill={`url(#${g.id})`}
          />
        ))}
      </svg>
    </div>
  );
}
