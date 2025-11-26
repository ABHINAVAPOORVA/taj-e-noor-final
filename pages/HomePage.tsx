import { Header } from "../components/Header";
import { HeroSection } from "../components/HeroSection";
import { OffersSection } from "../components/OffersSection";
import { TestimonialsSection } from "../components/TestimonialsSection";
import { ContactSection } from "../components/ContactSection";
import { Footer } from "../components/Footer";

export function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <OffersSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
