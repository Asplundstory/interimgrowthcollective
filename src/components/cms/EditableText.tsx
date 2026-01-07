import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Check, X, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditableTextProps {
  value: string;
  onSave: (value: string) => Promise<boolean> | void;
  tag?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  className?: string;
  editable?: boolean;
  placeholder?: string;
}

export function EditableText({
  value,
  onSave,
  tag: Tag = "p",
  className,
  editable = false,
  placeholder = "Klicka för att redigera...",
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = async () => {
    if (editValue === value) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    const result = await onSave(editValue);
    setIsSaving(false);

    if (result !== false) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (!editable) {
    return <Tag className={className}>{value}</Tag>;
  }

  if (isEditing) {
    return (
      <div className="relative">
        <textarea
          ref={inputRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className={cn(
            "w-full bg-background border-2 border-primary/50 rounded-md p-3 resize-y focus:outline-none focus:border-primary min-h-[80px]",
            className
          )}
          style={{ 
            height: "auto",
            minHeight: `${Math.max(80, (editValue.split("\n").length + 1) * 24)}px`
          }}
          disabled={isSaving}
        />
        <div className="absolute top-2 right-2 flex gap-1">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="p-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 disabled:opacity-50 shadow-md"
            title="Spara (Enter)"
          >
            <Check className="h-4 w-4" />
          </button>
          <button
            onClick={handleCancel}
            disabled={isSaving}
            className="p-2 bg-muted text-muted-foreground rounded-md hover:opacity-90 shadow-md"
            title="Avbryt (Esc)"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      <Tag
        className={cn(className, "cursor-pointer")}
        onClick={() => setIsEditing(true)}
      >
        {value || placeholder}
      </Tag>
      <button
        onClick={() => setIsEditing(true)}
        className="absolute -top-2 -right-2 p-1.5 bg-primary text-primary-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
        title="Redigera"
      >
        <Pencil className="h-3 w-3" />
      </button>
    </div>
  );
}
