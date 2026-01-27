import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import DetailsSection from "@/components/DetailsSection";
import TracksSection from "@/components/TracksSection";
import ScheduleSection from "@/components/ScheduleSection";
import SponsorsSection from "@/components/SponsorsSection";
import FAQSection from "@/components/FAQSection";
import CountdownTimer from "@/components/CountdownTimer";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="text-foreground overflow-x-hidden">
      {/* <Navbar /> */}
      <HeroSection />
      <AboutSection />
      <DetailsSection />
      <TracksSection />
      {/* <ScheduleSection /> */}
      <CountdownTimer />
      {/* <SponsorsSection /> */}
      {/* <FAQSection /> */}
      <Footer />
    </main>
  );
};

export default Index;
