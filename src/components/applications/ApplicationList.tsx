import { useState } from "react";
import { format, isPast } from "date-fns";
import { sv } from "date-fns/locale";
import { 
  User, 
  Mail, 
  Link as LinkIcon, 
  FileText, 
  Send, 
  X, 
  Eye, 
  Clock,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  RefreshCw,
  AlertTriangle
} from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  CreatorApplication, 
  ApplicationStatus,
  getStatusLabel, 
  getStatusVariant 
} from "@/hooks/useApplications";
import { InviteDialog } from "./InviteDialog";

interface ApplicationListProps {
  applications: CreatorApplication[];
  onStatusChange: (id: string, status: ApplicationStatus) => Promise<boolean>;
  onSendInvitation: (application: CreatorApplication) => Promise<boolean>;
  onResendInvitation: (application: CreatorApplication) => Promise<boolean>;
}

export function ApplicationList({ 
  applications, 
  onStatusChange, 
  onSendInvitation,
  onResendInvitation
}: ApplicationListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<CreatorApplication | null>(null);

  const handleInvite = (application: CreatorApplication) => {
    setSelectedApplication(application);
    setInviteDialogOpen(true);
  };

  const handleConfirmInvite = async () => {
    if (selectedApplication) {
      const success = await onSendInvitation(selectedApplication);
      if (success) {
        setInviteDialogOpen(false);
        setSelectedApplication(null);
      }
    }
  };

  const getStatusIcon = (status: ApplicationStatus) => {
    switch (status) {
      case "pending":
        return <Clock className="h-3 w-3" />;
      case "reviewing":
        return <Eye className="h-3 w-3" />;
      case "invited":
        return <Send className="h-3 w-3" />;
      case "completed":
        return <CheckCircle2 className="h-3 w-3" />;
      case "rejected":
        return <XCircle className="h-3 w-3" />;
    }
  };

  if (applications.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center">
        Inga ansökningar ännu.
      </p>
    );
  }

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Datum</TableHead>
              <TableHead>Namn</TableHead>
              <TableHead>E-post</TableHead>
              <TableHead>Roll</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Åtgärder</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((app) => (
              <>
                <TableRow
                  key={app.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
                >
                  <TableCell className="whitespace-nowrap">
                    {format(new Date(app.created_at), "d MMM yyyy", { locale: sv })}
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
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusVariant(app.status)} className="gap-1">
                        {getStatusIcon(app.status)}
                        {getStatusLabel(app.status)}
                      </Badge>
                      {app.status === "invited" && app.invitation_expires_at && isPast(new Date(app.invitation_expires_at)) && (
                        <Badge variant="destructive" className="gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Utgången
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {app.status === "pending" && (
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              onStatusChange(app.id, "reviewing");
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Markera som under granskning
                          </DropdownMenuItem>
                        )}
                        {(app.status === "pending" || app.status === "reviewing") && (
                          <>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleInvite(app);
                              }}
                            >
                              <Send className="h-4 w-4 mr-2" />
                              Skicka inbjudan
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                onStatusChange(app.id, "rejected");
                              }}
                            >
                              <X className="h-4 w-4 mr-2" />
                              Avvisa
                            </DropdownMenuItem>
                          </>
                        )}
                        {app.status === "invited" && app.invitation_sent_at && (
                          <>
                            <DropdownMenuItem disabled>
                              <Clock className="h-4 w-4 mr-2" />
                              Inbjudan skickad {format(new Date(app.invitation_sent_at), "d MMM", { locale: sv })}
                            </DropdownMenuItem>
                            {app.invitation_expires_at && isPast(new Date(app.invitation_expires_at)) && (
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onResendInvitation(app);
                                }}
                              >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Skicka om inbjudan
                              </DropdownMenuItem>
                            )}
                          </>
                        )}
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(app.portfolio_url, "_blank");
                          }}
                        >
                          <LinkIcon className="h-4 w-4 mr-2" />
                          Öppna portfolio
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                {expandedId === app.id && (
                  <TableRow key={`${app.id}-details`}>
                    <TableCell colSpan={6} className="bg-muted/30">
                      <div className="p-4 space-y-4">
                        <div>
                          <h4 className="font-medium flex items-center gap-2 mb-2">
                            <FileText className="h-4 w-4" />
                            Svar på frågor
                          </h4>
                          <div className="grid gap-4 md:grid-cols-3">
                            <div className="bg-background p-3 rounded-lg border">
                              <p className="text-sm text-muted-foreground mb-1">
                                Hur känner du dig?
                              </p>
                              <p className="text-sm">{app.q1_feeling}</p>
                            </div>
                            <div className="bg-background p-3 rounded-lg border">
                              <p className="text-sm text-muted-foreground mb-1">
                                Hur strukturerar du ditt arbete?
                              </p>
                              <p className="text-sm">{app.q2_structure}</p>
                            </div>
                            <div className="bg-background p-3 rounded-lg border">
                              <p className="text-sm text-muted-foreground mb-1">
                                Hur hanterar du press?
                              </p>
                              <p className="text-sm">{app.q3_pressure}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge
                            variant={app.code_of_conduct_accepted ? "default" : "destructive"}
                          >
                            {app.code_of_conduct_accepted
                              ? "Godkänt uppförandekod"
                              : "Ej godkänt"}
                          </Badge>
                          {app.invitation_expires_at && (
                            <span className="text-sm text-muted-foreground">
                              Inbjudan giltig till:{" "}
                              {format(new Date(app.invitation_expires_at), "d MMM yyyy", {
                                locale: sv,
                              })}
                            </span>
                          )}
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

      <InviteDialog
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
        application={selectedApplication}
        onConfirm={handleConfirmInvite}
      />
    </>
  );
}
