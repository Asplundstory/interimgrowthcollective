import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { 
  LogOut, FileText, Receipt, FolderOpen, ExternalLink, 
  Building2, Presentation
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  useClientAuth, 
  useClientProposals, 
  useClientDocuments, 
  useClientInvoices,
  documentTypeLabels,
  invoiceStatusLabels,
  invoiceStatusColors
} from "@/hooks/useClientPortal";
import { SEO } from "@/components/SEO";

export default function ClientPortal() {
  const { user, isLoading, isAuthenticated, logout } = useClientAuth();
  const navigate = useNavigate();

  const { data: proposals, isLoading: proposalsLoading } = useClientProposals(user?.company_id);
  const { data: documents, isLoading: documentsLoading } = useClientDocuments(user?.company_id);
  const { data: invoices, isLoading: invoicesLoading } = useClientInvoices(user?.company_id);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/client/login");
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/client/login");
  };

  return (
    <>
      <SEO 
        title="Kundportal - IGC"
        description="Din portal för förslag, dokument och fakturor"
      />
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="font-bold">{user.company_name}</h1>
                  <p className="text-sm text-muted-foreground">{user.name}</p>
                </div>
              </div>
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logga ut
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold">Välkommen, {user.name}!</h2>
            <p className="text-muted-foreground">
              Här kan du se dina förslag, dokument och fakturor.
            </p>
          </div>

          <Tabs defaultValue="proposals" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 max-w-md">
              <TabsTrigger value="proposals" className="gap-2">
                <Presentation className="h-4 w-4" />
                Förslag
              </TabsTrigger>
              <TabsTrigger value="documents" className="gap-2">
                <FolderOpen className="h-4 w-4" />
                Dokument
              </TabsTrigger>
              <TabsTrigger value="invoices" className="gap-2">
                <Receipt className="h-4 w-4" />
                Fakturor
              </TabsTrigger>
            </TabsList>

            <TabsContent value="proposals">
              <Card>
                <CardHeader>
                  <CardTitle>Dina förslag</CardTitle>
                  <CardDescription>Affärsförslag och offerter</CardDescription>
                </CardHeader>
                <CardContent>
                  {proposalsLoading ? (
                    <div className="text-center py-8 text-muted-foreground">Laddar...</div>
                  ) : !proposals || proposals.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Inga förslag ännu
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {proposals.map((deal: any) => (
                        <div 
                          key={deal.id} 
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{deal.proposals?.project_title || deal.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {deal.proposals?.created_at && format(new Date(deal.proposals.created_at), "d MMMM yyyy", { locale: sv })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            {deal.value && (
                              <span className="text-sm font-medium">
                                {new Intl.NumberFormat("sv-SE").format(deal.value)} {deal.currency || "SEK"}
                              </span>
                            )}
                            {deal.proposals?.slug && (
                              <Button variant="outline" size="sm" asChild>
                                <Link to={`/p/${deal.proposals.slug}`} target="_blank">
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Visa
                                </Link>
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Dokument</CardTitle>
                  <CardDescription>Kontrakt, avtal och policys</CardDescription>
                </CardHeader>
                <CardContent>
                  {documentsLoading ? (
                    <div className="text-center py-8 text-muted-foreground">Laddar...</div>
                  ) : !documents || documents.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Inga dokument ännu
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {documents.map((doc) => (
                        <div 
                          key={doc.id} 
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <FolderOpen className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{doc.title}</p>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Badge variant="secondary" className="text-xs">
                                  {documentTypeLabels[doc.document_type]}
                                </Badge>
                                <span>
                                  {format(new Date(doc.created_at), "d MMM yyyy", { locale: sv })}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Ladda ner
                            </a>
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="invoices">
              <Card>
                <CardHeader>
                  <CardTitle>Fakturor</CardTitle>
                  <CardDescription>Faktureringshistorik</CardDescription>
                </CardHeader>
                <CardContent>
                  {invoicesLoading ? (
                    <div className="text-center py-8 text-muted-foreground">Laddar...</div>
                  ) : !invoices || invoices.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Inga fakturor ännu
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {invoices.map((invoice) => (
                        <div 
                          key={invoice.id} 
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Receipt className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">Faktura #{invoice.invoice_number}</p>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Badge className={invoiceStatusColors[invoice.status]}>
                                  {invoiceStatusLabels[invoice.status]}
                                </Badge>
                                {invoice.due_date && (
                                  <span>
                                    Förfaller {format(new Date(invoice.due_date), "d MMM yyyy", { locale: sv })}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">
                              {new Intl.NumberFormat("sv-SE").format(invoice.amount)} {invoice.currency}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(invoice.created_at), "d MMM yyyy", { locale: sv })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </>
  );
}
