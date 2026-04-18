import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Education from "@/components/sections/Education";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import Portfolio from "@/components/sections/Portfolio";
import Footer from "@/components/layout/Footer";
import BackgroundScene from "@/components/canvas/BackgroundScene";

export default function Home() {
  return (
    <main className="flex-1 relative">
      <BackgroundScene />
      <Hero />
      <About />
      <Education />
      <Skills />
      <Experience />
      <Portfolio />
      <Footer />
    </main>
  );
}
