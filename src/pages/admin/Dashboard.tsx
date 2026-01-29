import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/hooks/useAdmin";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, User, Building2, MessageSquare, Link as LinkIcon, FileText, Presentation } from "lucide-react";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  company: string | null;
  message: string;
  created_at: string;
}

interface CreatorApplication {
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
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { isAdmin, isLoading: authLoading } = useAdmin();
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [applications, setApplications] = useState<CreatorApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedContact, setExpandedContact] = useState<string | null>(null);
  const [expandedApplication, setExpandedApplication] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate("/admin/login");
    }
  }, [isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const fetchData = async () => {
    setIsLoading(true);
    
    const [contactsResult, applicationsResult] = await Promise.all([
      supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("creator_applications")
        .select("*")
        .order("created_at", { ascending: false }),
    ]);

    if (contactsResult.data) setContacts(contactsResult.data);
    if (applicationsResult.data) setApplications(applicationsResult.data);
    
    setIsLoading(false);
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Laddar...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          </div>
          <Button onClick={() => navigate("/admin/proposals")}>
            <Presentation className="h-4 w-4 mr-2" />
            Kundförslag
          </Button>
        </div>

        <Tabs defaultValue="contacts" className="space-y-6">
          <TabsList>
            <TabsTrigger value="contacts" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Kontaktförfrågningar
              <Badge variant="secondary" className="ml-1">{contacts.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="applications" className="gap-2">
              <User className="h-4 w-4" />
              Ansökningar
              <Badge variant="secondary" className="ml-1">{applications.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="contacts" className="space-y-4">
            {contacts.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center">Inga kontaktförfrågningar ännu.</p>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Datum</TableHead>
                      <TableHead>Namn</TableHead>
                      <TableHead>E-post</TableHead>
                      <TableHead>Företag</TableHead>
                      <TableHead>Meddelande</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contacts.map((contact) => (
                      <TableRow 
                        key={contact.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => setExpandedContact(
                          expandedContact === contact.id ? null : contact.id
                        )}
                      >
                        <TableCell className="whitespace-nowrap">
                          {format(new Date(contact.created_at), "d MMM yyyy HH:mm", { locale: sv })}
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            {contact.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <a 
                            href={`mailto:${contact.email}`}
                            className="flex items-center gap-2 text-primary hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Mail className="h-4 w-4" />
                            {contact.email}
                          </a>
                        </TableCell>
                        <TableCell>
                          {contact.company ? (
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                              {contact.company}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">–</span>
                          )}
                        </TableCell>
                        <TableCell className="max-w-md">
                          <p className={expandedContact === contact.id ? "" : "truncate"}>
                            {contact.message}
                          </p>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="applications" className="space-y-4">
            {applications.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center">Inga ansökningar ännu.</p>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Datum</TableHead>
                      <TableHead>Namn</TableHead>
                      <TableHead>E-post</TableHead>
                      <TableHead>Roll</TableHead>
                      <TableHead>Portfolio</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map((app) => (
                      <>
                        <TableRow 
                          key={app.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => setExpandedApplication(
                            expandedApplication === app.id ? null : app.id
                          )}
                        >
                          <TableCell className="whitespace-nowrap">
                            {format(new Date(app.created_at), "d MMM yyyy HH:mm", { locale: sv })}
                          </TableCell>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              {app.name}
                            </div>
                          </TableCell>
                          <TableCell>
                            <a 
                              href={`mailto:${app.email}`}
                              className="flex items-center gap-2 text-primary hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Mail className="h-4 w-4" />
                              {app.email}
                            </a>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{app.role}</Badge>
                          </TableCell>
                          <TableCell>
                            <a 
                              href={app.portfolio_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-primary hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <LinkIcon className="h-4 w-4" />
                              Portfolio
                            </a>
                          </TableCell>
                        </TableRow>
                        {expandedApplication === app.id && (
                          <TableRow key={`${app.id}-details`}>
                            <TableCell colSpan={5} className="bg-muted/30">
                              <div className="p-4 space-y-4">
                                <div>
                                  <h4 className="font-medium flex items-center gap-2 mb-2">
                                    <FileText className="h-4 w-4" />
                                    Svar på frågor
                                  </h4>
                                  <div className="grid gap-4 md:grid-cols-3">
                                    <div className="bg-background p-3 rounded-lg border">
                                      <p className="text-sm text-muted-foreground mb-1">Hur känner du dig?</p>
                                      <p className="text-sm">{app.q1_feeling}</p>
                                    </div>
                                    <div className="bg-background p-3 rounded-lg border">
                                      <p className="text-sm text-muted-foreground mb-1">Hur strukturerar du ditt arbete?</p>
                                      <p className="text-sm">{app.q2_structure}</p>
                                    </div>
                                    <div className="bg-background p-3 rounded-lg border">
                                      <p className="text-sm text-muted-foreground mb-1">Hur hanterar du press?</p>
                                      <p className="text-sm">{app.q3_pressure}</p>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <Badge variant={app.code_of_conduct_accepted ? "default" : "destructive"}>
                                    {app.code_of_conduct_accepted ? "Godkänt uppförandekod" : "Ej godkänt"}
                                  </Badge>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
