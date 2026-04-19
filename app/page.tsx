"use client";

import { useEffect, useRef } from "react";
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

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!wrapperRef.current || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const init = () => {
        const sections = gsap.utils.toArray<HTMLElement>(".horizontal-panel");

        if (!sections.length) return;

        const totalWidth = containerRef.current!.scrollWidth;

        // Animate the container instead of individual sections to properly support gaps
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
              start: "left center",
              toggleActions: "play none none reverse",
            },
          });
        });

        ScrollTrigger.refresh();
      };

      // 🔥 DOUBLE RAF (this is the magic)
      requestAnimationFrame(() => {
        requestAnimationFrame(init);
      });
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const handleLoad = () => ScrollTrigger.refresh();

    return () => window.removeEventListener("load", handleLoad);
  }, []);

  return (
    <main className="relative w-full bg-transparent" ref={wrapperRef}>
      <VantaBackground />
      <div
        ref={containerRef}
        className="flex h-screen gap-12 sm:gap-24 px-8 sm:px-24"
        style={{ width: "max-content" }}
      >
        <section className="horizontal-panel w-screen h-screen flex-shrink-0 overflow-hidden flex items-center relative py-6">
          <Hero />
        </section>
        <section className="horizontal-panel w-screen h-screen flex-shrink-0 overflow-hidden flex items-center relative py-6">
          <About />
        </section>
        <section className="horizontal-panel w-screen h-screen flex-shrink-0 overflow-hidden flex items-center relative py-6">
          <Education />
        </section>
        <section className="horizontal-panel w-screen h-screen flex-shrink-0 overflow-hidden flex items-center relative py-6">
          <Skills />
        </section>
        <section className="horizontal-panel w-screen h-screen flex-shrink-0 overflow-hidden flex items-center relative py-6">
          <Experience />
        </section>
        <section className="horizontal-panel w-screen h-screen flex-shrink-0 overflow-hidden flex items-center relative py-6">
          <Portfolio />
        </section>
        <section className="horizontal-panel w-screen h-screen flex-shrink-0 overflow-hidden flex items-center relative py-6">
          <Contact />
        </section>
      </div>
    </main>
  );
}
