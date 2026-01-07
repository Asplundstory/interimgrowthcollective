import { Outlet, useLocation } from "react-router-dom";
import { Header, Footer } from "@/components/editorial";
import { AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/animations";
import { AdminBar } from "@/components/cms";

export function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      </main>
      <Footer />
      <AdminBar />
    </div>
  );
}
