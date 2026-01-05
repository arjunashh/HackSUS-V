import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden scanlines pt-16 pb-30">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent" />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/50 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Geometric corner decorations */}
      <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-primary/30" />
      <div className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-primary/30" />
      <div className="absolute bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-primary/30" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-primary/30" />

      <div className="container relative z-10 px-6 text-center">
        {/* Main title with layered glitch effect */}
        <h1
          className="glitch-text font-tanNimbus text-5xl sm:text-6xl md:text-7xl lg:text-[6.5rem] text-foreground leading-none tracking-wider mb-2 animate-fade-in mix-blend-screen select-none"
          data-text="HACKS'US"
          style={{ animationDelay: "0.4s" }}
        >
          HACK<span className="accent">S'US</span>
        </h1>

        {/* Edition image */}
        <div className="relative mb-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <img
            src="/images/EditionV-Ribbon.png"
            alt="Edition V"
            className="mx-auto w-48 sm:w-56 md:w-64 lg:w-72"
          />
        </div>

        {/* Tagline */}
        <p
          className="font-body text-xl md:text-2xl text-muted-foreground mb-2 animate-fade-in"
          style={{ animationDelay: "0.6s" }}
        >
          India's First Multi Tarck AI-Workflow Hackathon
        </p>

        {/* Date */}
        <p
          className="font-mono text-lg text-primary mb-12 animate-fade-in"
          style={{ animationDelay: "0.8s" }}
        >
          MARCH 6-7, 2026
          MARCH 6-8, 2026
        </p>

        {/* CTA Button */}
        <div className="animate-fade-in" style={{ animationDelay: "1s" }}>
          <Button variant="hero" size="xl">
            <span className="relative z-10">Pre-Register Now</span>
          </Button>
        </div>

        {/* Stats preview */}
        <div
          className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto animate-fade-in"
          style={{ animationDelay: "1.2s" }}
        >
          {[
            { value: "42", label: "HOURS" },
            { value: "42", label: "HOURS" },
            { value: "500+", label: "HACKERS" },
            { value: "₹5 Lakhs+", label: "IN PRIZES" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="font-display text-4xl md:text-5xl text-primary">{stat.value}</div>
              <div className="font-mono text-xs text-muted-foreground tracking-widest mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator
      <a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-primary transition-colors animate-bounce"
        aria-label="Scroll to content"
      >
        <ChevronDown size={32} />
      </a> */}
    </section>
  );
};

export default HeroSection;
