import { useState, useRef, useCallback } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string;
  onUpload: (url: string) => Promise<boolean> | void;
  folder?: string;
  className?: string;
  aspectRatio?: "square" | "video" | "hero";
}

export function ImageUpload({
  value,
  onUpload,
  folder = "general",
  className,
  aspectRatio = "video",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const aspectClasses = {
    square: "aspect-square",
    video: "aspect-video",
    hero: "aspect-[21/9]",
  };

  const handleFileSelect = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        toast.error("Endast bilder är tillåtna");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Bilden får max vara 5MB");
        return;
      }

      // Show preview
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);

      setIsUploading(true);

      try {
        // Generate unique filename
        const ext = file.name.split(".").pop();
        const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("cms-images")
          .upload(filename, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          throw uploadError;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from("cms-images")
          .getPublicUrl(filename);

        await onUpload(urlData.publicUrl);
        toast.success("Bilden har laddats upp");
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Kunde inte ladda upp bilden");
        setPreview(null);
      } finally {
        setIsUploading(false);
      }
    },
    [folder, onUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const displayImage = preview || value;

  return (
    <div
      className={cn(
        "relative border-2 border-dashed border-border rounded-lg overflow-hidden cursor-pointer hover:border-primary/50 transition-colors",
        aspectClasses[aspectRatio],
        className
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={() => inputRef.current?.click()}
    >
      {displayImage ? (
        <>
          <img
            src={displayImage}
            alt="Uppladdad bild"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="text-white text-center">
              <Upload className="h-8 w-8 mx-auto mb-2" />
              <span className="text-sm">Byt bild</span>
            </div>
          </div>
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
          <ImageIcon className="h-10 w-10 mb-3" />
          <span className="text-sm font-medium">Dra och släpp eller klicka</span>
          <span className="text-xs mt-1">Max 5MB, JPG/PNG/WebP</span>
        </div>
      )}

      {isUploading && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelect(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
