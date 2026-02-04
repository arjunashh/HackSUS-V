import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";
import ResponsiveParticles from "@/components/ResponsiveParticles";
import DecryptedText from "@/components/DecryptedText";
import Magnet from "@/components/Magnet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const carbonX = {
  eventName: "CARBONX",
  year: "2026",
  tagline: "INNOVATION BEYOND BOUNDARIES",
  prizeAmount: "₹1,00,000",
  prizeCaption: "PRIZE POOL",
  description:
    "A 42 hour national hackathon where developers, innovators, and students from across India team up to build practical, high-impact solutions. The event brings together industry experts, mentors, and tech enthusiasts in a round-the-clock marathon of problem-solving, prototyping, and pure chaos-powered innovation.",
  date: "6–8 MARCH, 2026",
  city: "KOCHI",
  organizer:
    "Organized by Department of Electronics and Communication Engineering, Rajagiri School of Engineering & Technology (Autonomous)",
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
            className="absolute -bottom-2 h-0.5 bg-primary shadow-[0_0_18px_hsl(var(--primary)/0.35)] will-change-[left,width]"
            animate={{
              left: indicator.left,
              width: indicator.width,
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
            onClick={() => onNavigate("problems")}
            className="landing-nav-cta rounded-xl px-6 h-9 shadow-[0_10px_30px_hsl(var(--primary)/0.18)]"
          >
            REGISTER NOW <ArrowRight className="ml-1" />
          </Button>
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
  const [magnetDisabled, setMagnetDisabled] = useState(true);
  const getNavOffset = useCallback(() => {
    const header = document.querySelector(".landing-header") as HTMLElement | null;
    const headerHeight = header?.getBoundingClientRect().height ?? 0;
    return Math.max(0, Math.round(headerHeight + 12));
  }, []);
  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - getNavOffset();
    // Keep the landing view stable on reload by not persisting section hashes.
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
    window.scrollTo({ top, behavior: "smooth" });
  }, [getNavOffset]);

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
          particleCount={240}
          particleSpread={12}
          speed={0.16}
          particleBaseSize={170}
          sizeRandomness={0.65}
          moveParticlesOnHover={true}
          moveParticlesOnDeviceOrientation={true}
          deviceOrientationFactor={2.4}
          particleHoverFactor={2.2}
          hoverMode="window"
          alphaParticles={true}
          disableRotation={false}
          pixelRatio={1}
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
        <section className="relative pt-20 md:pt-24 pb-10 md:pb-14">
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
                <span className="landing-brand">{carbonX.eventName}</span>{" "}
                <span className="landing-year">{carbonX.year}</span>
              </h1>

              <div className="landing-prize">
                <div className="landing-prize-value font-mono text-foreground">
                  <DecryptedText
                    text={carbonX.prizeAmount}
                    animateOn="view"
                    speed={60}
                    maxIterations={20}
                    numbersOnly={true}
                    parentClassName="landing-prize-value font-mono"
                    className="landing-prize-value text-foreground"
                    encryptedClassName="landing-prize-value text-foreground"
                    aria-label={carbonX.prizeAmount}
                  />
                </div>
                <div className="mt-2 font-mono text-[10px] tracking-[0.56em] text-muted-foreground">
                  {carbonX.prizeCaption}
                </div>
              </div>

              <p className="landing-subtitle mx-auto text-muted-foreground">
                A 42 hour national hackathon where developers, innovators, and students from across
                India team up to build practical, high-impact solutions.
              </p>

              <div className="landing-actions flex-col sm:flex-row items-center">
                <Magnet
                  disabled={magnetDisabled}
                  padding={90}
                  magnetStrength={9}
                  wrapperClassName="inline-block"
                >
                  <Button
                    onClick={() => scrollToSection("problems")}
                    className="landing-button rounded-xl px-7 h-11"
                  >
                    REGISTER NOW
                  </Button>
                </Magnet>
                <Magnet
                  disabled={magnetDisabled}
                  padding={80}
                  magnetStrength={11}
                  wrapperClassName="inline-block"
                >
                  <Button
                    variant="outline"
                    onClick={() => scrollToSection("about")}
                    className="landing-button-secondary rounded-xl px-7 h-11"
                  >
                    LEARN MORE
                  </Button>
                </Magnet>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px 0px -20% 0px" }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                className="w-full"
              >
                <div className="landing-stats mx-auto rounded-none card-beveled border border-border/70 bg-card/60 px-5 pb-5 md:px-6">
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
	                </div>
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
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
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

            <div className="lg:col-span-5 grid grid-cols-1 gap-5 md:gap-8">
              {[
                {
                  label: "OWNERSHIP",
                  title: "Department-led, technically owned.",
                  body:
                    "Curated and owned by the Department of Electronics and Communication Engineering, with a long-term plan to evolve as a standalone annual hackathon.",
                },
                {
                  label: "COLLABORATION",
                  title: "Built with CDAC.",
                  body:
                    "Continuing collaboration with CDAC to reinforce indigenous technology and a deep-tech engineering focus.",
                },
              ].map((b) => (
                <motion.div
                  key={b.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px 0px -20% 0px" }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                >
                  <GlassCard className="p-7 md:p-8">
                    <div className="font-mono text-[10px] tracking-[0.52em] text-muted-foreground">
                      {b.label}
                    </div>
                    <div className="mt-2 font-display text-xl tracking-wide">
                      {b.title}
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      {b.body}
                    </p>
                  </GlassCard>
                </motion.div>
              ))}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
            {[
              {
                title: "VEGATHON (VEGA Processor)",
                description:
                  "Processor-aware, system-level builds inspired by the VEGA Processor lineage — prototype real hardware-first solutions.",
                badge: "01",
              },
              {
                title: "Electrothon (EDA Based)",
                description:
                  "EDA-driven electronic design workflows — build, simulate, validate, and ship clean, practical implementations.",
                badge: "02",
              },
            ].map((t) => (
              <motion.div
                key={t.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px 0px -20% 0px" }}
                transition={{ duration: 0.55, ease: "easeOut" }}
              >
                <GlassCard className="p-7 md:p-8 h-full">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-display text-xl md:text-2xl tracking-wide">
                        {t.title}
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                        {t.description}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.34em] text-primary shadow-[0_0_0_1px_rgba(255,49,46,0.06),0_14px_40px_rgba(255,49,46,0.08)]">
                        TRACK <span className="text-foreground/90">{t.badge}</span>
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 h-px w-full bg-border/70" />
                </GlassCard>
              </motion.div>
            ))}
          </div>
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
