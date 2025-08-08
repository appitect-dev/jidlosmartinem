import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Services />
      <About />
      <Testimonials />
      {/* <CTA /> */}
      <Footer />
    </div>
  );
}
