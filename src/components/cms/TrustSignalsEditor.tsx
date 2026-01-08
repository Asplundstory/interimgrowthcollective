"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Check, Quote, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
}

interface ClientLogo {
  id: string;
  name: string;
  logoUrl: string;
  href?: string;
}

interface TrustSignalsEditorProps {
  testimonials: Testimonial[];
  clientLogos: ClientLogo[];
  onCreateTestimonial: (data: { quote: string; author: string; role: string; company: string; quote_en?: string; role_en?: string }) => Promise<unknown>;
  onUpdateTestimonial: (id: string, data: Partial<{ quote: string; author: string; role: string; company: string; quote_en: string; role_en: string }>) => Promise<boolean>;
  onDeleteTestimonial: (id: string) => Promise<boolean>;
  onCreateClientLogo: (data: { name: string; logo_url: string; href?: string }) => Promise<unknown>;
  onUpdateClientLogo: (id: string, data: Partial<{ name: string; logo_url: string; href: string }>) => Promise<boolean>;
  onDeleteClientLogo: (id: string) => Promise<boolean>;
}

export function TrustSignalsEditor({
  testimonials,
  clientLogos,
  onCreateTestimonial,
  onUpdateTestimonial,
  onDeleteTestimonial,
  onCreateClientLogo,
  onUpdateClientLogo,
  onDeleteClientLogo,
}: TrustSignalsEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [editingLogo, setEditingLogo] = useState<ClientLogo | null>(null);
  const [newTestimonial, setNewTestimonial] = useState({ quote: "", author: "", role: "", company: "", quote_en: "", role_en: "" });
  const [newLogo, setNewLogo] = useState({ name: "", logo_url: "", href: "" });

  const handleCreateTestimonial = async () => {
    if (!newTestimonial.quote || !newTestimonial.author) return;
    await onCreateTestimonial(newTestimonial);
    setNewTestimonial({ quote: "", author: "", role: "", company: "", quote_en: "", role_en: "" });
  };

  const handleCreateLogo = async () => {
    if (!newLogo.name || !newLogo.logo_url) return;
    await onCreateClientLogo(newLogo);
    setNewLogo({ name: "", logo_url: "", href: "" });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Pencil className="h-4 w-4" />
          Redigera Trust Signals
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Hantera Trust Signals</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="testimonials" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="testimonials" className="gap-2">
              <Quote className="h-4 w-4" />
              Testimonials
            </TabsTrigger>
            <TabsTrigger value="logos" className="gap-2">
              <Image className="h-4 w-4" />
              Logotyper
            </TabsTrigger>
          </TabsList>

          <TabsContent value="testimonials" className="space-y-4 mt-4">
            {/* New testimonial form */}
            <div className="p-4 border border-dashed border-border rounded-lg space-y-3">
              <h4 className="font-medium text-sm">Lägg till ny testimonial</h4>
              <Textarea
                placeholder="Citat (svenska)"
                value={newTestimonial.quote}
                onChange={(e) => setNewTestimonial({ ...newTestimonial, quote: e.target.value })}
              />
              <Textarea
                placeholder="Citat (engelska, valfritt)"
                value={newTestimonial.quote_en}
                onChange={(e) => setNewTestimonial({ ...newTestimonial, quote_en: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Namn"
                  value={newTestimonial.author}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, author: e.target.value })}
                />
                <Input
                  placeholder="Företag"
                  value={newTestimonial.company}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, company: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Roll (svenska)"
                  value={newTestimonial.role}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, role: e.target.value })}
                />
                <Input
                  placeholder="Roll (engelska, valfritt)"
                  value={newTestimonial.role_en}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, role_en: e.target.value })}
                />
              </div>
              <Button onClick={handleCreateTestimonial} size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Lägg till
              </Button>
            </div>

            {/* Existing testimonials */}
            <AnimatePresence>
              {testimonials.map((t) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 border border-border rounded-lg"
                >
                  {editingTestimonial?.id === t.id ? (
                    <div className="space-y-3">
                      <Textarea
                        value={editingTestimonial.quote}
                        onChange={(e) => setEditingTestimonial({ ...editingTestimonial, quote: e.target.value })}
                      />
                      <div className="grid grid-cols-3 gap-2">
                        <Input
                          value={editingTestimonial.author}
                          onChange={(e) => setEditingTestimonial({ ...editingTestimonial, author: e.target.value })}
                        />
                        <Input
                          value={editingTestimonial.role}
                          onChange={(e) => setEditingTestimonial({ ...editingTestimonial, role: e.target.value })}
                        />
                        <Input
                          value={editingTestimonial.company}
                          onChange={(e) => setEditingTestimonial({ ...editingTestimonial, company: e.target.value })}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={async () => {
                            await onUpdateTestimonial(t.id, {
                              quote: editingTestimonial.quote,
                              author: editingTestimonial.author,
                              role: editingTestimonial.role,
                              company: editingTestimonial.company,
                            });
                            setEditingTestimonial(null);
                          }}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingTestimonial(null)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">"{t.quote}"</p>
                        <p className="text-sm font-medium">{t.author}, {t.role} – {t.company}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" onClick={() => setEditingTestimonial(t)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => onDeleteTestimonial(t.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="logos" className="space-y-4 mt-4">
            {/* New logo form */}
            <div className="p-4 border border-dashed border-border rounded-lg space-y-3">
              <h4 className="font-medium text-sm">Lägg till ny logotyp</h4>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Företagsnamn"
                  value={newLogo.name}
                  onChange={(e) => setNewLogo({ ...newLogo, name: e.target.value })}
                />
                <Input
                  placeholder="Länk (valfritt)"
                  value={newLogo.href}
                  onChange={(e) => setNewLogo({ ...newLogo, href: e.target.value })}
                />
              </div>
              <Input
                placeholder="Logotyp URL"
                value={newLogo.logo_url}
                onChange={(e) => setNewLogo({ ...newLogo, logo_url: e.target.value })}
              />
              <Button onClick={handleCreateLogo} size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Lägg till
              </Button>
            </div>

            {/* Existing logos */}
            <AnimatePresence>
              {clientLogos.map((l) => (
                <motion.div
                  key={l.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 border border-border rounded-lg"
                >
                  {editingLogo?.id === l.id ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          value={editingLogo.name}
                          onChange={(e) => setEditingLogo({ ...editingLogo, name: e.target.value })}
                        />
                        <Input
                          value={editingLogo.href || ""}
                          onChange={(e) => setEditingLogo({ ...editingLogo, href: e.target.value })}
                          placeholder="Länk"
                        />
                      </div>
                      <Input
                        value={editingLogo.logoUrl}
                        onChange={(e) => setEditingLogo({ ...editingLogo, logoUrl: e.target.value })}
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={async () => {
                            await onUpdateClientLogo(l.id, {
                              name: editingLogo.name,
                              logo_url: editingLogo.logoUrl,
                              href: editingLogo.href || undefined,
                            });
                            setEditingLogo(null);
                          }}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingLogo(null)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        {l.logoUrl && (
                          <img src={l.logoUrl} alt={l.name} className="h-8 w-auto object-contain" />
                        )}
                        <span className="font-medium">{l.name}</span>
                      </div>
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" onClick={() => setEditingLogo(l)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => onDeleteClientLogo(l.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {clientLogos.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Inga logotyper tillagda ännu
              </p>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
