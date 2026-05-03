"use client";

import React, { useRef } from "react";
import SectionWrapper from "@/components/layout/SectionWrapper";
import { profile } from "@/data/profile";
import { Mail, Phone } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { useDict } from "@/lib/DictContext";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export default function Contact() {
  const dict = useDict();
  const cardRef = useRef<HTMLDivElement>(null);

  // Motion values for the 3D tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for a fluid tilt
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  // Rotate axes based on mouse position
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Normalize coordinates to [-0.5, 0.5]
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <SectionWrapper
      id="contact"
      noBackground
      className="flex flex-col items-center justify-center px-4"
    >
      <div className="gsap-animate mb-6 text-center">
        <p className="mb-2 text-sm font-medium tracking-widest text-blue-400 uppercase">
          {dict.contact.eyebrow}
        </p>
      </div>

      <div style={{ perspective: 1200 }} className="w-full flex justify-center">
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          animate={{
            y: [0, -10, 0], // Floating animation
          }}
          transition={{
            y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          }}
          className="gsap-animate relative w-full max-w-3xl rounded-2xl p-8 sm:p-12 border border-white/20 bg-gradient-to-br from-[#000814]/90 to-[#1e3a8a]/30 backdrop-blur-xl shadow-[0_30px_60px_-15px_rgba(30,58,138,0.5)] flex flex-col sm:flex-row gap-8 items-center sm:items-start justify-between animate-shiny"
        >
          {/* Left Side: Branding / Intro */}
          <div 
            className="flex flex-col items-center sm:items-start text-center sm:text-left flex-1 h-full justify-center mt-2 sm:mt-0"
            style={{ transform: "translateZ(30px)" }} // Pop out effect
          >
            <h2 className="text-3xl font-bold text-white sm:text-4xl mb-2 tracking-tight">
              {profile.name}
            </h2>
            <p className="text-blue-400 font-semibold text-lg mb-6 tracking-wide">
              {profile.title}
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm max-w-[280px]">
              {dict.contact.body}
            </p>
          </div>

          {/* Vertical Divider (Desktop) */}
          <div 
            className="hidden sm:block w-px h-48 bg-gradient-to-b from-transparent via-white/20 to-transparent self-center"
            style={{ transform: "translateZ(10px)" }}
          ></div>
          {/* Horizontal Divider (Mobile) */}
          <div className="block sm:hidden h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

          {/* Right Side: Links */}
          <div 
            className="flex flex-col items-start gap-4 text-zinc-300 w-full sm:w-auto"
            style={{ transform: "translateZ(40px)" }} // Pop out even more
          >
            <a
              href="mailto:jcjo92@gmail.com"
              className="flex items-center gap-4 hover:text-blue-400 transition-colors text-sm sm:text-base font-medium w-full group"
            >
              <div className="p-2.5 rounded-full bg-white/5 border border-white/10 group-hover:bg-blue-500/20 group-hover:border-blue-400/50 transition-all duration-300">
                <Mail size={16} />
              </div>
              jcjo92@gmail.com
            </a>
            <a
              href="mailto:jovanmaurel@gmail.com"
              className="flex items-center gap-4 hover:text-blue-400 transition-colors text-sm sm:text-base font-medium w-full group"
            >
              <div className="p-2.5 rounded-full bg-white/5 border border-white/10 group-hover:bg-blue-500/20 group-hover:border-blue-400/50 transition-all duration-300">
                <Mail size={16} />
              </div>
              jovanmaurel@gmail.com
            </a>
            <a
              href="https://wa.me/6282297472843"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 hover:text-blue-400 transition-colors text-sm sm:text-base font-medium w-full group"
            >
              <div className="p-2.5 rounded-full bg-white/5 border border-white/10 group-hover:bg-blue-500/20 group-hover:border-blue-400/50 transition-all duration-300">
                <Phone size={16} />
              </div>
              +62 822 9747 2843
            </a>
            <a
              href="https://github.com/heavenclimber"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 hover:text-blue-400 transition-colors text-sm sm:text-base font-medium w-full group"
            >
              <div className="p-2.5 rounded-full bg-white/5 border border-white/10 group-hover:bg-blue-500/20 group-hover:border-blue-400/50 transition-all duration-300">
                <FaGithub size={16} />
              </div>
              github.com/heavenclimber
            </a>
            <a
              href="https://www.linkedin.com/in/jovanbastian/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 hover:text-blue-400 transition-colors text-sm sm:text-base font-medium w-full group"
            >
              <div className="p-2.5 rounded-full bg-white/5 border border-white/10 group-hover:bg-blue-500/20 group-hover:border-blue-400/50 transition-all duration-300">
                <FaLinkedin size={16} />
              </div>
              linkedin.com/in/jovanbastian
            </a>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
