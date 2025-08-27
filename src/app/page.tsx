import Hero from "@/components/Hero";
import ProblemSection from "@/components/ProblemSection";
import About from "@/components/About";
import ProofSection from "@/components/ProofSection";
import ConsultationSection from "@/components/ConsultationSection";
import FAQSection from "@/components/FAQSection";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <ProblemSection />
      <About />
      {/* <ProofSection /> */}
      <ConsultationSection />
      <FAQSection />
      <FinalCTA />
      <Footer />
    </div>
  );
}
