import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building2, Users, Briefcase, LayoutGrid } from "lucide-react";
import { useAdmin } from "@/hooks/useAdmin";
import { CompanyList, ContactList, DealPipeline } from "@/components/crm";

export default function CRM() {
  const { isAdmin, isLoading } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate("/admin/login");
    }
  }, [isAdmin, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/admin/dashboard">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold">CRM</h1>
                <p className="text-muted-foreground text-sm">
                  Hantera företag, kontakter och affärer
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="pipeline" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="pipeline" className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4" />
              <span className="hidden sm:inline">Pipeline</span>
            </TabsTrigger>
            <TabsTrigger value="deals" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <span className="hidden sm:inline">Affärer</span>
            </TabsTrigger>
            <TabsTrigger value="companies" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Företag</span>
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Kontakter</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pipeline">
            <DealPipeline />
          </TabsContent>

          <TabsContent value="deals">
            <DealPipeline />
          </TabsContent>

          <TabsContent value="companies">
            <CompanyList />
          </TabsContent>

          <TabsContent value="contacts">
            <ContactList />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
