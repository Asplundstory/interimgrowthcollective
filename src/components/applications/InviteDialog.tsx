import { useState } from "react";
import { Send, Mail, User, Briefcase } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CreatorApplication } from "@/hooks/useApplications";

interface InviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: CreatorApplication | null;
  onConfirm: () => Promise<void>;
}

export function InviteDialog({
  open,
  onOpenChange,
  application,
  onConfirm,
}: InviteDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    await onConfirm();
    setIsLoading(false);
  };

  if (!application) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5 text-primary" />
            Skicka inbjudan
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <p>
              Du är på väg att skicka en inbjudan till att slutföra registreringen
              i kandidatdatabasen.
            </p>
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-foreground">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{application.name}</span>
              </div>
              <div className="flex items-center gap-2 text-foreground">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{application.email}</span>
              </div>
              <div className="flex items-center gap-2 text-foreground">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span>{application.role}</span>
              </div>
            </div>
            <p className="text-sm">
              Ett e-postmeddelande kommer att skickas med en personlig länk som
              är giltig i 7 dagar.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Avbryt</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Skickar...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Skicka inbjudan
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
