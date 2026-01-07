import { LogOut, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/hooks/useAdmin";
import { useNavigate } from "react-router-dom";

export function AdminBar() {
  const { isAdmin, user } = useAdmin();
  const navigate = useNavigate();

  if (!isAdmin) return null;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-lg flex items-center gap-4">
      <span className="text-sm font-medium">
        Redigeringsläge aktiv
      </span>
      <div className="w-px h-4 bg-primary-foreground/30" />
      <span className="text-xs opacity-75">{user?.email}</span>
      <button
        onClick={handleLogout}
        className="p-1.5 hover:bg-primary-foreground/10 rounded-full transition-colors"
        title="Logga ut"
      >
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  );
}
