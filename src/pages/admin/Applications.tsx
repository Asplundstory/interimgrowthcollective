import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, UserPlus, Clock, Send, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdmin } from "@/hooks/useAdmin";
import { useApplications, ApplicationStatus } from "@/hooks/useApplications";
import { ApplicationList } from "@/components/applications";

export default function Applications() {
  const { isAdmin, isLoading: authLoading } = useAdmin();
  const navigate = useNavigate();
  const { 
    applications, 
    isLoading, 
    updateStatus, 
    sendInvitation,
    resendInvitation
  } = useApplications();

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate("/admin/login");
    }
  }, [isAdmin, authLoading, navigate]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const pendingApps = applications.filter(a => a.status === "pending");
  const reviewingApps = applications.filter(a => a.status === "reviewing");
  const invitedApps = applications.filter(a => a.status === "invited");
  const completedApps = applications.filter(a => a.status === "completed");
  const rejectedApps = applications.filter(a => a.status === "rejected");

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/admin/dashboard">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Ansökningar</h1>
              <p className="text-muted-foreground text-sm">
                Hantera intresseanmälningar från kreatörer
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="flex-wrap h-auto gap-2">
            <TabsTrigger value="pending" className="gap-2">
              <Clock className="h-4 w-4" />
              Nya
              <Badge variant="secondary">{pendingApps.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="reviewing" className="gap-2">
              <UserPlus className="h-4 w-4" />
              Under granskning
              <Badge variant="secondary">{reviewingApps.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="invited" className="gap-2">
              <Send className="h-4 w-4" />
              Inbjudna
              <Badge variant="secondary">{invitedApps.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="completed" className="gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Slutförda
              <Badge variant="secondary">{completedApps.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="rejected" className="gap-2">
              <XCircle className="h-4 w-4" />
              Avvisade
              <Badge variant="secondary">{rejectedApps.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <ApplicationList
              applications={pendingApps}
              onStatusChange={updateStatus}
              onSendInvitation={sendInvitation}
              onResendInvitation={resendInvitation}
            />
          </TabsContent>

          <TabsContent value="reviewing">
            <ApplicationList
              applications={reviewingApps}
              onStatusChange={updateStatus}
              onSendInvitation={sendInvitation}
              onResendInvitation={resendInvitation}
            />
          </TabsContent>

          <TabsContent value="invited">
            <ApplicationList
              applications={invitedApps}
              onStatusChange={updateStatus}
              onSendInvitation={sendInvitation}
              onResendInvitation={resendInvitation}
            />
          </TabsContent>

          <TabsContent value="completed">
            <ApplicationList
              applications={completedApps}
              onStatusChange={updateStatus}
              onSendInvitation={sendInvitation}
              onResendInvitation={resendInvitation}
            />
          </TabsContent>

          <TabsContent value="rejected">
            <ApplicationList
              applications={rejectedApps}
              onStatusChange={updateStatus}
              onSendInvitation={sendInvitation}
              onResendInvitation={resendInvitation}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
