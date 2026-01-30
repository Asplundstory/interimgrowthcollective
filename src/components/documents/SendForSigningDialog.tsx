import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SendForSigningDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentId: string;
  documentTitle: string;
  onSuccess: () => void;
}

export default function SendForSigningDialog({
  open,
  onOpenChange,
  documentId,
  documentTitle,
  onSuccess,
}: SendForSigningDialogProps) {
  const [signerName, setSignerName] = useState("");
  const [signerEmail, setSignerEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!signerName.trim() || !signerEmail.trim()) {
      toast.error("Fyll i namn och e-post");
      return;
    }

    if (!signerEmail.includes("@")) {
      toast.error("Ange en giltig e-postadress");
      return;
    }

    setSending(true);

    try {
      const { data, error } = await supabase.functions.invoke("send-signing-email", {
        body: {
          documentId,
          signerName,
          signerEmail,
          message: message.trim() || undefined,
        },
      });

      if (error) {
        throw error;
      }

      toast.success(`Signeringslänk skickad till ${signerEmail}`);
      onSuccess();
      onOpenChange(false);
      
      // Reset form
      setSignerName("");
      setSignerEmail("");
      setMessage("");
    } catch (err: any) {
      console.error("Error sending signing email:", err);
      toast.error(err.message || "Kunde inte skicka signeringslänk");
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Skicka för signering</DialogTitle>
          <DialogDescription>
            Skicka "{documentTitle}" för digital signering
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="signerName">Mottagarens namn *</Label>
            <Input
              id="signerName"
              value={signerName}
              onChange={(e) => setSignerName(e.target.value)}
              placeholder="Anna Andersson"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="signerEmail">Mottagarens e-post *</Label>
            <Input
              id="signerEmail"
              type="email"
              value={signerEmail}
              onChange={(e) => setSignerEmail(e.target.value)}
              placeholder="anna@foretag.se"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Personligt meddelande (valfritt)</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Lägg till ett personligt meddelande till mottagaren..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Avbryt
          </Button>
          <Button onClick={handleSend} disabled={sending}>
            {sending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Skickar...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Skicka för signering
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
