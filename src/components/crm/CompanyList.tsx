import { useState } from "react";
import { Link } from "react-router-dom";
import { Building2, Plus, Search, MoreHorizontal, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCompanies, useCreateCompany, useDeleteCompany, Company } from "@/hooks/useCRM";

export function CompanyList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newCompany, setNewCompany] = useState({ name: "", org_number: "", industry: "", website: "", notes: "" });
  
  const { data: companies, isLoading } = useCompanies();
  const createCompany = useCreateCompany();
  const deleteCompany = useDeleteCompany();

  const filteredCompanies = companies?.filter((company) =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.industry?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.org_number?.includes(searchQuery)
  );

  const handleCreate = async () => {
    await createCompany.mutateAsync({
      name: newCompany.name,
      org_number: newCompany.org_number || null,
      industry: newCompany.industry || null,
      website: newCompany.website || null,
      notes: newCompany.notes || null,
    });
    setNewCompany({ name: "", org_number: "", industry: "", website: "", notes: "" });
    setIsCreateDialogOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Företag
          </CardTitle>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nytt företag
          </Button>
        </div>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Sök företag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Laddar...</div>
        ) : filteredCompanies?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchQuery ? "Inga företag hittades" : "Inga företag ännu"}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Namn</TableHead>
                <TableHead>Org.nr</TableHead>
                <TableHead>Bransch</TableHead>
                <TableHead>Stad</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCompanies?.map((company) => (
                <TableRow key={company.id}>
                  <TableCell>
                    <Link 
                      to={`/admin/crm/companies/${company.id}`}
                      className="font-medium hover:underline"
                    >
                      {company.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {company.org_number || "-"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {company.industry || "-"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {company.city || "-"}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/admin/crm/companies/${company.id}`}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Redigera
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => deleteCompany.mutate(company.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Ta bort
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Skapa nytt företag</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Företagsnamn *</Label>
              <Input
                id="name"
                value={newCompany.name}
                onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                placeholder="ACME AB"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="org_number">Organisationsnummer</Label>
              <Input
                id="org_number"
                value={newCompany.org_number}
                onChange={(e) => setNewCompany({ ...newCompany, org_number: e.target.value })}
                placeholder="556123-4567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">Bransch</Label>
              <Input
                id="industry"
                value={newCompany.industry}
                onChange={(e) => setNewCompany({ ...newCompany, industry: e.target.value })}
                placeholder="Tech, Finans, etc."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Webbplats</Label>
              <Input
                id="website"
                value={newCompany.website}
                onChange={(e) => setNewCompany({ ...newCompany, website: e.target.value })}
                placeholder="https://example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Anteckningar</Label>
              <Textarea
                id="notes"
                value={newCompany.notes}
                onChange={(e) => setNewCompany({ ...newCompany, notes: e.target.value })}
                placeholder="Övriga anteckningar..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Avbryt
            </Button>
            <Button 
              onClick={handleCreate} 
              disabled={!newCompany.name || createCompany.isPending}
            >
              {createCompany.isPending ? "Skapar..." : "Skapa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
