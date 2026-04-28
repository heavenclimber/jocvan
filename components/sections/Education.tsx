"use client";

import dynamic from "next/dynamic";
import { education } from "@/data/education";
import SectionWrapper from "@/components/layout/SectionWrapper";
import { useDict } from "@/lib/DictContext";
import { GraduationCap, MapPin, CalendarDays } from "lucide-react";

// Dynamic import for R3F Scene to prevent SSR issues
const EducationScene = dynamic(() => import("@/components/canvas/EducationScene"), {
  ssr: false,
});

export default function Education() {
  const dict = useDict();
  const binus = education.find(e => e.id === "binus") || education[0];

  return (
    <SectionWrapper id="education" className="relative flex flex-col justify-center overflow-hidden">
      {/* 3D Background */}
      <EducationScene />

      {/* Content Overlay */}
      <div className="relative z-10 w-full h-full flex items-center">
        
        {/* Left Side: Empty space to let 3D shine (on desktop) */}
        <div className="hidden lg:block lg:w-1/2"></div>
        
        {/* Right Side: Glassmorphic Content Card */}
        <div className="w-full lg:w-1/2 flex flex-col gap-8">
          
          <div className="gsap-animate">
            <p className="mb-2 text-sm font-medium tracking-widest text-blue-400 uppercase flex items-center gap-2">
              <GraduationCap size={18} />
              {dict.education.eyebrow}
            </p>
            <h2 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl tracking-tight">
              {dict.education.heading}
            </h2>
          </div>

          <div className="gsap-animate relative p-8 sm:p-10 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-md shadow-2xl overflow-hidden group hover:border-blue-500/30 transition-colors duration-500">
            {/* Subtle glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10 flex flex-col gap-6">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">
                  {binus.degree}
                </h3>
                <h4 className="text-xl sm:text-2xl font-medium text-blue-400">
                  {binus.institution}
                </h4>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-zinc-400">
                <div className="flex items-center gap-2">
                  <CalendarDays size={18} className="text-blue-500" />
                  <span className="font-medium">{binus.startDate} — {binus.endDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-blue-500" />
                  <span className="font-medium">{binus.location}</span>
                </div>
              </div>

              <div className="h-px w-full bg-gradient-to-r from-white/20 to-transparent my-2" />

              <p className="text-lg text-zinc-300 leading-relaxed font-light">
                {binus.description}
              </p>

              {binus.gpa && (
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs font-semibold tracking-widest text-blue-400 uppercase">GPA</span>
                  <span className="text-lg font-bold text-white">{binus.gpa}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
