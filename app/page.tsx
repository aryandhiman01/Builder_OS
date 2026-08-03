import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Stats from "@/components/landing/Stats";
import Features from "@/components/landing/Features";
import Workflow from "@/components/landing/Workflow";
import Pricing from "@/components/landing/Pricing";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#060606]">
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <Workflow />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  );
}