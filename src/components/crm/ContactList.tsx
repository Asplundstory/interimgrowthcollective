import { useState } from "react";
import { Link } from "react-router-dom";
import { Users, Plus, Search, MoreHorizontal, Trash2, Pencil, Mail, Phone } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useContacts, useCreateContact, useDeleteContact, useCompanies } from "@/hooks/useCRM";

export function ContactList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newContact, setNewContact] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    title: "",
    company_id: "",
    notes: "",
  });

  const { data: contacts, isLoading } = useContacts();
  const { data: companies } = useCompanies();
  const createContact = useCreateContact();
  const deleteContact = useDeleteContact();

  const filteredContacts = contacts?.filter((contact) => {
    const fullName = `${contact.first_name} ${contact.last_name}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    return (
      fullName.includes(query) ||
      contact.email?.toLowerCase().includes(query) ||
      contact.company?.name.toLowerCase().includes(query)
    );
  });

  const handleCreate = async () => {
    await createContact.mutateAsync({
      first_name: newContact.first_name,
      last_name: newContact.last_name,
      email: newContact.email || null,
      phone: newContact.phone || null,
      title: newContact.title || null,
      company_id: newContact.company_id || null,
      notes: newContact.notes || null,
    });
    setNewContact({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      title: "",
      company_id: "",
      notes: "",
    });
    setIsCreateDialogOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Kontakter
          </CardTitle>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Ny kontakt
          </Button>
        </div>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Sök kontakter..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Laddar...</div>
        ) : filteredContacts?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchQuery ? "Inga kontakter hittades" : "Inga kontakter ännu"}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Namn</TableHead>
                <TableHead>Företag</TableHead>
                <TableHead>Titel</TableHead>
                <TableHead>Kontakt</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContacts?.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell>
                    <Link
                      to={`/admin/crm/contacts/${contact.id}`}
                      className="font-medium hover:underline"
                    >
                      {contact.first_name} {contact.last_name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {contact.company ? (
                      <Link
                        to={`/admin/crm/companies/${contact.company.id}`}
                        className="hover:underline"
                      >
                        {contact.company.name}
                      </Link>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {contact.title || "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {contact.email && (
                        <a href={`mailto:${contact.email}`} className="text-muted-foreground hover:text-foreground">
                          <Mail className="h-4 w-4" />
                        </a>
                      )}
                      {contact.phone && (
                        <a href={`tel:${contact.phone}`} className="text-muted-foreground hover:text-foreground">
                          <Phone className="h-4 w-4" />
                        </a>
                      )}
                    </div>
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
                          <Link to={`/admin/crm/contacts/${contact.id}`}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Redigera
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => deleteContact.mutate(contact.id)}
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
            <DialogTitle>Skapa ny kontakt</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">Förnamn *</Label>
                <Input
                  id="first_name"
                  value={newContact.first_name}
                  onChange={(e) => setNewContact({ ...newContact, first_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Efternamn *</Label>
                <Input
                  id="last_name"
                  value={newContact.last_name}
                  onChange={(e) => setNewContact({ ...newContact, last_name: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Företag</Label>
              <Select
                value={newContact.company_id}
                onValueChange={(value) => setNewContact({ ...newContact, company_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Välj företag..." />
                </SelectTrigger>
                <SelectContent>
                  {companies?.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Titel</Label>
              <Input
                id="title"
                value={newContact.title}
                onChange={(e) => setNewContact({ ...newContact, title: e.target.value })}
                placeholder="VD, Marknadschef, etc."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-post</Label>
                <Input
                  id="email"
                  type="email"
                  value={newContact.email}
                  onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefon</Label>
                <Input
                  id="phone"
                  value={newContact.phone}
                  onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Anteckningar</Label>
              <Textarea
                id="notes"
                value={newContact.notes}
                onChange={(e) => setNewContact({ ...newContact, notes: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Avbryt
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!newContact.first_name || !newContact.last_name || createContact.isPending}
            >
              {createContact.isPending ? "Skapar..." : "Skapa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
