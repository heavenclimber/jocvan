"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Education from "@/components/sections/Education";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import Portfolio from "@/components/sections/Portfolio";
import Contact from "@/components/sections/Contact";
import VantaBackground from "@/components/canvas/VantaBackground";
import DotPattern from "@/components/canvas/DotPattern";
import Preloader from "@/components/ui/Preloader";
import { useBackground } from "@/lib/BackgroundContext";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ── Breakpoint must match Tailwind's `md` (768px) ── */
const MD_BREAKPOINT = 768;

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < MD_BREAKPOINT);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobile;
}

export default function HomeClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const { background } = useBackground();
  const isMobile = useIsMobile();

  /* ── Lock body scroll while preloader is active ── */
  useEffect(() => {
    if (!loaded) {
      document.body.style.position = "fixed";
      document.body.style.inset = "0";
      document.body.style.width = "100%";
    } else {
      document.body.style.position = "";
      document.body.style.inset = "";
      document.body.style.width = "";
    }
    return () => {
      document.body.style.position = "";
      document.body.style.inset = "";
      document.body.style.width = "";
    };
  }, [loaded]);

  /* ── Called when preloader finishes its reveal transition ── */
  const handlePreloaderComplete = useCallback(() => {
    setLoaded(true);

    // Animate the navbar in
    const navbar = document.querySelector("header");
    if (navbar) {
      gsap.fromTo(
        navbar,
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out", delay: 0.1 }
      );
    }

    // Animate main content wrapper in
    if (wrapperRef.current) {
      gsap.fromTo(
        wrapperRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: "power2.out", delay: 0.1 }
      );
    }
  }, []);

  /* ═══════════════════════════════════════════════════
   *  GSAP horizontal scroll — DESKTOP ONLY
   * ═══════════════════════════════════════════════════ */
  useGSAP(() => {
    if (!loaded || isMobile) return;
    if (!wrapperRef.current || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const init = () => {
        const sections = gsap.utils.toArray<HTMLElement>(".horizontal-panel");
        if (!sections.length) return;

        const scrollTween = gsap.to(containerRef.current, {
          x: () => -(containerRef.current!.scrollWidth - window.innerWidth),
          ease: "none",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top top",
            end: () => "+=" + containerRef.current!.scrollWidth,
            pin: true,
            pinSpacing: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        sections.forEach((section) => {
          // 1. Animate the entire section wrapper (fade and scale)
          const innerWrapper = section.children[0];
          if (innerWrapper) {
            gsap.from(innerWrapper, {
              opacity: 0,
              scale: 0.85,
              duration: 1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: section,
                containerAnimation: scrollTween,
                start: "left 80%",
                end: "right 20%",
                toggleActions: "play reverse play reverse",
              },
            });
          }

          // 2. Animate specific internal elements for a staggered effect
          const q = gsap.utils.selector(section);
          gsap.from(q(".gsap-animate"), {
            y: 50,
            opacity: 0,
            stagger: 0.1,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              containerAnimation: scrollTween,
              start: "left 75%",
              end: "right 25%",
              toggleActions: "play reverse play reverse",
            },
          });
        });

        // ── Expose global section navigator for Navbar (desktop) ──
        const navigate = (index: number) => {
          if (!containerRef.current) return;
          const panels =
            containerRef.current.querySelectorAll(".horizontal-panel");
          const panel = panels[index] as HTMLElement | undefined;
          if (!panel) return;

          const containerScrollWidth = containerRef.current.scrollWidth;
          const maxTranslation = containerScrollWidth - window.innerWidth;
          if (maxTranslation <= 0) return;

          const panelX = panel.offsetLeft;
          const progress = Math.min(panelX / maxTranslation, 1);
          const targetScroll = progress * containerScrollWidth;
          window.scrollTo({ top: targetScroll, behavior: "smooth" });
        };

        (window as any).__navigateToSection = navigate;

        ScrollTrigger.refresh();
      };

      requestAnimationFrame(() => requestAnimationFrame(init));
    }, wrapperRef);

    return () => ctx.revert();
  }, [loaded, isMobile]);

  /* ═══════════════════════════════════════════════════
   *  GSAP vertical scroll-triggered animations — MOBILE ONLY
   * ═══════════════════════════════════════════════════ */
  useGSAP(() => {
    if (!loaded || !isMobile) return;
    if (!wrapperRef.current) return;

    const ctx = gsap.context(() => {
      const init = () => {
        // Simple scroll-in for each section on mobile
        const sections = gsap.utils.toArray<HTMLElement>(".vertical-section");
        sections.forEach((section) => {
          gsap.from(section, {
            y: 60,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          });

          // Also animate inner .gsap-animate elements
          const q = gsap.utils.selector(section);
          gsap.from(q(".gsap-animate"), {
            y: 40,
            opacity: 0,
            stagger: 0.08,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          });
        });

        // ── Mobile navigator: scroll to section by ID ──
        const navigate = (index: number) => {
          const sectionIds = [
            "hero", "about", "education", "skills",
            "experience", "portfolio", "contact",
          ];
          const id = sectionIds[index];
          if (!id) return;
          const el = document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        };

        (window as any).__navigateToSection = navigate;
      };

      requestAnimationFrame(() => requestAnimationFrame(init));
    }, wrapperRef);

    return () => ctx.revert();
  }, [loaded, isMobile]);

  useEffect(() => {
    return () => {
      delete (window as any).__navigateToSection;
    };
  }, []);

  /* ── Shared section class strings ── */
  const desktopPanelClass =
    "horizontal-panel w-screen h-dvh h-screen flex-shrink-0 overflow-hidden flex items-center relative py-4 sm:py-6";
  const mobileSectionClass =
    "vertical-section w-full min-h-dvh min-h-screen flex items-center relative py-8 px-4";

  /* ── Section data for DRY rendering ── */
  const sections = [
    { id: "hero", component: <Hero loaded={loaded} />, center: true },
    { id: "about", component: <About /> },
    { id: "education", component: <Education /> },
    { id: "skills", component: <Skills /> },
    { id: "experience", component: <Experience /> },
    { id: "portfolio", component: <Portfolio /> },
    { id: "contact", component: <Contact /> },
  ];

  return (
    <>
      {/* ── Preloader (overlays everything until done) ── */}
      {!loaded && <Preloader onComplete={handlePreloaderComplete} />}

      {/* ── Main content (hidden until loaded) ── */}
      <main
        className="relative w-full bg-transparent"
        ref={wrapperRef}
        style={{ opacity: loaded ? 1 : 0 }}
      >
        <div className="fixed inset-0 z-[-1] pointer-events-none">
          {background === "vanta-fog" && <VantaBackground type="fog" />}
          {background === "vanta-birds" && <VantaBackground type="birds" />}
          {background === "dot-pattern" && <DotPattern />}
        </div>

        {/* ═══ DESKTOP: Horizontal scroll layout ═══ */}
        {!isMobile && (
          <div
            ref={containerRef}
            className="flex h-dvh h-screen gap-24 pr-24"
            style={{ width: "max-content" }}
          >
            {sections.map((s) => (
              <section
                key={s.id}
                id={s.id}
                className={`${desktopPanelClass}${s.center ? " justify-center" : ""}`}
              >
                {s.component}
              </section>
            ))}
          </div>
        )}

        {/* ═══ MOBILE: Vertical scroll layout ═══ */}
        {isMobile && (
          <div ref={containerRef} className="flex flex-col">
            {sections.map((s) => (
              <section
                key={s.id}
                id={s.id}
                className={`${mobileSectionClass}${s.center ? " justify-center" : ""}`}
              >
                {s.component}
              </section>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
