import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/admin/Login";
import AdminLayout from "./pages/admin/AdminLayout";
import Overview from "./pages/admin/Overview";
import AboutAdmin from "./pages/admin/AboutAdmin";
import SkillsAdmin from "./pages/admin/SkillsAdmin";
import ExperienceAdmin from "./pages/admin/ExperienceAdmin";
import ProjectsAdmin from "./pages/admin/ProjectsAdmin";
import CertificationsAdmin from "./pages/admin/CertificationsAdmin";
import ContactAdmin from "./pages/admin/ContactAdmin";
import AchievementsAdmin from "./pages/admin/AchievementsAdmin";
import ServicesAdmin from "./pages/admin/ServicesAdmin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />

            {/* Admin routes */}
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Overview />} />
              <Route path="about" element={<AboutAdmin />} />
              <Route path="skills" element={<SkillsAdmin />} />
              <Route path="experience" element={<ExperienceAdmin />} />
              <Route path="projects" element={<ProjectsAdmin />} />
              <Route path="certifications" element={<CertificationsAdmin />} />
              <Route path="contact-info" element={<ContactAdmin />} />
              <Route path="achievements" element={<AchievementsAdmin />} />
              <Route path="services" element={<ServicesAdmin />} />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;