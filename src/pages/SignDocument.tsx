import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { FileText, Check, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DocumentData {
  id: string;
  title: string;
  content: string;
  signer_name: string;
  signer_email: string;
  signing_token_expires_at: string;
}

export default function SignDocument() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [document, setDocument] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);
  const [signed, setSigned] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [signatureName, setSignatureName] = useState("");

  useEffect(() => {
    const fetchDocument = async () => {
      if (!token) {
        setError("Ogiltig signeringslänk");
        setLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from("generated_documents")
          .select("id, title, content, signer_name, signer_email, signing_token_expires_at, status")
          .eq("signing_token", token)
          .single();

        if (fetchError || !data) {
          console.error("Fetch error:", fetchError);
          setError("Dokumentet kunde inte hittas eller länken har gått ut");
          setLoading(false);
          return;
        }

        // Check if already signed
        if (data.status === "signed") {
          setSigned(true);
          setDocument(data as DocumentData);
          setLoading(false);
          return;
        }

        // Check expiry
        if (new Date(data.signing_token_expires_at) < new Date()) {
          setError("Signeringslänken har gått ut");
          setLoading(false);
          return;
        }

        setDocument(data as DocumentData);
        setSignatureName(data.signer_name || "");
      } catch (err) {
        console.error("Error fetching document:", err);
        setError("Ett fel uppstod vid hämtning av dokumentet");
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [token]);

  const handleSign = async () => {
    if (!document || !agreedToTerms || !signatureName.trim()) {
      toast.error("Fyll i alla fält och godkänn villkoren");
      return;
    }

    setSigning(true);

    try {
      // Get client IP (approximate, for audit trail)
      let clientIp = "unknown";
      try {
        const ipResponse = await fetch("https://api.ipify.org?format=json");
        const ipData = await ipResponse.json();
        clientIp = ipData.ip;
      } catch (ipErr) {
        console.warn("Could not fetch IP:", ipErr);
      }

      const signatureData = JSON.stringify({
        name: signatureName,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
      });

      const { error: updateError } = await supabase
        .from("generated_documents")
        .update({
          status: "signed",
          signed_at: new Date().toISOString(),
          signed_by: signatureName,
          signer_ip: clientIp,
          signature_data: signatureData,
        })
        .eq("id", document.id)
        .eq("signing_token", token);

      if (updateError) {
        throw updateError;
      }

      setSigned(true);
      toast.success("Dokumentet har signerats!");
    } catch (err) {
      console.error("Error signing document:", err);
      toast.error("Kunde inte signera dokumentet. Försök igen.");
    } finally {
      setSigning(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Laddar dokument...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full">
          <CardContent className="flex flex-col items-center py-12">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h1 className="text-xl font-semibold mb-2">Kunde inte öppna dokument</h1>
            <p className="text-muted-foreground text-center">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (signed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full">
          <CardContent className="flex flex-col items-center py-12">
            <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-green-500" />
            </div>
            <h1 className="text-xl font-semibold mb-2">Dokumentet är signerat</h1>
            <p className="text-muted-foreground text-center mb-6">
              {document?.title} har signerats framgångsrikt.
            </p>
            <p className="text-sm text-muted-foreground">
              Du kan stänga denna sida.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold mb-2">Digital signering</h1>
          <p className="text-muted-foreground">
            Granska dokumentet nedan och signera om du godkänner innehållet
          </p>
        </div>

        {/* Document Preview */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>{document?.title}</CardTitle>
                <CardDescription>
                  Signeringslänk giltig till{" "}
                  {document?.signing_token_expires_at &&
                    format(new Date(document.signing_token_expires_at), "d MMMM yyyy", { locale: sv })}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] rounded-md border p-4 bg-muted/30">
              <div 
                className="prose prose-sm max-w-none whitespace-pre-wrap"
                style={{ fontFamily: "Georgia, serif" }}
              >
                {document?.content}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Signing Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Signera dokument</CardTitle>
            <CardDescription>
              Bekräfta din identitet och godkänn dokumentet
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="signatureName">Ditt fullständiga namn</Label>
              <Input
                id="signatureName"
                value={signatureName}
                onChange={(e) => setSignatureName(e.target.value)}
                placeholder="Skriv ditt fullständiga namn"
              />
              <p className="text-xs text-muted-foreground">
                Detta fungerar som din digitala signatur
              </p>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
              />
              <Label htmlFor="terms" className="text-sm font-normal leading-relaxed cursor-pointer">
                Jag har läst och förstått dokumentet ovan och godkänner dess innehåll. 
                Jag förstår att denna digitala signatur är juridiskt bindande.
              </Label>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                onClick={handleSign}
                disabled={!agreedToTerms || !signatureName.trim() || signing}
                size="lg"
              >
                {signing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signerar...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Signera dokument
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          Interim Growth Collective • Digital signering
        </p>
      </div>
    </div>
  );
}
