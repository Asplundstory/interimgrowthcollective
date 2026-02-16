import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type ApplicationStatus = "pending" | "reviewing" | "invited" | "completed" | "rejected";

export interface CreatorApplication {
  id: string;
  name: string;
  email: string;
  role: string;
  portfolio_url: string;
  q1_feeling: string;
  q2_structure: string;
  q3_pressure: string;
  code_of_conduct_accepted: boolean;
  created_at: string;
  status: ApplicationStatus;
  invitation_token: string | null;
  invitation_sent_at: string | null;
  invitation_expires_at: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  candidate_id: string | null;
}

export function useApplications() {
  const [applications, setApplications] = useState<CreatorApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchApplications = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("creator_applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching applications:", error);
      toast({
        title: "Fel",
        description: "Kunde inte hämta ansökningar",
        variant: "destructive",
      });
    } else {
      // Cast the data to our type since the DB types haven't been regenerated yet
      setApplications((data as unknown as CreatorApplication[]) || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const updateStatus = async (id: string, status: ApplicationStatus) => {
    const updateData: Record<string, unknown> = { status };
    
    if (status === "reviewing") {
      const { data: { user } } = await supabase.auth.getUser();
      updateData.reviewed_by = user?.id;
      updateData.reviewed_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from("creator_applications")
      .update(updateData)
      .eq("id", id);

    if (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Fel",
        description: "Kunde inte uppdatera status",
        variant: "destructive",
      });
      return false;
    }

    setApplications(prev => 
      prev.map(app => app.id === id ? { ...app, ...updateData } as CreatorApplication : app)
    );
    
    toast({
      title: "Status uppdaterad",
      description: `Ansökan markerad som ${getStatusLabel(status)}`,
    });
    return true;
  };

  const sendInvitation = async (application: CreatorApplication) => {
    try {
      const { data, error } = await supabase.functions.invoke("send-candidate-invitation", {
        body: {
          applicationId: application.id,
          name: application.name,
          email: application.email,
          role: application.role,
        },
      });

      if (error) throw error;

      // Update local state
      setApplications(prev =>
        prev.map(app =>
          app.id === application.id
            ? {
                ...app,
                status: "invited" as ApplicationStatus,
                invitation_sent_at: new Date().toISOString(),
                invitation_token: data.token,
                invitation_expires_at: data.expiresAt,
              }
            : app
        )
      );

      toast({
        title: "Inbjudan skickad",
        description: `E-post skickad till ${application.email}`,
      });
      return true;
    } catch (error) {
      console.error("Error sending invitation:", error);
      toast({
        title: "Fel",
        description: "Kunde inte skicka inbjudan. Kontrollera att e-postservern är konfigurerad.",
        variant: "destructive",
      });
      return false;
    }
  };

  const resendInvitation = async (application: CreatorApplication) => {
    try {
      const { data, error } = await supabase.functions.invoke("send-candidate-invitation", {
        body: {
          applicationId: application.id,
          name: application.name,
          email: application.email,
          role: application.role,
        },
      });

      if (error) throw error;

      setApplications(prev =>
        prev.map(app =>
          app.id === application.id
            ? {
                ...app,
                status: "invited" as ApplicationStatus,
                invitation_sent_at: new Date().toISOString(),
                invitation_token: data.token,
                invitation_expires_at: data.expiresAt,
              }
            : app
        )
      );

      toast({
        title: "Inbjudan skickad igen",
        description: `Ny inbjudan skickad till ${application.email}`,
      });
      return true;
    } catch (error) {
      console.error("Error resending invitation:", error);
      toast({
        title: "Fel",
        description: "Kunde inte skicka om inbjudan.",
        variant: "destructive",
      });
      return false;
    }
  };

  const rejectApplication = async (id: string) => {
    return updateStatus(id, "rejected");
  };

  return {
    applications,
    isLoading,
    fetchApplications,
    updateStatus,
    sendInvitation,
    resendInvitation,
    rejectApplication,
  };
}

export function getStatusLabel(status: ApplicationStatus): string {
  const labels: Record<ApplicationStatus, string> = {
    pending: "Väntar",
    reviewing: "Under granskning",
    invited: "Inbjuden",
    completed: "Slutförd",
    rejected: "Avvisad",
  };
  return labels[status] || status;
}

export function getStatusVariant(status: ApplicationStatus): "default" | "secondary" | "destructive" | "outline" {
  const variants: Record<ApplicationStatus, "default" | "secondary" | "destructive" | "outline"> = {
    pending: "outline",
    reviewing: "secondary",
    invited: "default",
    completed: "default",
    rejected: "destructive",
  };
  return variants[status] || "outline";
}
