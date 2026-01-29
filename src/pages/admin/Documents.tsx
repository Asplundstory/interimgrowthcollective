import { useNavigate } from "react-router-dom";
import { Plus, FileStack, FilePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TemplateList, GeneratedDocumentList } from "@/components/documents";

export default function AdminDocuments() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <Tabs defaultValue="documents" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="documents" className="gap-2">
              <FileStack className="h-4 w-4" />
              Dokument
            </TabsTrigger>
            <TabsTrigger value="templates" className="gap-2">
              <FilePlus className="h-4 w-4" />
              Mallar
            </TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/admin/documents/templates/new")}>
              <Plus className="h-4 w-4 mr-2" />
              Ny mall
            </Button>
            <Button onClick={() => navigate("/admin/documents/generate")}>
              <FilePlus className="h-4 w-4 mr-2" />
              Skapa dokument
            </Button>
          </div>
        </div>

        <TabsContent value="documents">
          <GeneratedDocumentList />
        </TabsContent>

        <TabsContent value="templates">
          <TemplateList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
