import { useState } from "react";
import { X, Check, Trash2, Eye, EyeOff, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Insight } from "@/hooks/useInsights";
import { ImageUpload } from "./ImageUpload";

interface InsightEditorProps {
  insight?: Insight;
  onSave: (insight: Omit<Insight, "id"> | Partial<Insight>) => Promise<boolean | Insight | null>;
  onDelete?: () => Promise<boolean>;
  onClose: () => void;
  isNew?: boolean;
}

export function InsightEditor({ 
  insight, 
  onSave, 
  onDelete, 
  onClose, 
  isNew = false 
}: InsightEditorProps) {
  const [title, setTitle] = useState(insight?.title || "");
  const [slug, setSlug] = useState(insight?.slug || "");
  const [excerpt, setExcerpt] = useState(insight?.excerpt || "");
  const [content, setContent] = useState(insight?.content || "");
  const [tags, setTags] = useState(insight?.tags?.join(", ") || "");
  const [date, setDate] = useState(insight?.date || new Date().toISOString().split("T")[0]);
  const [published, setPublished] = useState(insight?.published ?? false);
  const [imageUrl, setImageUrl] = useState(insight?.image_url || "");
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/å/g, "a")
      .replace(/ä/g, "a")
      .replace(/ö/g, "o")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (isNew) {
      setSlug(generateSlug(value));
    }
  };

  const handleSave = async () => {
    if (!title || !slug || !excerpt || !content) {
      return;
    }

    setIsSaving(true);
    
    const data = {
      title,
      slug,
      excerpt,
      content,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      date,
      published,
      image_url: imageUrl || null,
    };

    const result = await onSave(isNew ? data : { ...data, id: insight?.id });
    setIsSaving(false);
    
    if (result) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-background border border-border rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-serif text-lg">
            {isNew ? "Ny artikel" : "Redigera artikel"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-muted rounded-md transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Featured Image */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Huvudbild</label>
            <div className="flex items-start gap-4">
              {imageUrl ? (
                <div className="relative group">
                  <img 
                    src={imageUrl} 
                    alt="Featured" 
                    className="w-40 h-24 object-cover rounded-md border border-border"
                  />
                  <button
                    onClick={() => setImageUrl("")}
                    className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowImageUpload(true)}
                  className="w-40 h-24 border-2 border-dashed border-border rounded-md flex flex-col items-center justify-center gap-1 hover:border-primary/50 transition-colors"
                >
                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Lägg till bild</span>
                </button>
              )}
              {imageUrl && (
                <button
                  onClick={() => setShowImageUpload(true)}
                  className="text-sm text-primary hover:underline"
                >
                  Byt bild
                </button>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Titel</label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary"
                placeholder="Artikelns titel"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Slug (URL)</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary"
                placeholder="artikel-url"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Sammanfattning</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary resize-y min-h-[60px]"
              placeholder="Kort beskrivning som visas i listan"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Innehåll (Markdown)</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary resize-y min-h-[200px] font-mono"
              placeholder="## Rubrik&#10;&#10;Brödtext..."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Taggar (kommaseparerade)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary"
                placeholder="Kultur, Kreativitet"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Datum</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => setPublished(!published)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                published 
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                  : "bg-muted text-muted-foreground"
              )}
            >
              {published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              {published ? "Publicerad" : "Utkast"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border flex items-center justify-between">
          <div>
            {!isNew && onDelete && (
              <button
                onClick={async () => {
                  if (confirm("Är du säker på att du vill ta bort artikeln?")) {
                    const success = await onDelete();
                    if (success) onClose();
                  }
                }}
                className="flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                Ta bort
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Avbryt
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || !title || !slug || !excerpt || !content}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 disabled:opacity-50"
            >
              <Check className="h-4 w-4" />
              {isSaving ? "Sparar..." : "Spara"}
            </button>
          </div>
        </div>
      </div>

      {/* Image Upload Modal */}
      {showImageUpload && (
        <div className="fixed inset-0 z-[110] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-background border border-border rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Välj huvudbild</h3>
              <button
                onClick={() => setShowImageUpload(false)}
                className="p-1.5 hover:bg-muted rounded-md transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <ImageUpload
              value={imageUrl}
              onUpload={(url) => {
                setImageUrl(url);
                setShowImageUpload(false);
              }}
              folder="insights"
              aspectRatio="video"
            />
          </div>
        </div>
      )}
    </div>
  );
}
