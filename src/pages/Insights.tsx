"use client";

import { useState } from "react";
import { Plus, Pencil } from "lucide-react";
import { Hero, Section, EditorialCard } from "@/components/editorial";
import { EditableText, InsightEditor } from "@/components/cms";
import { useInsights, Insight } from "@/hooks/useInsights";
import { useCmsContent } from "@/hooks/useCmsContent";
import defaultHeroImage from "@/assets/hero-insights.jpg";

const defaultContent = {
  hero: {
    headline: "Insights",
    subheadline: "Reflektioner om kvalitet, kreativitet och att leverera under press.",
  },
  heroImage: "",
};

export default function InsightsPage() {
  const { insights, isLoading, isAdmin, createInsight, updateInsight, deleteInsight } = useInsights();
  const { content, updateField } = useCmsContent("insights", defaultContent);
  const [editingInsight, setEditingInsight] = useState<Insight | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Filter: admins see all, others see only published
  const visibleInsights = isAdmin ? insights : insights.filter((i) => i.published);

  const heroImage = content.heroImage || defaultHeroImage;

  return (
    <>
      {/* Hero */}
      <Hero
        headline={
          <EditableText
            value={content.hero.headline}
            onSave={(v) => updateField("hero.headline", v)}
            editable={isAdmin}
            tag="span"
          />
        }
        subheadline={
          <EditableText
            value={content.hero.subheadline}
            onSave={(v) => updateField("hero.subheadline", v)}
            editable={isAdmin}
            tag="span"
          />
        }
        size="medium"
        backgroundImage={heroImage}
        onImageChange={(url) => updateField("heroImage", url)}
        isAdmin={isAdmin}
      />

      {/* Admin: Add new button */}
      {isAdmin && (
        <div className="container-editorial py-6 border-b border-border">
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Ny artikel
          </button>
        </div>
      )}

      {/* Posts */}
      <Section spacing="large">
        {isLoading ? (
          <div className="text-muted-foreground">Laddar...</div>
        ) : visibleInsights.length === 0 ? (
          <div className="text-muted-foreground">Inga inlägg ännu.</div>
        ) : (
          <div className="space-y-0">
            {visibleInsights.map((post) => (
              <div key={post.id} className="relative group">
                <EditorialCard
                  title={post.title}
                  description={post.excerpt}
                  href={`/insights/${post.slug}`}
                  meta={
                    <>
                      {new Date(post.date).toLocaleDateString("sv-SE", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                      {!post.published && (
                        <span className="ml-2 text-xs bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-0.5 rounded">
                          Utkast
                        </span>
                      )}
                    </>
                  }
                  tags={post.tags}
                />
                {isAdmin && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setEditingInsight(post);
                    }}
                    className="absolute top-4 right-4 p-2 bg-primary text-primary-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    title="Redigera"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Create modal */}
      {isCreating && (
        <InsightEditor
          isNew
          onSave={createInsight}
          onClose={() => setIsCreating(false)}
        />
      )}

      {/* Edit modal */}
      {editingInsight && (
        <InsightEditor
          insight={editingInsight}
          onSave={(data) => updateInsight(editingInsight.id, data)}
          onDelete={() => deleteInsight(editingInsight.id)}
          onClose={() => setEditingInsight(null)}
        />
      )}
    </>
  );
}
