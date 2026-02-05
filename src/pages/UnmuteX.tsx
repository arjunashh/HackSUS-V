import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const UnmuteX = () => {
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
                        <span className="font-mono text-sm text-primary tracking-[0.3em]">// TRACK 06</span>
                        <h1 className="font-display text-5xl md:text-6xl text-foreground mt-4">
                            UNMUTEX
                        </h1>
                        <p className="text-xl text-muted-foreground mt-6 max-w-2xl mx-auto text-center">
                            Create innovative music solutions that streamline, augment, and elevate production workflows
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
                                        UnmuteX challenges musicians and audio engineers to harness AI and technology to revolutionize music production workflows.
                                        Create tools for composition, sound design, mixing, mastering, or distribution that empower artists and streamline the creative process.
                                    </p>
                                </section>

                                {/* Requirements */}
                                <section className="bg-card border border-border p-8 rounded-xl">
                                    <h2 className="font-display text-2xl text-foreground mb-4">Requirements</h2>
                                    <ul className="space-y-3 text-muted-foreground">
                                        <li className="flex gap-3">
                                            <span className="text-primary">•</span>
                                            <span>Music production tool or platform with AI integration</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="text-primary">•</span>
                                            <span>Working prototype or functional demo</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="text-primary">•</span>
                                            <span>Audio samples or demo tracks</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="text-primary">•</span>
                                            <span>Technical documentation and artistic impact analysis</span>
                                        </li>
                                    </ul>
                                </section>

                                {/* Judging Criteria
                                <section className="bg-card border border-border p-8 rounded-xl">
                                    <h2 className="font-display text-2xl text-foreground mb-4">Judging Criteria</h2>
                                    <ul className="space-y-3 text-muted-foreground">
                                        <li className="flex gap-3">
                                            <span className="text-primary">•</span>
                                            <span>Artistic Innovation (25%)</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="text-primary">•</span>
                                            <span>Technical Sophistication (25%)</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="text-primary">•</span>
                                            <span>Audio Quality & Results (25%)</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="text-primary">•</span>
                                            <span>Practical Usability (25%)</span>
                                        </li>
                                    </ul>
                                </section> */}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <div className="bg-card border border-border p-6 rounded-xl sticky top-24">
                                <h3 className="font-display text-lg text-foreground mb-4">Track Details</h3>
                                <div className="space-y-4 text-sm text-muted-foreground">
                                    <div>
                                        <p className="text-primary font-semibold mb-1">Prize Pool</p>
                                        <p>TBA</p>
                                    </div>
                                    <div>
                                        <p className="text-primary font-semibold mb-1">Team Size</p>
                                        <p>4-6 members</p>
                                    </div>
                                    <div>
                                        <p className="text-primary font-semibold mb-1">Duration</p>
                                        <p>42 hours</p>
                                    </div>
                                </div>
                                <a
                                    href="https://konfhub.com/hacksus-edition-5"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block w-full mt-6 bg-primary text-primary-foreground px-6 py-3 font-display tracking-wider rounded-lg hover:bg-primary/90 transition-colors text-center"
                                >
                                    Register Team
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default UnmuteX;
