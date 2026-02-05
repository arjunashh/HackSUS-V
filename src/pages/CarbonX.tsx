import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { ArrowRight, Menu } from "lucide-react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";
import ResponsiveParticles from "@/components/ResponsiveParticles";
import DecryptedText from "@/components/DecryptedText";
import ShinyText from "@/components/ShinyText";
import SpotlightCard from "@/components/SpotlightCard";
import TrueFocus from "@/components/TrueFocus";
import { useParticleTuning } from "@/hooks/useParticlesQuality";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const carbonX = {
  eventName: "CARBONX",
  year: "2026",
  tagline: "INNOVATION BEYOND BOUNDARIES",
  prizeAmount: "₹2,00,000",
  prizeCaption: "PRIZE POOL",
  description:
    "A 42 hour national hackathon where developers, innovators, and students from across India team up to build practical, high-impact solutions. The event brings together industry experts, mentors, and tech enthusiasts in a round-the-clock marathon of problem-solving, prototyping, and pure chaos-powered innovation.",
  date: "6–8 MARCH, 2026",
  city: "KOCHI",
  organizer:
    "Organized by Department of Electronics and Communication Engineering, Rajagiri School of Engineering & Technology (Autonomous)",
  registerUrls: {
    vegathon: "",
    electrothon: "",
  },
  stats: [
    { label: "DURATION", value: "42 hours" },
    { label: "PARTICIPANTS", value: "250+ expected" },
    { label: "VISITORS", value: "3000+ expected" },
  ],
  aboutLong:
    "CARBONX is the flagship hackathon initiative curated by the Department of Electronics and Communication Engineering, currently conducted as a dedicated track under Hacks’us, an innovation event organized by IEDC and IICRSET. CARBONX focuses on hardware-centric innovation, embedded systems, and electronics-driven problem solving, providing participants with a platform to design, prototype, and validate real-world engineering solutions. While hosted under Hacks’us for the present edition, CARBONX retains complete technical ownership by the department and is envisioned as an annual, independently conducted hackathon in the coming years. The initiative continues its collaboration with the Centre for Development of Advanced Computing (CDAC), reinforcing its emphasis on indigenous technology and deep-tech development.",
  historyLong:
    "CARBONX traces its origins back to 2022, when it was first launched as VEGATHON, a national-level hardware hackathon conducted by the Department of Electronics and Communication Engineering in collaboration with CDAC. VEGATHON 2022 was centered around the VEGA Processor, an indigenous processor architecture developed by CDAC, and was designed to promote hands-on learning, processor-level understanding, and system-based innovation. Building on the success and technical legacy of VEGATHON, the initiative was later rebranded as CARBON, with CARBONX introduced as its competitive hackathon format. This evolution reflects the department’s long-term vision of creating a sustained innovation ecosystem rooted in electronics and hardware excellence.",
} as const;

function useActiveSection(sectionIds: string[]) {
  const [active, setActive] = useState(sectionIds[0] ?? "");

  useEffect(() => {
    const items = sectionIds
      .map((id) => ({ id, el: document.getElementById(id) }))
      .filter((x): x is { id: string; el: HTMLElement } => Boolean(x.el));
    if (items.length === 0) return;

    let rafId = 0;
    const getNavOffset = () => {
      const header = document.querySelector(".landing-header") as HTMLElement | null;
      const headerHeight = header?.getBoundingClientRect().height ?? 0;
      return headerHeight + 12; // a bit of breathing room under the fixed header
    };

    const compute = () => {
      // Pick the section whose midpoint is closest to a "focus line" inside the viewport.
      // This makes the active underline feel immediate when scrolling up/down (no need to
      // wait for a section to hit the exact top).
      const focusY = getNavOffset() + window.innerHeight * 0.36;
      let bestId = items[0]?.id ?? "";
      let bestDist = Number.POSITIVE_INFINITY;

      for (const it of items) {
        const rect = it.el.getBoundingClientRect();
        const mid = rect.top + rect.height / 2;
        const dist = Math.abs(mid - focusY);
        if (dist < bestDist) {
          bestDist = dist;
          bestId = it.id;
        }
      }

      setActive((prev) => (prev === bestId ? prev : bestId));
    };

    const schedule = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        compute();
      });
    };

    compute();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [sectionIds]);

  return active;
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px 0px -20% 0px" }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="mb-10 md:mb-14"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          <span className="font-mono text-xs text-primary tracking-[0.34em] uppercase">
            // {eyebrow}
          </span>
          <h2 className="mt-4 font-display text-4xl md:text-5xl text-foreground tracking-wide">
            {title}
          </h2>
        </div>
        {description ? (
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed md:max-w-md">
            {description}
          </p>
        ) : null}
      </div>
    </motion.div>
  );
}

function GlassCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden rounded-none card-beveled border-border/70 bg-card/80 backdrop-blur-sm shadow-[0_14px_50px_rgba(0,0,0,0.38)]",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
      <div className="relative">{children}</div>
    </Card>
  );
}

function CarbonXNavbar({
  activeId,
  items,
  onNavigate,
}: {
  activeId: string;
  items: { id: string; label: string }[];
  onNavigate: (id: string) => void;
}) {
  const linksWrapRef = useRef<HTMLDivElement | null>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [mobileOpen, setMobileOpen] = useState(false);
  const [indicator, setIndicator] = useState<{ left: number; width: number; opacity: number }>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  const syncIndicator = useCallback(() => {
    const wrap = linksWrapRef.current;
    const activeEl = linkRefs.current[activeId];
    if (!wrap || !activeEl) return;

    const wrapRect = wrap.getBoundingClientRect();
    const linkRect = activeEl.getBoundingClientRect();
    setIndicator({
      left: linkRect.left - wrapRect.left,
      width: linkRect.width,
      opacity: 1,
    });
  }, [activeId]);

  useLayoutEffect(() => {
    syncIndicator();
  }, [syncIndicator, items]);

  useEffect(() => {
    const wrap = linksWrapRef.current;
    if (!wrap) return;

    const onResize = () => syncIndicator();
    window.addEventListener("resize", onResize, { passive: true });

    const ro = new ResizeObserver(() => syncIndicator());
    ro.observe(wrap);
    return () => {
      window.removeEventListener("resize", onResize);
      ro.disconnect();
    };
  }, [syncIndicator]);

  const navigateFromSheet = useCallback(
    (id: string) => {
      setMobileOpen(false);
      // Let Radix close animation + scroll locking settle before measuring scroll offset.
      window.setTimeout(() => onNavigate(id), 180);
    },
    [onNavigate],
  );

  return (
    <header className="landing-header w-full">
      <div className="landing-header-inner">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            onNavigate("top");
          }}
          className="font-mokoto tracking-[0.32em] text-[15px] text-foreground/90 hover:text-foreground transition-colors"
          aria-label="Go to top"
        >
          CARBONX
        </a>

        <div
          ref={linksWrapRef}
          className="relative hidden md:flex items-center gap-6"
        >
          <motion.div
            aria-hidden="true"
            className="absolute -bottom-2 h-0.5 w-px origin-left bg-primary shadow-[0_0_18px_hsl(var(--primary)/0.35)] will-change-[transform]"
            animate={{
              x: indicator.left,
              scaleX: indicator.width,
              opacity: indicator.opacity,
            }}
            transition={{ type: "spring", stiffness: 520, damping: 42, mass: 0.25 }}
          />
          {items.map((it) => (
            <a
              key={it.id}
              href={`#${it.id}`}
              ref={(el) => {
                linkRefs.current[it.id] = el;
              }}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(it.id);
              }}
              className={cn(
                "relative text-xs tracking-[0.28em] uppercase transition-colors",
                activeId === it.id
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {it.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => onNavigate("tracks")}
            className="landing-nav-cta hidden md:inline-flex rounded-xl px-6 h-9 shadow-[0_10px_30px_hsl(var(--primary)/0.18)]"
          >
            CHOOSE TRACK <ArrowRight className="ml-1" />
          </Button>

          <Button
            onClick={() => onNavigate("tracks")}
            className="landing-nav-cta md:hidden inline-flex rounded-xl px-4 h-9 shadow-[0_10px_30px_hsl(var(--primary)/0.18)]"
          >
            TRACKS <ArrowRight className="ml-1" />
          </Button>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="md:hidden h-9 w-9 rounded-xl border-border/60 bg-background/10 text-foreground/90 hover:bg-background/15 hover:text-foreground"
                aria-label="Open navigation menu"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-black/95 border-border/60 backdrop-blur-md px-6"
            >
              <div className="mt-10 flex flex-col gap-8">
                <div className="flex items-center justify-between">
                  <div className="font-mokoto tracking-[0.32em] text-[15px] text-foreground/90">
                    CARBONX
                  </div>
                </div>

                <nav className="flex flex-col gap-2">
                  {items.map((it) => (
                    <button
                      key={it.id}
                      type="button"
                      onClick={() => {
                        navigateFromSheet(it.id);
                      }}
                      className={cn(
                        "group flex items-center justify-between rounded-xl px-3 py-3 text-left transition-colors",
                        activeId === it.id
                          ? "bg-primary/10 text-foreground"
                          : "bg-background/0 text-muted-foreground hover:bg-background/10 hover:text-foreground",
                      )}
                    >
                      <span className="font-mono text-xs tracking-[0.34em] uppercase">
                        {it.label}
                      </span>
                      <span
                        className={cn(
                          "h-2 w-2 rounded-full transition-opacity",
                          activeId === it.id ? "bg-primary opacity-100" : "bg-primary/70 opacity-0 group-hover:opacity-70",
                        )}
                        aria-hidden="true"
                      />
                    </button>
                  ))}
                </nav>

                <div className="pt-2">
                  <Button
                    onClick={() => {
                      navigateFromSheet("tracks");
                    }}
                    className="landing-nav-cta w-full rounded-xl h-11 shadow-[0_16px_46px_hsl(var(--primary)/0.18)]"
                  >
                    CHOOSE TRACK <ArrowRight className="ml-1" />
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

const CarbonX = () => {
  const location = useLocation();
  const sectionIds = useMemo(
    () => ["about", "history", "tracks", "problems"],
    [],
  );
  const activeId = useActiveSection(sectionIds);
  const particleColors = useMemo(() => ["#ffffff"], []);
  const particleTuning = useParticleTuning();
  const [magnetDisabled, setMagnetDisabled] = useState(true);
  const getNavOffset = useCallback(() => {
    const header = document.querySelector(".landing-header") as HTMLElement | null;
    const headerHeight = header?.getBoundingClientRect().height ?? 0;
    return Math.max(0, Math.round(headerHeight + 8));
  }, []);
  const scrollToSection = useCallback((id: string) => {
    window.requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (!el) return;
      const computed = window.getComputedStyle(el);
      const paddingTop = Number.parseFloat(computed.paddingTop || "0") || 0;
      const top =
        el.getBoundingClientRect().top +
        window.scrollY -
        getNavOffset() +
        paddingTop;
      // Keep the landing view stable on reload by not persisting section hashes.
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    });
  }, [getNavOffset]);
  const openRegistration = useCallback(
    (track: keyof typeof carbonX.registerUrls) => {
      const url = carbonX.registerUrls[track];
      if (url) {
        window.open(url, "_blank", "noopener,noreferrer");
        return;
      }
      scrollToSection(track === "vegathon" ? "track-vegathon" : "track-electrothon");
    },
    [scrollToSection],
  );

  useEffect(() => {
    // Prevent browser scroll restoration from skipping the hero on reload.
    const prev = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    window.scrollTo({ top: 0, behavior: "auto" });
    return () => {
      window.history.scrollRestoration = prev;
    };
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    setMagnetDisabled(prefersReducedMotion || isTouchDevice);
  }, []);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      scrollToSection(id);
      return;
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location.hash, scrollToSection]);

  return (
    <main id="top" className="landing-surface relative text-foreground overflow-x-hidden">
      {/* Background: grid + stars/particles */}
      <div className="landing-bg pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-black/55" />
        <div
          className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.12]"
          style={{
            maskImage:
              "radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 70%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 70%)",
          }}
        />
        <ResponsiveParticles
          minWidth={768}
          className="landing-bg-particles absolute inset-0"
          particleColors={particleColors}
          particleCount={particleTuning.particleCount}
          particleSpread={particleTuning.particleSpread}
          speed={particleTuning.speed}
          particleBaseSize={particleTuning.particleBaseSize}
          sizeRandomness={particleTuning.sizeRandomness}
          moveParticlesOnHover={true}
          moveParticlesOnDeviceOrientation={true}
          deviceOrientationFactor={2.4}
          particleHoverFactor={particleTuning.particleHoverFactor}
          hoverMode="window"
          alphaParticles={true}
          disableRotation={false}
          pixelRatio={particleTuning.pixelRatio}
          maxFps={particleTuning.maxFps}
        />
        <div className="absolute inset-0 bg-gradient-radial from-white/[0.05] via-transparent to-transparent" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 70%, rgba(0,0,0,0.8) 100%)",
          }}
        />
      </div>

      <div className="landing-content">
        <CarbonXNavbar
          activeId={activeId}
          items={[
            { id: "about", label: "ABOUT" },
            { id: "history", label: "HISTORY" },
            { id: "tracks", label: "TRACKS" },
            { id: "problems", label: "PROBLEMS" },
          ]}
          onNavigate={scrollToSection}
        />

        {/* Hero */}
        <section className="relative pt-16 md:pt-20 pb-8 md:pb-12">
          <div className="container max-w-[1100px] px-6">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="landing-hero"
            >
              <p className="landing-kicker font-mono text-muted-foreground">
                {carbonX.tagline}
              </p>

              <h1 className="landing-title">
                <ShinyText
                  text={carbonX.eventName}
                  disabled={magnetDisabled}
                  className="landing-brand"
                  speed={2.6}
                  delay={1.1}
                  spread={118}
                  color="hsl(var(--foreground) / 0.92)"
                  shineColor="hsl(var(--primary))"
                  yoyo={true}
                />{" "}
                <DecryptedText
                  text={carbonX.year}
                  animateOn="view"
                  speed={55}
                  maxIterations={18}
                  numbersOnly={true}
                  parentClassName="landing-year"
                  encryptedClassName="text-muted-foreground"
                  aria-label={carbonX.year}
                />
              </h1>

              <p className="landing-subtitle mx-auto text-muted-foreground">
                A 42 hour national hackathon where developers, innovators, and students from across
                India team up to build practical, high-impact solutions.
              </p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.08 }}
                className="mt-6 w-full max-w-[52rem]"
              >
                <div className="mx-auto rounded-none card-beveled border border-border/70 bg-card/40 backdrop-blur-sm px-5 py-4 md:px-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.34em] text-primary shadow-[0_0_0_1px_rgba(255,49,46,0.06),0_14px_40px_rgba(255,49,46,0.08)]">
                        2 TRACKS
                      </span>
                      <div className="font-mono text-[10px] tracking-[0.52em] text-muted-foreground">
                        PICK YOUR LANE
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => scrollToSection("tracks")}
                      className="inline-flex items-center justify-center rounded-xl border border-border/70 bg-background/5 px-4 py-2 font-display text-xs tracking-widest text-foreground/90 transition hover:bg-background/10 hover:border-border/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      aria-label="Jump to the tracks section"
                    >
                      VIEW TRACKS <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      {
                        badge: "01",
                        title: "VEGATHON",
                        meta: "VEGA Processor",
                        blurb: "System-level builds inspired by indigenous processor lineage.",
                        registerKey: "vegathon",
                      },
                      {
                        badge: "02",
                        title: "ELECTROTHON",
                        meta: "EDA Based",
                        blurb: "Design, simulate, validate — ship clean electronic workflows.",
                        registerKey: "electrothon",
                      },
                    ].map((t) => (
                      <div
                        key={t.title}
                        className="group relative overflow-hidden text-left rounded-none card-beveled border border-border/70 bg-background/5 px-5 py-3.5 transition hover:bg-background/10 hover:border-border/90"
                      >
                        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
                        <div className="pointer-events-none absolute -top-8 -right-6 font-mono text-[6.5rem] leading-none tracking-[0.18em] text-transparent opacity-80 [-webkit-text-stroke:1px_hsl(var(--foreground)_/_0.18)] [text-shadow:0_0_32px_hsl(var(--primary)_/_0.12)] group-hover:opacity-95">
                          {t.badge}
                        </div>

                        <div className="relative">
                          <div className="flex items-center justify-between gap-3">
                            <div className="font-mono text-[10px] tracking-[0.56em] text-muted-foreground uppercase">
                              TRACK {t.badge}
                            </div>
                            <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.34em] text-primary">
                              {t.meta}
                            </span>
                          </div>
                          <div className="mt-3 font-display text-lg md:text-xl tracking-wide text-foreground/95">
                            {t.title}
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                            {t.blurb}
                          </p>

                          <div className="mt-3.5 pt-3.5 border-t border-border/60 flex items-center justify-between gap-3">
                            <Button
                              type="button"
                              onClick={() => scrollToSection("tracks")}
                              className="h-9 rounded-xl px-4 font-display tracking-widest shadow-[0_12px_34px_hsl(var(--primary)/0.18)]"
                              aria-label={`View ${t.title} track details`}
                            >
                              DETAILS <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px 0px -20% 0px" }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                className="w-full"
              >
                <SpotlightCard
                  className="landing-stats mx-auto rounded-none card-beveled border border-border/70 bg-card/60 px-5 pb-5 md:px-6 p-0"
                  spotlightColor={"rgba(255, 49, 46, 0.14)"}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-0">
                    {carbonX.stats.map((s, idx) => (
                      <div
                        key={s.label}
                        className={cn(
                          "px-4",
                          idx !== 0 && "sm:border-l sm:border-border/60",
                        )}
                      >
	                        <div className="font-mono text-[10px] tracking-[0.44em] text-muted-foreground">
	                          {s.label}
	                        </div>
	                        <div className="mt-2">
	                          <DecryptedText
	                            text={s.value}
	                            animateOn="view"
	                            speed={55}
	                            maxIterations={16}
	                            numbersOnly={true}
	                            parentClassName="font-display text-xl tracking-wide"
	                            className="text-foreground"
	                            encryptedClassName="text-foreground"
	                            aria-label={s.value}
	                          />
	                        </div>
	                      </div>
	                    ))}
	                  </div>
	                </SpotlightCard>
	              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="relative py-20 md:py-28 scroll-mt-24">
          <div className="container max-w-[1100px] px-6">
          <SectionHeading
            eyebrow="ABOUT"
            title={
              <>
                What is <span className="font-mokoto">CARBONX</span>?
              </>
            }
            description="Hardware-first, department-led, and built for real-world engineering prototypes."
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px 0px -20% 0px" }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="lg:col-span-7"
            >
              <GlassCard className="p-7 md:p-8 h-full">
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed md:text-justify hyphens-auto">
                  {carbonX.aboutLong}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  <Badge
                    className="rounded-full bg-primary/15 text-primary border border-primary/25"
                    variant="outline"
                  >
                    Hardware-centric
                  </Badge>
                  <Badge
                    className="rounded-full bg-background/10 text-muted-foreground border border-border/60"
                    variant="outline"
                  >
                    Embedded systems
                  </Badge>
                  <Badge
                    className="rounded-full bg-background/10 text-muted-foreground border border-border/60"
                    variant="outline"
                  >
                    Deep-tech development
                  </Badge>
                </div>
              </GlassCard>
            </motion.div>

            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px 0px -20% 0px" }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                className="h-full"
              >
                <GlassCard className="p-7 md:p-8 h-full">
                  <div className="font-mono text-[10px] tracking-[0.52em] text-muted-foreground">
                    COLLABORATION
                  </div>
                  <div className="mt-2 font-display text-xl md:text-2xl tracking-wide">
                    Built with <span className="text-primary">CDAC</span>.
                  </div>
                  <p className="mt-3 text-sm md:text-base text-muted-foreground leading-relaxed">
                    Continuing collaboration with CDAC to reinforce indigenous technology and a
                    deep-tech engineering focus.
                  </p>

                  <div className="mt-6 h-px w-full bg-border/60" />
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    {[
                      { label: "FOCUS", value: "Indigenous tech" },
                      { label: "MODE", value: "Hardware-first" },
                      { label: "OUTPUT", value: "Working prototypes" },
                      { label: "LEARNING", value: "Deep systems" },
                    ].map((m) => (
                      <div
                        key={m.label}
                        className="rounded-none card-beveled border border-border/70 bg-background/5 px-4 py-3"
                      >
                        <div className="font-mono text-[10px] tracking-[0.44em] text-muted-foreground">
                          {m.label}
                        </div>
                        <div className="mt-2 font-display text-sm tracking-wide text-foreground/90">
                          {m.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          </div>
          </div>
        </section>

        {/* History */}
        <section id="history" className="relative py-20 md:py-28 scroll-mt-24">
          <div className="container max-w-[1100px] px-6">
          <SectionHeading
            eyebrow="HISTORY"
            title={
              <>
                From <span className="text-primary">VEGATHON</span> to{" "}
                <span className="font-mokoto">CARBONX</span>.
              </>
            }
            description="A hardware hackathon lineage focused on indigenous tech and deep systems learning."
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-8 items-start">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px 0px -20% 0px" }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="lg:col-span-7"
            >
              <GlassCard className="p-7 md:p-8">
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  {carbonX.historyLong}
                </p>
              </GlassCard>
            </motion.div>

            <div className="lg:col-span-5 grid grid-cols-1 gap-5 md:gap-8">
              {[
                {
                  year: "2022",
                  title: "VEGATHON",
                  body:
                    "National-level hardware hackathon centered around the VEGA Processor, built with CDAC.",
                },
                {
                  year: "After",
                  title: "CARBON → CARBONX",
                  body:
                    "Rebranded to strengthen continuity, with CARBONX as the competitive hackathon format.",
                },
              ].map((t) => (
                <motion.div
                  key={t.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px 0px -20% 0px" }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                >
                  <GlassCard className="p-7 md:p-8">
                    <div className="flex items-baseline justify-between gap-4">
                      <div className="font-mono text-xs tracking-[0.38em] text-muted-foreground">
                        {t.year}
                      </div>
                      <div className="h-px flex-1 bg-border/60" />
                    </div>
                    <div className="mt-3 font-display text-xl tracking-wide">
                      {t.title}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {t.body}
                    </p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
          </div>
        </section>

        {/* Tracks */}
        <section id="tracks" className="relative py-20 md:py-28 scroll-mt-24">
          <div className="container max-w-[1100px] px-6">
          <SectionHeading
            eyebrow="TRACKS"
            title={
              <>
                Two tracks. One <span className="text-primary">hardware-first</span> mindset.
              </>
            }
            description="Pick the lane that matches your build — embedded systems, processors, or electronic design workflows."
          />

          <TrueFocus
            className="relative grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8"
            itemClassName="h-full cursor-pointer"
            blurAmount={2.2}
            borderColor="hsl(var(--primary))"
            glowColor="hsl(var(--primary) / 0.45)"
            animationDuration={0.38}
          >
            {[
              {
                id: "track-vegathon",
                title: "VEGATHON (VEGA Processor)",
                description:
                  "Processor-aware, system-level builds inspired by the VEGA Processor lineage — prototype real hardware-first solutions.",
                badge: "01",
                registerKey: "vegathon",
                ctaLabel: "VEGATHON",
              },
              {
                id: "track-electrothon",
                title: "Electrothon (EDA Based)",
                description:
                  "EDA-driven electronic design workflows — build, simulate, validate, and ship clean, practical implementations.",
                badge: "02",
                registerKey: "electrothon",
                ctaLabel: "ELECTROTHON",
              },
            ].map((t) => (
              <motion.div
                key={t.title}
                id={t.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px 0px -20% 0px" }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                className="h-full"
              >
                <GlassCard className="p-7 md:p-8 h-full">
                  <div className="flex items-start justify-between gap-4">
                    <div className="truefocus-stack min-w-0">
                      <div className="truefocus-sharp">
                        <div className="font-display text-xl md:text-2xl tracking-wide">
                          {t.title}
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                          {t.description}
                        </p>
                      </div>
                      <div className="truefocus-blur" aria-hidden="true">
                        <div className="font-display text-xl md:text-2xl tracking-wide">
                          {t.title}
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                          {t.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.34em] text-primary shadow-[0_0_0_1px_rgba(255,49,46,0.06),0_14px_40px_rgba(255,49,46,0.08)]">
                        TRACK <span className="text-foreground/90">{t.badge}</span>
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 h-px w-full bg-border/70" />
                  <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Registration is per-track. Choose your lane, then lock your spot.
                    </p>
                    <Button
                      type="button"
                      onClick={() =>
                        openRegistration(t.registerKey as keyof typeof carbonX.registerUrls)
                      }
                      className="h-11 rounded-xl px-7 font-display tracking-widest shadow-[0_14px_42px_hsl(var(--primary)/0.18)]"
                    >
                      REGISTER {t.ctaLabel}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                  <div className="truefocus-veil pointer-events-none absolute inset-0" aria-hidden="true" />
                </GlassCard>
              </motion.div>
            ))}
          </TrueFocus>
          </div>
        </section>

        {/* Problem statements */}
        <section id="problems" className="relative py-20 md:py-28 scroll-mt-24">
          <div className="container max-w-[1100px] px-6">
          <SectionHeading
            eyebrow="PROBLEM STATEMENTS"
            title={
              <>
                The build starts with a{" "}
                <span className="text-primary">real problem.</span>
              </>
            }
            description="We’ll publish the final problem statements soon — aligned to both tracks."
          />

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px 0px -20% 0px" }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            <GlassCard className="p-7 md:p-10">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="max-w-2xl">
                  <div className="font-display text-2xl md:text-3xl tracking-wide">
                    Coming soon.
                  </div>
                  <p className="mt-3 text-sm md:text-base text-muted-foreground leading-relaxed">
                    Once released, you’ll be able to pick a statement, map it to a track, and start
                    prototyping immediately. Keep this page bookmarked.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => scrollToSection("top")}
                    className="rounded-xl px-7 h-11 font-display tracking-wider shadow-[0_10px_30px_hsl(var(--primary)/0.18)]"
                  >
                    BACK TO TOP <ArrowRight className="ml-1" />
                  </Button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative py-14 md:py-20">
          <div className="container max-w-[1100px] px-6">
          <div className="rounded-none card-beveled border border-border/70 bg-card/60 p-7 md:p-10 text-center">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {carbonX.organizer}
            </p>
            <div className="mt-6 font-mono text-xs tracking-[0.34em] text-muted-foreground">
              © <span className="font-mokoto">{carbonX.eventName}</span> {carbonX.year}
            </div>
          </div>
          </div>
        </footer>
      </div>
    </main>
  );
};

export default CarbonX;
