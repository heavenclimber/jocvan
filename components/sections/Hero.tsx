"use client";

import { profile } from "@/data/profile";
import Button from "@/components/ui/Button";
import AnimatedName from "@/components/ui/AnimatedName";
import { useDict } from "@/lib/DictContext";

export default function Hero({ loaded = true }: { loaded?: boolean }) {
  const dict = useDict();

  return (
    <div className="flex h-full w-full items-center justify-center text-center">
      <div className="relative z-10 flex flex-col items-center px-6 max-w-4xl mx-auto">
        {/* Greeting */}
        <p className="gsap-animate mb-6 text-sm font-bold tracking-widest text-blue-400 uppercase drop-shadow-md">
          {dict.hero.greeting}
        </p>

        {/* Animated SVG Name */}
        <div className="gsap-animate mb-6 w-full max-w-xl" style={{ overflow: "visible" }}>
          <AnimatedName loaded={loaded} />
        </div>

        {/* Title */}
        <p className="gsap-animate mb-2 text-xl font-bold text-zinc-100 sm:text-2xl drop-shadow-sm">
          {profile.title}
        </p>

        {/* Tagline */}
        <p className="gsap-animate mx-auto mb-10 max-w-lg text-base font-medium text-zinc-300 drop-shadow-sm">
          {profile.tagline}
        </p>

        {/* CTA Buttons */}
        <div className="gsap-animate flex flex-wrap items-center justify-center gap-4">
          <Button href="/doc/Jovan_Maurel_Bastian.pdf" variant="primary">
            {dict.hero.downloadCV}
          </Button>
          <Button href="#contact" variant="outline">
            {dict.hero.getInTouch}
          </Button>
        </div>
      </div>
    </div>
  );
}
