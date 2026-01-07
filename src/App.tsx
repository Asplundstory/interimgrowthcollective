import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { CookieConsent } from "@/components/CookieConsent";
import HomePage from "@/pages/Home";

// Lazy load non-critical pages
const ForCompaniesPage = lazy(() => import("@/pages/ForCompanies"));
const ForCreatorsPage = lazy(() => import("@/pages/ForCreators"));
const AreasPage = lazy(() => import("@/pages/Areas"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const InsightsPage = lazy(() => import("@/pages/Insights"));
const InsightPage = lazy(() => import("@/pages/InsightPage"));
const ContactPage = lazy(() => import("@/pages/ContactPage"));
const PrivacyPage = lazy(() => import("@/pages/PrivacyPage"));
const TermsPage = lazy(() => import("@/pages/TermsPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));
const AdminLogin = lazy(() => import("@/pages/admin/Login"));
const AdminDashboard = lazy(() => import("@/pages/admin/Dashboard"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <CookieConsent />
        <Suspense fallback={<div className="min-h-screen" />}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/for-companies" element={<ForCompaniesPage />} />
              <Route path="/for-creators" element={<ForCreatorsPage />} />
              <Route path="/areas" element={<AreasPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/insights" element={<InsightsPage />} />
              <Route path="/insights/:slug" element={<InsightPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
