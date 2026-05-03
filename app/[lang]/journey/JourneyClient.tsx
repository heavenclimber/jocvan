"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDict } from "@/lib/DictContext";
import { ArrowLeft, ChevronRight, ChevronLeft } from "lucide-react";
import Image from "next/image";

/* ─────────────────────────────────────────────────────────
 *  Journey Data — The 3 corridor sections
 * ───────────────────────────────────────────────────────── */

interface JourneySection {
  id: string;
  title: string;
  subtitle: string;
  year: string;
  description: string;
  details: string[];
  image: string;
  color: string;
  accent: string;
  animationClass: string;
}

const JOURNEY_DATA: JourneySection[] = [
  {
    id: "origin",
    title: "Oeeeek!",
    subtitle: "Welp, it's a boy!",
    year: "2000 - 2008",
    description:
      "Born in a Chinese Indonesian family 2 years after Indonesian 1998 riot, in Palembang, South Sumatra, Indonesia and moved to Pangkalpinang a city in Bangka Belitung Island, Indonesia",
    details: [
      "Grew up in a multicultural household",
      "Middle child of 3 siblings",
      "Beach boyo!",
    ],
    image: "/images/journey/origin.png",
    color: "from-amber-500/20 via-orange-500/10",
    accent: "#f59e0b",
    animationClass: "animate-journey-jump",
  },
  {
    id: "quaky",
    title: "Wait, whats that shaking?",
    subtitle: "We go bouncy bounce!",
    year: "2008 - 2009",
    description:
      "Moved to Padang, West Sumatera following my dad's transfer of duty. Experiencing series of earthquake around the year with the finale of 30 September 2009 earthquake.",
    details: [
      "0/10 experience, not recommended",
      "Changed my perspective of life around 7.6 magnitude",
      "God protected us tho, 100/10",
    ],
    image: "/images/journey/quaky.png",
    color: "from-red-500/20 via-rose-500/10",
    accent: "#ef4444",
    animationClass: "animate-journey-shake",
  },
  {
    id: "school",
    title: "Loop-de-loop and pull!",
    subtitle: "Mundane school routine, missed how simple things used to be.",
    year: "2009 – 2017",
    description:
      "Moved back to Palembang after that earthquake and finished my elementary, junior high and high school there",
    details: [
      "Found out about Jesus from my mom and friend in junior high",
      "Served in youth church",
      "Pretty normal, got lots of friends",
      "Games > study",
    ],
    image: "/images/journey/school.png",
    color: "from-blue-500/20 via-cyan-500/10",
    accent: "#3b82f6",
    animationClass: "animate-journey-typing",
  },
  {
    id: "university",
    title: "FREEDOM! RAHHH!",
    subtitle: "Bina Nusantara University",
    year: "2017 – 2021",
    description:
      "To be honest I choose Computer Science since its popular and I still don't know what to do with my future at that point of life. Still 10/10 and its pretty awesome.",
    details: [
      "Bachelor of Computer Science — GPA 3.25/4.00 *booo, I know",
      "Found out about 'React' through internship as a mobile developer in Maybank Finance using React Native",
      "Create my own app using React Native without the help of AI, its suck but its an honest work",
      "Graduated ready (or not) for the industry",
    ],
    image: "/images/journey/university.png",
    color: "from-purple-500/20 via-violet-500/10",
    accent: "#8b5cf6",
    animationClass: "animate-journey-flying",
  },
  {
    id: "career",
    title: "Wait, that's it?",
    subtitle: "Is this real life? Is this just fantasy?",
    year: "2021 – Present",
    description:
      "Start to thinking what am I going to do with my future and what steps should I take more seriously",
    details: [
      "Secured my first full-time role as a Frontend developer at Olympic Furniture Group.",
      "Gained hands-on experience with modern tech stacks and agile methodologies.",
      "Learn a lot from colleagues and leaders from various sectors and background.",
      "Money, money, money. -Mr. Crab",
    ],
    image: "/images/journey/early-career.png",
    color: "from-green-500/20 via-emerald-500/10",
    accent: "#10b981",
    animationClass: "animate-journey-zoom",
  },
];

