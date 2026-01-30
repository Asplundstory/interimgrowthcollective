import { Suspense, lazy, useState } from "react";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { CookieConsent } from "@/components/CookieConsent";
import { LanguageProvider } from "@/hooks/useLanguage";
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
const ProposalPage = lazy(() => import("@/pages/ProposalPage"));
const AdminLogin = lazy(() => import("@/pages/admin/Login"));
const AdminDashboard = lazy(() => import("@/pages/admin/Dashboard"));
const AdminProposals = lazy(() => import("@/pages/admin/Proposals"));
const ProposalEditor = lazy(() => import("@/pages/admin/ProposalEditor"));
const AdminCRM = lazy(() => import("@/pages/admin/CRM"));
const AdminCandidates = lazy(() => import("@/pages/admin/Candidates"));
const AdminApplications = lazy(() => import("@/pages/admin/Applications"));
const AdminDocuments = lazy(() => import("@/pages/admin/Documents"));
const ApplyPage = lazy(() => import("@/pages/ApplyPage"));
const ClientLogin = lazy(() => import("@/pages/client/Login"));
const ClientPortal = lazy(() => import("@/pages/client/Portal"));
const SignDocument = lazy(() => import("@/pages/SignDocument"));
const CompleteApplication = lazy(() => import("@/pages/CompleteApplication"));

// Document routes
const TemplateEditor = lazy(() => import("@/components/documents/TemplateEditor"));
const DocumentGenerator = lazy(() => import("@/components/documents/DocumentGenerator"));

// Route definitions to avoid duplication
const MainRoutes = () => (
  <>
    <Route index element={<HomePage />} />
    <Route path="for-companies" element={<ForCompaniesPage />} />
    <Route path="for-creators" element={<ForCreatorsPage />} />
    <Route path="areas" element={<AreasPage />} />
    <Route path="about" element={<AboutPage />} />
    <Route path="insights" element={<InsightsPage />} />
    <Route path="insights/:slug" element={<InsightPage />} />
    <Route path="contact" element={<ContactPage />} />
    <Route path="apply" element={<ApplyPage />} />
    <Route path="privacy" element={<PrivacyPage />} />
    <Route path="terms" element={<TermsPage />} />
  </>
);

const App = () => {
  const [queryClient] = useState(() => new QueryClient());
  
  return (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <LanguageProvider>
            <CookieConsent />
            <Suspense fallback={<div className="min-h-screen" />}>
              <Routes>
                {/* Swedish routes (default) */}
                <Route element={<Layout />}>
                  {MainRoutes()}
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
                
                {/* English routes */}
                <Route path="/en" element={<Layout />}>
                  {MainRoutes()}
                </Route>
                
                {/* Proposal routes (no layout - fullscreen) */}
                <Route path="/p/:slug" element={<ProposalPage />} />
                
                {/* Document signing route (public, no layout) */}
                <Route path="/sign/:token" element={<SignDocument />} />
                
                {/* Complete application route (public, no layout) */}
                <Route path="/apply/:token" element={<CompleteApplication />} />
                
                {/* Admin routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/proposals" element={<AdminProposals />} />
                <Route path="/admin/proposals/:id" element={<ProposalEditor />} />
                <Route path="/admin/crm" element={<AdminCRM />} />
                <Route path="/admin/crm/*" element={<AdminCRM />} />
                <Route path="/admin/candidates" element={<AdminCandidates />} />
                <Route path="/admin/applications" element={<AdminApplications />} />
                <Route path="/admin/documents" element={<AdminDocuments />} />
                <Route path="/admin/documents/templates/:id" element={<TemplateEditor />} />
                <Route path="/admin/documents/generate" element={<DocumentGenerator />} />
                
                {/* Client portal routes */}
                <Route path="/client/login" element={<ClientLogin />} />
                <Route path="/client/portal" element={<ClientPortal />} />
              </Routes>
            </Suspense>
          </LanguageProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
  );
};

export default App;
