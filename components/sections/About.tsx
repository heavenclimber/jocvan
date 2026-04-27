"use client";

import { profile } from "@/data/profile";
import SectionWrapper from "@/components/layout/SectionWrapper";
import Badge from "@/components/ui/Badge";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import BabyDog from "@/components/canvas/BabyDog";
import { useDict } from "@/lib/DictContext";

export default function About() {
  const dict = useDict();
  const facts = [
    { label: dict.about.location, value: profile.location },
    { label: dict.about.email, value: profile.email },
    { label: dict.about.languages, value: profile.languages.join(", ") },
  ];

  return (
    <SectionWrapper id="about">
      {/* Section Heading */}
      <div className="gsap-animate mb-12">
        <p className="mb-1 text-sm font-medium tracking-widest text-blue-400 uppercase">
          {dict.about.eyebrow}
        </p>
        <h2 className="text-3xl font-bold text-white sm:text-4xl">{dict.about.heading}</h2>
      </div>

      <div className="grid items-start gap-12 md:grid-cols-5">
        {/* Avatar */}
        <div className="gsap-animate flex justify-center md:col-span-2">
          <div className="relative">
            <div className="absolute -inset-1 rounded-3xl bg-linear-to-br from-blue-500/40 to-sky-400/40 blur-xl opacity-50" />

            <div className="relative h-64 w-64 overflow-hidden rounded-3xl border border-white/20 bg-white/5 backdrop-blur-3xl sm:h-72 sm:w-72 shadow-[0_8px_32px_0_rgba(255,255,255,0.05)] cursor-pointer">
              {/* Placeholder avatar — replace with next/image once you add your photo */}
              <div className="h-full w-full">
                <Canvas camera={{ position: [0, 4, 8], fov: 50 }}>
                  <ambientLight intensity={0.6} />
                  <directionalLight position={[5, 5, 5]} intensity={1} />

                  <Suspense fallback={null}>
                    <BabyDog position={[0, 0, 0]} scale={0.04} />
                  </Suspense>

                  <OrbitControls
                    target={[0, 1, 0]}
                    enableZoom={false}
                    enablePan={false}
                  />
                </Canvas>
              </div>
            </div>
          </div>
        </div>

        {/* Bio & Facts */}
        <div className="space-y-6 md:col-span-3">
          {profile.bio.map((paragraph, i) => (
            <p key={i} className="gsap-animate leading-relaxed text-zinc-300">
              {paragraph}
            </p>
          ))}

          {/* Quick Facts */}
          <div className="grid gap-3 sm:grid-cols-3">
            {facts.map((f) => (
              <div
                key={f.label}
                className="gsap-animate rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 shadow-lg"
              >
                <p className="mb-1 text-xs text-zinc-400 uppercase">
                  {f.label}
                </p>
                <p className="text-sm font-medium text-white">{f.value}</p>
              </div>
            ))}
          </div>

          {/* Social Links */}
          <div className="gsap-animate flex flex-wrap gap-2">
            {profile.socials.map((s) => (
              <a
                key={s.platform}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Badge>{s.platform}</Badge>
              </a>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