/* ─────────────────────────────────────────────────────────
 *  Corridor Experience Component
 * ───────────────────────────────────────────────────────── */

export default function JourneyClient() {
  const dict = useDict();
  const router = useRouter();
  const pathname = usePathname();
  const lang = pathname.split("/")[1] || "en";

  /* ── State ── */
  const [revealed, setRevealed] = useState(false);
  const [contentReady, setContentReady] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [displayedSection, setDisplayedSection] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const corridorRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);

  /* ── Fade-in from white (continuing the door zoom transition) ── */
  useEffect(() => {
    // Start fading the white overlay
    const t1 = setTimeout(() => setRevealed(true), 100);
    // Only show content AFTER the white overlay has fully faded out (700ms transition)
    const t2 = setTimeout(() => setContentReady(true), 900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  /* ── Navigate sections ── */
  const goToSection = useCallback(
    (index: number) => {
      if (isTransitioning || index < 0 || index >= JOURNEY_DATA.length) return;
      setIsTransitioning(true);
      setActiveSection(index); // Background and progress update immediately

      // Halfway through (300ms), swap the content while it's invisible
      setTimeout(() => {
        setDisplayedSection(index);
      }, 300);

      // Finish transition after 600ms
      setTimeout(() => setIsTransitioning(false), 600);
    },
    [isTransitioning],
  );

  /* ── Wheel handler for corridor scrolling ── */
  useEffect(() => {
    let wheelAccumulator = 0;
    const threshold = 80;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      wheelAccumulator += e.deltaY;

      if (Math.abs(wheelAccumulator) > threshold) {
        if (wheelAccumulator > 0) {
          goToSection(activeSection + 1);
        } else {
          goToSection(activeSection - 1);
        }
        wheelAccumulator = 0;
      }
    };

    const el = corridorRef.current;
    if (el) {
      el.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (el) el.removeEventListener("wheel", handleWheel);
    };
  }, [activeSection, goToSection]);

  /* ── Touch support ── */
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const diff = touchStartX.current - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 60) {
        if (diff > 0) goToSection(activeSection + 1);
        else goToSection(activeSection - 1);
      }
    };

    const el = corridorRef.current;
    if (el) {
      el.addEventListener("touchstart", handleTouchStart, { passive: true });
      el.addEventListener("touchend", handleTouchEnd, { passive: true });
    }

    return () => {
      if (el) {
        el.removeEventListener("touchstart", handleTouchStart);
        el.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, [activeSection, goToSection]);

  /* ── Keyboard support ── */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        goToSection(activeSection + 1);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        goToSection(activeSection - 1);
      } else if (e.key === "Escape") {
        window.location.href = `/${lang}`;
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeSection, goToSection, router, lang]);

  const activeConfig = JOURNEY_DATA[activeSection];
  const displayConfig = JOURNEY_DATA[displayedSection];
  const progress = ((activeSection + 1) / JOURNEY_DATA.length) * 100;

  return (
    <>
      {/* Fade-in overlay from white */}
      <div
        className={`fixed inset-0 z-[100] bg-white pointer-events-none transition-opacity duration-700 ${
          revealed ? "opacity-0" : "opacity-100"
        }`}
      />

      <div
        ref={corridorRef}
        className="fixed inset-0 bg-[#0a0a0f] text-white overflow-hidden select-none transition-opacity duration-700"
        style={{
          cursor: isTransitioning ? "wait" : "default",
          opacity: contentReady ? 1 : 0,
        }}
      >
        {/* ── Corridor Perspective Container ── */}
        <div className="absolute inset-0 perspective-[1200px]">
          {/* Corridor walls — animated perspective lines */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Floor */}
            <div
              className="absolute bottom-0 left-0 right-0 h-[45%] origin-bottom transition-transform duration-700"
              style={{
                background: `linear-gradient(to top, #0d0d15 0%, #12121f 40%, transparent 100%)`,
                transform: `perspective(600px) rotateX(35deg) translateZ(${activeSection * -20}px)`,
              }}
            >
              {/* Floor grid lines */}
              <div className="absolute inset-0 opacity-20">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute h-px bg-gradient-to-r from-transparent via-white/30 to-transparent transition-all duration-700"
                    style={{
                      top: `${(i + 1) * 8}%`,
                      left: "10%",
                      right: "10%",
                      opacity: 0.15 + i * 0.04,
                      transform: `translateY(${activeSection * -3}px)`,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Ceiling */}
            <div
              className="absolute top-0 left-0 right-0 h-[30%] origin-top transition-transform duration-700"
              style={{
                background: `linear-gradient(to bottom, #08080e 0%, #0d0d18 40%, transparent 100%)`,
                transform: `perspective(600px) rotateX(-25deg)`,
              }}
            />

            {/* Left wall */}
            <div
              className="absolute left-0 top-0 bottom-0 w-[20%] transition-all duration-700"
              style={{
                background: `linear-gradient(to right, #0a0a12 0%, transparent 100%)`,
                transform: `perspective(400px) rotateY(8deg)`,
              }}
            />

            {/* Right wall */}
            <div
              className="absolute right-0 top-0 bottom-0 w-[20%] transition-all duration-700"
              style={{
                background: `linear-gradient(to left, #0a0a12 0%, transparent 100%)`,
                transform: `perspective(400px) rotateY(-8deg)`,
              }}
            />
          </div>

          {/* Ambient lights on walls */}
          <div
            className="absolute top-[15%] left-[8%] w-32 h-48 rounded-full blur-[60px] transition-colors duration-700 opacity-30"
            style={{ backgroundColor: activeConfig.accent }}
          />
          <div
            className="absolute top-[20%] right-[8%] w-28 h-40 rounded-full blur-[50px] transition-colors duration-700 opacity-20"
            style={{ backgroundColor: activeConfig.accent }}
          />
        </div>

        {/* ── Main Content — Frame on the Wall ── */}
        <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-12 pt-24 pb-24 lg:py-0 pointer-events-none">
          <div
            className="w-full max-w-5xl flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-16 transition-all duration-300 pointer-events-auto h-full lg:h-auto"
            style={{
              opacity: isTransitioning ? 0 : 1,
              transform: isTransitioning
                ? "translateZ(-100px) scale(0.95)"
                : "translateZ(0) scale(1)",
            }}
          >
            {/* Frame / Image — Left side */}
            <div className="relative w-full max-w-[260px] sm:max-w-sm lg:max-w-md shrink-0 mt-auto lg:mt-0">
              {/* Frame border with glow */}
              <div
                className="absolute -inset-3 rounded-2xl opacity-40 blur-xl transition-colors duration-300"
                style={{
                  background: `radial-gradient(ellipse, ${displayConfig.accent}40, transparent 70%)`,
                }}
              />

              {/* The actual framed image */}
              <div
                className={`relative rounded-xl overflow-hidden border-2 border-white/10 shadow-2xl aspect-[4/3] bg-black/50 ${displayConfig.animationClass}`}
              >
                <Image
                  src={displayConfig.image}
                  alt={displayConfig.title}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 400px"
                />

                {/* Frame overlay effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                {/* Year badge on frame */}
                <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 px-3 py-1.5 sm:px-4 sm:py-2 bg-black/70 backdrop-blur-md rounded-lg border border-white/10">
                  <span
                    className="text-xs sm:text-sm font-bold tracking-widest"
                    style={{ color: displayConfig.accent }}
                  >
                    {displayConfig.year}
                  </span>
                </div>
              </div>
            </div>

            {/* Text Content — Right side */}
            <div className="flex-1 text-center lg:text-left overflow-y-auto overflow-x-hidden max-h-[35vh] lg:max-h-none lg:overflow-visible pr-2 sm:pr-0 mb-auto lg:mb-0 w-full [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full">
              {/* Section number */}
              <div className="mb-3 sm:mb-4 flex items-center gap-3 justify-center lg:justify-start">
                <span
                  className="text-[10px] sm:text-xs font-bold tracking-[0.3em] uppercase transition-colors duration-300"
                  style={{ color: displayConfig.accent }}
                >
                  Chapter {displayedSection + 1}
                </span>
                <div
                  className="h-px w-8 sm:w-12 transition-colors duration-300"
                  style={{ backgroundColor: displayConfig.accent }}
                />
              </div>

              {/* Title */}
              <h1
                className={`text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 tracking-tight leading-tight ${displayConfig.animationClass}`}
              >
                {displayConfig.title}
              </h1>

              {/* Subtitle */}
              <h2
                className="text-base sm:text-xl md:text-2xl font-medium mb-4 sm:mb-6 transition-colors duration-300"
                style={{ color: displayConfig.accent }}
              >
                {displayConfig.subtitle}
              </h2>

              {/* Description */}
              <p className="text-xs sm:text-base text-zinc-300/90 leading-relaxed mb-6 sm:mb-8 max-w-xl mx-auto lg:mx-0">
                {displayConfig.description}
              </p>

              {/* Details list */}
              <ul className="space-y-2 sm:space-y-3 max-w-xl mx-auto lg:mx-0 pb-4 lg:pb-0">
                {displayConfig.details.map((detail, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm text-zinc-400 text-left"
                    style={{
                      opacity: isTransitioning ? 0 : 1,
                      transform: isTransitioning
                        ? "translateX(20px)"
                        : "translateX(0)",
                      transition: `all 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + i * 0.05}s`,
                    }}
                  >
                    <span
                      className="mt-1 sm:mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 transition-colors duration-300"
                      style={{ backgroundColor: displayConfig.accent }}
                    />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ── Navigation Controls ── */}

        {/* Progress bar at top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/5 z-20 pointer-events-none">
          <div
            className="h-full transition-all duration-700 ease-out"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(to right, ${activeConfig.accent}, ${activeConfig.accent}80)`,
            }}
          />
        </div>

        {/* Return to Home */}
        <button
          onClick={() => (window.location.href = `/${lang}`)}
          className="absolute top-6 left-6 z-20 group flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-all duration-300 text-sm pointer-events-auto cursor-pointer"
        >
          <ArrowLeft
            size={16}
            className="transform group-hover:-translate-x-1 transition-transform duration-300"
          />
          <span className="font-medium">Return to Home</span>
        </button>

        {/* Left / Right arrows */}
        {activeSection > 0 && (
          <button
            onClick={() => goToSection(activeSection - 1)}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft size={24} />
          </button>
        )}
        {activeSection < JOURNEY_DATA.length - 1 && (
          <button
            onClick={() => goToSection(activeSection + 1)}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all duration-300 hover:scale-110"
          >
            <ChevronRight size={24} />
          </button>
        )}

        {/* Bottom hint */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
          <span className="text-[11px] text-zinc-600 tracking-widest uppercase animate-pulse">
            {activeSection < JOURNEY_DATA.length - 1
              ? "Scroll or swipe to continue"
              : "You've reached the end"}
          </span>

          {/* Progress indicator */}
          <div className="flex items-center gap-2 text-[11px] text-zinc-500">
            <span style={{ color: activeConfig.accent }}>
              {activeSection + 1}
            </span>
            <span>/</span>
            <span>{JOURNEY_DATA.length}</span>
          </div>
        </div>

        {/* ── Ambient particles ── */}
        <div className="absolute inset-0 pointer-events-none z-[5] overflow-hidden mix-blend-screen">
          {Array.from({ length: 80 }).map((_, i) => (
            <div
              key={`particle-${i}`}
              className="absolute rounded-full bg-white animate-float"
              style={{
                width: `${1 + (i % 3)}px`,
                height: `${1 + (i % 3)}px`,
                left: `${(i * 13) % 100}%`,
                top: `${(i * 19) % 100}%`,
                opacity: 0.1 + (i % 4) * 0.15,
                animationDelay: `${(i * 3) % 8}s`,
                animationDuration: `${20 + ((i * 7) % 25)}s`,
                boxShadow: `0 0 ${3 + (i % 4)}px rgba(255,255,255,0.6)`,
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}
