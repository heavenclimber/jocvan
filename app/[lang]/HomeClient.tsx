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

export default function HomeClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const { background } = useBackground();

  /* ── Lock body scroll while preloader is active ── */
  useEffect(() => {
    if (!loaded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
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

  useGSAP(() => {
    if (!loaded) return;
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
                start: "left 80%", // Trigger when left edge is 80% across the screen
                end: "right 20%",  // Reverse when right edge is 20% across the screen
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

        // ── Expose global section navigator for Navbar ──
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
  }, [loaded]);

  useEffect(() => {
    return () => {
      delete (window as any).__navigateToSection;
    };
  }, []);

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
        <div
          ref={containerRef}
          className="flex h-screen gap-12 sm:gap-24 pr-8 sm:pr-24"
          style={{ width: "max-content" }}
        >
          <section
            id="hero"
            className="horizontal-panel w-screen h-screen flex-shrink-0 overflow-hidden flex items-center justify-center relative py-6"
          >
            <Hero loaded={loaded} />
          </section>
          <section
            id="about"
            className="horizontal-panel w-screen h-screen flex-shrink-0 overflow-hidden flex items-center relative py-6 px-8 sm:px-0"
          >
            <About />
          </section>
          <section
            id="education"
            className="horizontal-panel w-screen h-screen flex-shrink-0 overflow-hidden flex items-center relative py-6 px-8 sm:px-0"
          >
            <Education />
          </section>
          <section
            id="skills"
            className="horizontal-panel w-screen h-screen flex-shrink-0 overflow-hidden flex items-center relative py-6 px-8 sm:px-0"
          >
            <Skills />
          </section>
          <section
            id="experience"
            className="horizontal-panel w-screen h-screen flex-shrink-0 overflow-hidden flex items-center relative py-6 px-8 sm:px-0"
          >
            <Experience />
          </section>
          <section
            id="portfolio"
            className="horizontal-panel w-screen h-screen flex-shrink-0 overflow-hidden flex items-center relative py-6 px-8 sm:px-0"
          >
            <Portfolio />
          </section>
          <section
            id="contact"
            className="horizontal-panel w-screen h-screen flex-shrink-0 overflow-hidden flex items-center relative py-6 px-8 sm:px-0"
          >
            <Contact />
          </section>
        </div>
      </main>
    </>
  );
}

