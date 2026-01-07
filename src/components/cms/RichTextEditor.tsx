import { useState, useRef, useCallback, useEffect } from "react";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link,
  Heading1,
  Heading2,
  Heading3,
  Type,
  Check,
  X,
  Pencil,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onSave: (value: string) => Promise<boolean> | void;
  className?: string;
  editable?: boolean;
  placeholder?: string;
}

export function RichTextEditor({
  value,
  onSave,
  className,
  editable = false,
  placeholder = "Klicka för att redigera...",
}: RichTextEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const originalValue = useRef(value);

  useEffect(() => {
    if (editorRef.current && !isEditing) {
      editorRef.current.innerHTML = value;
    }
  }, [value, isEditing]);

  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  }, []);

  const handleSave = async () => {
    if (!editorRef.current) return;

    const newValue = editorRef.current.innerHTML;
    if (newValue === originalValue.current) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    const result = await onSave(newValue);
    setIsSaving(false);

    if (result !== false) {
      originalValue.current = newValue;
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    if (editorRef.current) {
      editorRef.current.innerHTML = originalValue.current;
    }
    setIsEditing(false);
  };

  const insertLink = () => {
    const url = prompt("Ange URL:");
    if (url) {
      execCommand("createLink", url);
    }
  };

  const formatBlock = (tag: string) => {
    execCommand("formatBlock", tag);
  };

  if (!editable) {
    return (
      <div
        className={cn("prose prose-stone dark:prose-invert max-w-none", className)}
        dangerouslySetInnerHTML={{ __html: value }}
      />
    );
  }

  if (isEditing) {
    return (
      <div className="relative border-2 border-primary/50 rounded-lg overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-wrap gap-1 p-2 bg-muted border-b border-border">
          <button
            onClick={() => formatBlock("p")}
            className="p-2 hover:bg-background rounded"
            title="Paragraf"
          >
            <Type className="h-4 w-4" />
          </button>
          <button
            onClick={() => formatBlock("h1")}
            className="p-2 hover:bg-background rounded"
            title="Rubrik 1"
          >
            <Heading1 className="h-4 w-4" />
          </button>
          <button
            onClick={() => formatBlock("h2")}
            className="p-2 hover:bg-background rounded"
            title="Rubrik 2"
          >
            <Heading2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => formatBlock("h3")}
            className="p-2 hover:bg-background rounded"
            title="Rubrik 3"
          >
            <Heading3 className="h-4 w-4" />
          </button>
          <div className="w-px bg-border mx-1" />
          <button
            onClick={() => execCommand("bold")}
            className="p-2 hover:bg-background rounded"
            title="Fetstil"
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            onClick={() => execCommand("italic")}
            className="p-2 hover:bg-background rounded"
            title="Kursiv"
          >
            <Italic className="h-4 w-4" />
          </button>
          <div className="w-px bg-border mx-1" />
          <button
            onClick={() => execCommand("insertUnorderedList")}
            className="p-2 hover:bg-background rounded"
            title="Punktlista"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => execCommand("insertOrderedList")}
            className="p-2 hover:bg-background rounded"
            title="Numrerad lista"
          >
            <ListOrdered className="h-4 w-4" />
          </button>
          <button
            onClick={insertLink}
            className="p-2 hover:bg-background rounded"
            title="Infoga länk"
          >
            <Link className="h-4 w-4" />
          </button>
          <div className="flex-1" />
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="p-2 bg-primary text-primary-foreground rounded hover:opacity-90 disabled:opacity-50"
            title="Spara"
          >
            <Check className="h-4 w-4" />
          </button>
          <button
            onClick={handleCancel}
            disabled={isSaving}
            className="p-2 bg-muted-foreground/20 rounded hover:opacity-90"
            title="Avbryt"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Editor */}
        <div
          ref={editorRef}
          contentEditable
          className={cn(
            "min-h-[200px] p-4 focus:outline-none prose prose-stone dark:prose-invert max-w-none",
            className
          )}
          dangerouslySetInnerHTML={{ __html: value }}
        />
      </div>
    );
  }

  return (
    <div className="relative group">
      <div
        className={cn("prose prose-stone dark:prose-invert max-w-none cursor-pointer", className)}
        dangerouslySetInnerHTML={{ __html: value || `<p class="text-muted-foreground">${placeholder}</p>` }}
        onClick={() => {
          originalValue.current = value;
          setIsEditing(true);
        }}
      />
      <button
        onClick={() => {
          originalValue.current = value;
          setIsEditing(true);
        }}
        className="absolute top-0 right-0 p-1.5 bg-primary text-primary-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
        title="Redigera"
      >
        <Pencil className="h-3 w-3" />
      </button>
    </div>
  );
}
