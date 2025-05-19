import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
// import Projects from "./pages/Projects";
import PublicProjects from "./pages/PublicProjects";
import ProjectMap from "./pages/ProjectMap";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div className="min-h-screen bg-background overflow-hidden">
        {/* Decorative gradients */}
        <div className="fixed top-0 -left-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl mix-blend-multiply"></div>
        <div className="fixed top-60 -right-20 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl mix-blend-multiply"></div>
        <div className="fixed bottom-0 left-20 w-60 h-60 bg-green-400/10 rounded-full blur-3xl mix-blend-multiply"></div>
        
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* <Route path="/projects" element={<Projects />} /> */}
            <Route path="/public-projects" element={<PublicProjects />} />
            <Route path="/map" element={<ProjectMap />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
