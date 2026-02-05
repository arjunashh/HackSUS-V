import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const CarbonX = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <div className="min-h-screen">
            <Navbar />
            <main className="pt-24 pb-16">
                <div className="container px-6 mx-auto">
                    {/* Back button */}
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
                    >
                        <ArrowLeft size={20} />
                        <span>Back to Home</span>
                    </Link>

                    {/* Header */}
                    <div className="mb-16 text-center">
                        <span className="font-mono text-sm text-primary tracking-[0.3em]">// TRACK 02</span>
                        <h1 className="font-display text-5xl md:text-6xl text-foreground mt-4">
                            CARBONX <div className="text-primary">(Electronics)</div>
                        </h1>
                        <p className="text-xl text-muted-foreground mt-6 max-w-2xl mx-auto text-center">
                            Build AI-enabled electronic systems that rethink and optimize everyday workflows
                        </p>
                    </div>

                    {/* Content sections */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                        <div className="lg:col-span-2">
                            <div className="space-y-8">
                                {/* Overview */}
                                <section className="bg-card border border-border p-8 rounded-xl">
                                    <h2 className="font-display text-2xl text-foreground mb-4">Overview</h2>
                                    <p className="text-muted-foreground leading-relaxed">
                                        CARBONX is the flagship hackathon initiative curated by the Department of Electronics and
                                        Communication Engineering, currently conducted as a dedicated track under HackS'US,
                                        an innovation event organized by RSET IEDC and IIC RSET. CARBONX focuses on hardware-centric innovation,
                                        embedded systems, and electronics-driven problem solving, providing participants with a platform
                                        to design, prototype, and validate real-world engineering solutions. While hosted under Hacks'us
                                        for the present edition, CARBONX retains complete technical ownership by the department and is
                                        envisioned as an annual, independently conducted hackathon in the coming years.
                                        The initiative continues its collaboration with the Centre for Development of Advanced Computing (CDAC),
                                        reinforcing its emphasis on indigenous technology and deep-tech development.
                                    </p>
                                </section>

                                {/* Requirements */}
                                <section className="bg-card border border-border p-8 rounded-xl">
                                    <h2 className="font-display text-2xl text-foreground mb-4">History</h2>
                                    <p className="space-y-3 text-muted-foreground">
                                        CARBONX traces its origins back to 2022, when it was first launched as VEGATHON, a national-level
                                        hardware hackathon conducted by the Department of Electronics and Communication Engineering in
                                        collaboration with CDAC. VEGATHON 2022 was centered around the VEGA Processor,
                                        an indigenous processor architecture developed by CDAC, and was designed to promote
                                        hands-on learning, processor-level understanding, and system-based innovation.
                                        Building on the success and technical legacy of VEGATHON, the initiative was later
                                        rebranded as CARBON, with CARBONX introduced as its competitive hackathon format.
                                        This evolution reflects the department's long-term vision of creating a sustained
                                        innovation ecosystem rooted in electronics and hardware excellence.
                                    </p>
                                </section>

                                {/* Judging Criteria */}
                                <section className="bg-card border border-border p-8 rounded-xl">
                                    <h2 className="font-display text-2xl text-foreground mb-4">Judging Criteria</h2>
                                    <ul className="space-y-3 text-muted-foreground">
                                        <li className="flex gap-3">
                                            <span className="text-primary">•</span>
                                            <span>Hardware Innovation (25%)</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="text-primary">•</span>
                                            <span>AI Integration (25%)</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="text-primary">•</span>
                                            <span>Efficiency & Performance (25%)</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="text-primary">•</span>
                                            <span>Scalability & Practicality (25%)</span>
                                        </li>
                                    </ul>
                                </section>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <div className="bg-card border border-border p-6 rounded-xl sticky top-24">
                                <h3 className="font-display text-lg text-foreground mb-4">Track Details</h3>
                                <div className="space-y-4 text-sm text-muted-foreground">
                                    <div>
                                        <p className="text-primary font-semibold mb-1">Prize Pool</p>
                                        <p>TBD</p>
                                    </div>
                                    <div>
                                        <p className="text-primary font-semibold mb-1">Team Size</p>
                                        <p>1-5 members</p>
                                    </div>
                                    <div>
                                        <p className="text-primary font-semibold mb-1">Duration</p>
                                        <p>42 hours</p>
                                    </div>
                                </div>
                                <button className="w-full mt-6 bg-primary text-primary-foreground px-6 py-3 font-display tracking-wider rounded-lg hover:bg-primary/90 transition-colors">
                                    Register Team
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CarbonX;
