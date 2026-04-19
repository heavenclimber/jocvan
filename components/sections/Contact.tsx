"use client";

import SectionWrapper from "@/components/layout/SectionWrapper";
import { profile } from "@/data/profile";
import Button from "@/components/ui/Button";

export default function Contact() {
  return (
    <SectionWrapper id="contact" className="flex flex-col items-center justify-center text-center">
      <div className="gsap-animate mb-8">
        <p className="mb-2 text-sm font-medium tracking-widest text-cyan-400 uppercase">
          What&apos;s next?
        </p>
        <h2 className="text-4xl font-bold text-white sm:text-5xl">Get In Touch</h2>
      </div>

      <p className="gsap-animate mx-auto max-w-lg text-zinc-300 mb-10 leading-relaxed text-lg">
        Although I&apos;m not currently looking for any new opportunities, my inbox is always open. Whether you have a question or just want to say hi, I&apos;ll try my best to get back to you!
      </p>

      <div className="gsap-animate">
        <Button href={`mailto:${profile.email}`} variant="primary">
          Say Hello
        </Button>
      </div>

      <div className="gsap-animate mt-20 flex gap-6">
        {profile.socials.map((s) => (
          <a key={s.platform} href={s.url} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-cyan-400 transition-colors cursor-pointer">
            {s.platform}
          </a>
        ))}
      </div>
    </SectionWrapper>
  );
}
