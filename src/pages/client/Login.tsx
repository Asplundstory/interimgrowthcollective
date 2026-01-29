import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Mail, KeyRound, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useClientAuth } from "@/hooks/useClientPortal";
import { toast } from "sonner";

export default function ClientLogin() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [isLoading, setIsLoading] = useState(false);
  
  const { isAuthenticated, requestMagicLink, verifyOtp } = useClientAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/client/portal");
    }
  }, [isAuthenticated, navigate]);

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    const result = await requestMagicLink(email);
    setIsLoading(false);

    if (result.success) {
      toast.success(result.message);
      setStep("otp");
    } else {
      toast.error(result.message);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      toast.error("Ange en 6-siffrig kod");
      return;
    }

    setIsLoading(true);
    const result = await verifyOtp(email, otp);
    setIsLoading(false);

    if (result.success) {
      toast.success("Inloggningen lyckades!");
      navigate("/client/portal");
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-serif">Kundportal</h1>
          <p className="text-muted-foreground mt-2">
            {step === "email" 
              ? "Logga in med din e-postadress" 
              : "Ange koden du fick via e-post"}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === "email" ? (
            <motion.form
              key="email-step"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleRequestCode}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="email">E-postadress</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="din@email.se"
                    className="pl-10"
                    required
                    autoFocus
                    autoComplete="email"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Skickar...
                  </>
                ) : (
                  "Skicka inloggningskod"
                )}
              </Button>
            </motion.form>
          ) : (
            <motion.form
              key="otp-step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleVerifyOtp}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="otp">6-siffrig kod</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="123456"
                    className="pl-10 text-center text-lg tracking-widest"
                    required
                    autoFocus
                    autoComplete="one-time-code"
                  />
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Koden skickades till {email}
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading || otp.length !== 6}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifierar...
                  </>
                ) : (
                  "Logga in"
                )}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => {
                  setStep("email");
                  setOtp("");
                }}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Tillbaka
              </Button>
            </motion.form>
          )}
        </AnimatePresence>

        <p className="text-center text-xs text-muted-foreground">
          Endast för registrerade kunder
        </p>
      </div>
    </div>
  );
}
