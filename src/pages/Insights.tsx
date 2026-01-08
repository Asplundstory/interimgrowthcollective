"use client";

import { useState } from "react";
import { Plus, Pencil } from "lucide-react";
import { Hero, Section, EditorialCard } from "@/components/editorial";
import { InsightEditor } from "@/components/cms";
import { SEO } from "@/components/SEO";
import { useInsights, Insight } from "@/hooks/useInsights";
import { useLanguage } from "@/hooks/useLanguage";
import defaultHeroImage from "@/assets/hero-insights.jpg";

export default function InsightsPage() {
  const { insights, isLoading, isAdmin, createInsight, updateInsight, deleteInsight } = useInsights();
  const { t, getLocalizedPath, language } = useLanguage();
  const [editingInsight, setEditingInsight] = useState<Insight | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Filter: admins see all, others see only published
  const visibleInsights = isAdmin ? insights : insights.filter((i) => i.published);

  return (
    <>
      <SEO 
        title={t("insights.hero.headline")}
        description={t("insights.hero.subheadline")}
        breadcrumbs={[
          { name: language === "en" ? "Home" : "Hem", href: getLocalizedPath("/") },
          { name: t("insights.hero.headline"), href: getLocalizedPath("/insights") },
        ]}
      />
      {/* Hero */}
      <Hero
        headline={t("insights.hero.headline")}
        subheadline={t("insights.hero.subheadline")}
        size="medium"
        backgroundImage={defaultHeroImage}
      />

      {/* Admin: Add new button */}
      {isAdmin && (
        <div className="container-editorial py-6 border-b border-border">
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            {t("insights.newArticle")}
          </button>
        </div>
      )}

      {/* Posts */}
      <Section spacing="large">
        <h2 className="sr-only">{language === "en" ? "All Articles" : "Alla artiklar"}</h2>
        {isLoading ? (
          <div className="text-muted-foreground">{t("common.loading")}</div>
        ) : visibleInsights.length === 0 ? (
          <div className="text-muted-foreground">{t("insights.empty")}</div>
        ) : (
          <div className="space-y-0">
            {visibleInsights.map((post) => (
              <div key={post.id} className="relative group">
                <EditorialCard
                  title={post.title}
                  description={post.excerpt}
                  href={getLocalizedPath(`/insights/${post.slug}`)}
                  image={post.image_url}
                  meta={
                    <>
                      {new Date(post.date).toLocaleDateString(language === "en" ? "en-US" : "sv-SE", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                      {!post.published && (
                        <span className="ml-2 text-xs bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-0.5 rounded">
                          {t("insights.draft")}
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
                    title={language === "en" ? "Edit" : "Redigera"}
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
