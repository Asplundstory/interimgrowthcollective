"use client";

import { useState, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft, Pencil } from "lucide-react";
import { Section } from "@/components/editorial";
import { InsightEditor } from "@/components/cms";
import { useInsights, Insight } from "@/hooks/useInsights";

export default function InsightPage() {
  const { slug } = useParams<{ slug: string }>();
  const { getInsightBySlug, updateInsight, deleteInsight, isAdmin, isLoading: isAdminLoading } = useInsights();
  const [post, setPost] = useState<Insight | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!slug) {
      setNotFound(true);
      setIsLoading(false);
      return;
    }

    getInsightBySlug(slug).then((data) => {
      if (!data) {
        setNotFound(true);
      } else {
        setPost(data);
      }
      setIsLoading(false);
    });
  }, [slug, getInsightBySlug]);

  if (isLoading) {
    return (
      <Section spacing="large">
        <div className="text-muted-foreground">Laddar...</div>
      </Section>
    );
  }

  if (notFound || !post) {
    return <Navigate to="/insights" replace />;
  }

  // Don't show unpublished posts to non-admins
  if (!post.published && !isAdmin) {
    return <Navigate to="/insights" replace />;
  }

  // Simple markdown-like rendering
  const renderContent = (content: string) => {
    return content.split("\n\n").map((block, index) => {
      if (block.startsWith("## ")) {
        return (
          <h2 key={index} className="font-serif text-xl md:text-2xl text-editorial mt-10 mb-4">
            {block.replace("## ", "")}
          </h2>
        );
      }
      return (
        <p key={index} className="text-muted-foreground leading-relaxed mb-6">
          {block}
        </p>
      );
    });
  };

  const handleUpdate = async (data: Partial<Insight>) => {
    const success = await updateInsight(post.id, data);
    if (success) {
      // Refresh post data
      const updated = await getInsightBySlug(data.slug || slug!);
      if (updated) setPost(updated);
    }
    return success;
  };

  return (
    <>
      {/* Back link */}
      <div className="container-editorial pt-8 flex items-center justify-between">
        <Link
          to="/insights"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Alla inlägg
        </Link>
        {isAdmin && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
          >
            <Pencil className="h-4 w-4" />
            Redigera
          </button>
        )}
      </div>

      {/* Header */}
      <Section spacing="default">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-label">
              {new Date(post.date).toLocaleDateString("sv-SE", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            {!post.published && (
              <span className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-0.5 rounded">
                Utkast
              </span>
            )}
          </div>
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-editorial">
            {post.title}
          </h1>
          {post.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-muted-foreground bg-muted px-2 py-1"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Section>

      {/* Featured Image */}
      {post.image_url && (
        <Section spacing="default" className="pt-0">
          <div className="max-w-3xl rounded-lg overflow-hidden">
            <img 
              src={post.image_url} 
              alt={post.title} 
              className="w-full aspect-video object-cover"
            />
          </div>
        </Section>
      )}

      {/* Content */}
      <Section spacing="large" className="pt-0">
        <article className="max-w-2xl">{renderContent(post.content)}</article>
      </Section>

      {/* Edit modal */}
      {isEditing && (
        <InsightEditor
          insight={post}
          onSave={handleUpdate}
          onDelete={() => deleteInsight(post.id)}
          onClose={() => setIsEditing(false)}
        />
      )}
    </>
  );
}
