import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Dithering } from "@paper-design/shaders-react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AstraX from "./pages/AstraX";
import CarbonX from "./pages/CarbonX";
import SyncConX from "./pages/SyncConX";
import HeliX from "./pages/HeliX";
import ScreenX from "./pages/ScreenX";
import UnmuteX from "./pages/UnmuteX";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: -1, pointerEvents: "none", overflow: "hidden", opacity: 0.08 }}>
        <Dithering
          width={typeof window !== 'undefined' ? window.innerWidth : 1280}
          height={typeof window !== 'undefined' ? window.innerHeight : 720}
          colorBack="#00000000"
          colorFront="#e71818"
          shape="warp"
          type="random"
          size={1}
          speed={0.1}
          scale={0.68}
          offsetX={0.28}
          offsetY={-0.3}
        />
      </div>
      <div style={{ position: "relative", zIndex: 1, pointerEvents: "auto" }}>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/astraX" element={<AstraX />} />
            <Route path="/carbonx" element={<CarbonX />} />
            <Route path="/syncconx" element={<SyncConX />} />
            <Route path="/helix" element={<HeliX />} />
            <Route path="/screenx" element={<ScreenX />} />
            <Route path="/unmutex" element={<UnmuteX />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
