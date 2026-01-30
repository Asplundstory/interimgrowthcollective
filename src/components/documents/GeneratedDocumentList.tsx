import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { FileText, Download, Trash2, Building2, User, MoreHorizontal, Check, Send, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useGeneratedDocuments,
  useUpdateGeneratedDocument,
  templateTypeLabels,
} from "@/hooks/useDocuments";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import SendForSigningDialog from "./SendForSigningDialog";
import { generateSignedDocumentPdf } from "@/lib/generatePdf";

const statusLabels: Record<string, string> = {
  draft: "Utkast",
  sent: "Skickat",
  signed: "Signerat",
  archived: "Arkiverat",
};

const statusColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  sent: "bg-blue-500/10 text-blue-500",
  signed: "bg-green-500/10 text-green-500",
  archived: "bg-zinc-500/10 text-zinc-500",
};

export default function GeneratedDocumentList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [signingDoc, setSigningDoc] = useState<{ id: string; title: string } | null>(null);

  const { data: documents, isLoading } = useGeneratedDocuments();
  const updateDocument = useUpdateGeneratedDocument();
  const queryClient = useQueryClient();

  const deleteDocument = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("generated_documents").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["generated-documents"] });
      toast.success("Dokument raderat");
      setDeleteId(null);
    },
    onError: () => {
      toast.error("Kunde inte radera dokument");
    },
  });

  const filteredDocuments = documents?.filter((d) =>
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    d.companies?.name?.toLowerCase().includes(search.toLowerCase()) ||
    (d.candidates && `${d.candidates.first_name} ${d.candidates.last_name}`.toLowerCase().includes(search.toLowerCase()))
  );

  const handlePrint = (doc: typeof documents[0]) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${doc.title}</title>
          <style>
            body {
              font-family: Georgia, 'Times New Roman', serif;
              line-height: 1.6;
              max-width: 800px;
              margin: 40px auto;
              padding: 20px;
              white-space: pre-wrap;
            }
          </style>
        </head>
        <body>${doc.content}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleMarkSigned = async (id: string) => {
    await updateDocument.mutateAsync({
      id,
      status: 'signed',
      signed_at: new Date().toISOString(),
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!filteredDocuments || filteredDocuments.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Inga genererade dokument</h3>
          <p className="text-muted-foreground mb-4">
            Skapa ett dokument genom att välja en mall och fylla i fälten
          </p>
          <Button onClick={() => navigate("/admin/documents/generate")}>
            Skapa dokument
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Input
        placeholder="Sök dokument..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Dokument</TableHead>
              <TableHead>Typ</TableHead>
              <TableHead>Kopplat till</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Datum</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDocuments.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell>
                  <div className="font-medium">{doc.title}</div>
                </TableCell>
                <TableCell>
                  {doc.document_templates && (
                    <Badge variant="outline" className="text-xs">
                      {templateTypeLabels[doc.document_templates.template_type]}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    {doc.companies && (
                      <span className="flex items-center gap-1 text-sm">
                        <Building2 className="h-3 w-3" />
                        {doc.companies.name}
                      </span>
                    )}
                    {doc.candidates && (
                      <span className="flex items-center gap-1 text-sm">
                        <User className="h-3 w-3" />
                        {doc.candidates.first_name} {doc.candidates.last_name}
                      </span>
                    )}
                    {!doc.companies && !doc.candidates && (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={statusColors[doc.status]}>
                    {statusLabels[doc.status] || doc.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {format(new Date(doc.created_at), "d MMM yyyy", { locale: sv })}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handlePrint(doc)}>
                        <Download className="h-4 w-4 mr-2" />
                        Ladda ner / Skriv ut
                      </DropdownMenuItem>
                      {doc.status === 'signed' && (
                        <DropdownMenuItem onClick={() => generateSignedDocumentPdf({
                          title: doc.title,
                          content: doc.content,
                          signed_at: doc.signed_at,
                          signed_by: doc.signed_by,
                          signer_ip: doc.signer_ip,
                        })}>
                          <FileDown className="h-4 w-4 mr-2" />
                          Ladda ner signerat PDF
                        </DropdownMenuItem>
                      )}
                      {doc.status === 'draft' && (
                        <>
                          <DropdownMenuItem onClick={() => setSigningDoc({ id: doc.id, title: doc.title })}>
                            <Send className="h-4 w-4 mr-2" />
                            Skicka för signering
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleMarkSigned(doc.id)}>
                            <Check className="h-4 w-4 mr-2" />
                            Markera som signerat
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setDeleteId(doc.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Radera
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Radera dokument?</AlertDialogTitle>
            <AlertDialogDescription>
              Detta går inte att ångra. Dokumentet kommer att tas bort permanent.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Avbryt</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteDocument.mutate(deleteId)}
              className="bg-destructive text-destructive-foreground"
            >
              Radera
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {signingDoc && (
        <SendForSigningDialog
          open={!!signingDoc}
          onOpenChange={(open) => !open && setSigningDoc(null)}
          documentId={signingDoc.id}
          documentTitle={signingDoc.title}
          onSuccess={() => queryClient.invalidateQueries({ queryKey: ["generated-documents"] })}
        />
      )}
    </div>
  );
}
