"use client";

import { profile } from "@/data/profile";
import Button from "@/components/ui/Button";
import SectionWrapper from "@/components/layout/SectionWrapper";

export default function Hero() {
  return (
    <SectionWrapper
      id="hero"
      noBackground
      className="flex flex-col items-center justify-center text-center"
    >
      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 my-auto">
        <div className="gsap-animate mb-4 text-sm font-bold tracking-widest text-cyan-400 uppercase drop-shadow-md">
          Hello, I&apos;m
        </div>

        <h1 className="gsap-animate mb-4 bg-gradient-to-r from-zinc-100 via-zinc-200 to-white bg-clip-text text-5xl leading-tight font-black tracking-tight text-transparent drop-shadow-md sm:text-7xl">
          {profile.name}
        </h1>

        <p className="gsap-animate mb-2 text-xl font-bold text-zinc-100 sm:text-2xl drop-shadow-sm">
          {profile.title}
        </p>

        <p className="gsap-animate mx-auto mb-10 max-w-lg text-base font-medium text-zinc-300 drop-shadow-sm">
          {profile.tagline}
        </p>

        <div className="gsap-animate flex flex-wrap items-center justify-center gap-4">
          <Button href="/resume.pdf" variant="primary">
            Download CV
          </Button>
          <Button href="#about" variant="outline">
            Get in Touch
          </Button>
        </div>
      </div>
    </SectionWrapper>
  );
}
