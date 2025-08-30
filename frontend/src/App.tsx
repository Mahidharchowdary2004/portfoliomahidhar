import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import SkillsAdmin from "./pages/admin/SkillsAdmin";
import ProjectsAdmin from "./pages/admin/ProjectsAdmin";
import CertificationsAdmin from "./pages/admin/CertificationsAdmin";
import ContactAdmin from "./pages/admin/ContactAdmin";
import ExperienceAdmin from "./pages/admin/ExperienceAdmin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />

          {/* Admin routes */}
          <Route path="/admin" element={<Admin />}>
            {/* Default redirect: /admin → /admin/skills */}
            <Route index element={<Navigate to="skills" replace />} />
            <Route path="skills" element={<SkillsAdmin />} />
            <Route path="experience" element={<ExperienceAdmin />} />
            <Route path="projects" element={<ProjectsAdmin />} />
            <Route path="certifications" element={<CertificationsAdmin />} />
            <Route path="contact-info" element={<ContactAdmin />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
