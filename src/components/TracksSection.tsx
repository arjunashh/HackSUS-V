import { FolderCode, Plug2, CircuitBoard, Hammer, Clapperboard } from "lucide-react";

const tracks = [
  {
    icon: FolderCode,
    title: "Software",
    description: "Integrate AI into workflows to make them more efficient",
    color: "from-primary to-accent",
  },
  {
    icon: CircuitBoard,
    title: "Electronics",
    description: "Decentralize the future. Smart contracts, DeFi, and next-gen distributed applications.",
    color: "from-accent to-neon",
  },
  {
    icon: Plug2,
    title: "EEE & Instrumentation",
    description: "Revolutionize healthcare. Diagnostics, wellness, and patient care innovations.",
    color: "from-primary to-crimson",
  },
  {
    icon: Hammer,
    title: "Civil & Mechanical",
    description: "Code for the planet. Climate tech, green energy, and environmental solutions.",
    color: "from-accent to-primary",
  },
  {
    icon: Clapperboard,
    title: "Film & Music",
    description: "No limits. Bring any idea that challenges conventions and breaks boundaries.",
    color: "from-primary to-accent",
  },
];

const TracksSection = () => {
  return (
    <section id="tracks" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/10 to-transparent pointer-events-none" />

      <div className="container px-6 relative">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="font-mono text-sm text-primary tracking-[0.3em]">// CHOOSE YOUR PATH</span>
          <h2 className="font-display text-5xl md:text-6xl text-foreground mt-4">
            CHALLENGE <span className="text-primary">TRACKS</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Pick your battlefield. Each track offers unique challenges and dedicated prize pools.
          </p>
        </div>

        {/* Tracks grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tracks.slice(0, 3).map((track, i) => (
            <div
              key={i}
              className="group relative bg-card border border-border p-8 hover-glow transition-all duration-500"
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${track.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

              {/* Content */}
              <div className="relative z-10">
                {/* Icon with glow */}
                <div className="w-16 h-16 flex items-center justify-center mb-6 relative">
                  <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <track.icon className="w-8 h-8 text-primary relative z-10" />
                </div>

                {/* Title */}
                <h3 className="font-display text-2xl text-foreground mb-4 group-hover:text-primary transition-colors">
                  {track.title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {track.description}
                </p>

                {/* Bottom accent line */}
                <div className="mt-6 h-0.5 bg-border group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-transparent transition-all duration-500" />
              </div>

              {/* Corner decoration */}
              <div className="absolute top-4 right-4 font-mono text-xs text-muted-foreground opacity-50">
                TRACK_{String(i + 1).padStart(2, "0")}
              </div>
            </div>
          ))}
        </div>

        {/* Centered bottom row */}
        <div className="flex justify-center gap-6 mt-6 flex-wrap md:flex-nowrap">
          {tracks.slice(3).map((track, i) => (
            <div
              key={i + 3}
              className="group relative bg-card border border-border p-8 hover-glow transition-all duration-500 w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${track.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

              {/* Content */}
              <div className="relative z-10">
                {/* Icon with glow */}
                <div className="w-16 h-16 flex items-center justify-center mb-6 relative">
                  <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <track.icon className="w-8 h-8 text-primary relative z-10" />
                </div>

                {/* Title */}
                <h3 className="font-display text-2xl text-foreground mb-4 group-hover:text-primary transition-colors">
                  {track.title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {track.description}
                </p>

                {/* Bottom accent line */}
                <div className="mt-6 h-0.5 bg-border group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-transparent transition-all duration-500" />
              </div>

              {/* Corner decoration */}
              <div className="absolute top-4 right-4 font-mono text-xs text-muted-foreground opacity-50">
                TRACK_{String(i + 4).padStart(2, "0")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TracksSection;
