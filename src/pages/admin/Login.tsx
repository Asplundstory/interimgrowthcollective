import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/hooks/useAdmin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSetupMode, setIsSetupMode] = useState(false);
  const [checkingSetup, setCheckingSetup] = useState(true);
  const { isAdmin, isLoading: isCheckingAdmin } = useAdmin();
  const navigate = useNavigate();

  // Check if any admins exist
  useEffect(() => {
    const checkAdminExists = async () => {
      const { count } = await supabase
        .from("user_roles")
        .select("*", { count: "exact", head: true })
        .eq("role", "admin");

      setIsSetupMode(count === 0);
      setCheckingSetup(false);
    };

    checkAdminExists();
  }, []);

  useEffect(() => {
    if (!isCheckingAdmin && isAdmin) {
      navigate("/");
    }
  }, [isAdmin, isCheckingAdmin, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Felaktiga inloggningsuppgifter");
        } else {
          toast.error(error.message);
        }
        return;
      }

      // Check if user is admin after login
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .eq("role", "admin")
          .maybeSingle();

        if (!roleData) {
          await supabase.auth.signOut();
          toast.error("Du har inte admin-behörighet");
          return;
        }

        toast.success("Inloggad som administratör");
        navigate("/");
      }
    } catch (err) {
      toast.error("Ett fel uppstod vid inloggning");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.length < 6) {
      toast.error("Lösenordet måste vara minst 6 tecken");
      return;
    }

    setIsLoading(true);

    try {
      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        if (error.message.includes("already registered")) {
          toast.error("E-postadressen är redan registrerad. Försök logga in istället.");
          setIsSetupMode(false);
        } else {
          toast.error(error.message);
        }
        return;
      }

      if (data.user) {
        // Add admin role
        const { error: roleError } = await supabase
          .from("user_roles")
          .insert({
            user_id: data.user.id,
            role: "admin",
          });

        if (roleError) {
          console.error("Error adding admin role:", roleError);
          toast.error("Kunde inte skapa admin-rättigheter");
          return;
        }

        toast.success("Admin-konto skapat! Du är nu inloggad.");
        navigate("/");
      }
    } catch (err) {
      toast.error("Ett fel uppstod");
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingAdmin || checkingSetup) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-serif">
            {isSetupMode ? "Skapa första admin" : "Admin"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isSetupMode
              ? "Registrera dig som administratör"
              : "Logga in för att redigera innehåll"}
          </p>
        </div>

        <form onSubmit={isSetupMode ? handleSetup : handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-post</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Lösenord</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete={isSetupMode ? "new-password" : "current-password"}
              minLength={isSetupMode ? 6 : undefined}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isSetupMode ? "Skapar konto..." : "Loggar in..."}
              </>
            ) : isSetupMode ? (
              "Skapa admin-konto"
            ) : (
              "Logga in"
            )}
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          {isSetupMode
            ? "Detta skapar det första admin-kontot"
            : "Endast för administratörer"}
        </p>
      </div>
    </div>
  );
}
