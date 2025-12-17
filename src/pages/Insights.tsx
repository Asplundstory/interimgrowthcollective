import { useState, useEffect } from "react";
import { Hero, Section, EditorialCard } from "@/components/editorial";
import { getAllPosts, Post } from "@/content/adapter";

export default function InsightsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    getAllPosts().then((data) => {
      setPosts(data);
      setIsLoading(false);
    });
  }, []);
  
  return (
    <>
      {/* Hero */}
      <Hero 
        headline="Insights"
        subheadline="Reflektioner om kvalitet, kreativitet och att leverera under press."
        size="medium"
      />
      
      {/* Posts */}
      <Section spacing="large">
        {isLoading ? (
          <div className="text-muted-foreground">Laddar...</div>
        ) : posts.length === 0 ? (
          <div className="text-muted-foreground">Inga inlägg ännu.</div>
        ) : (
          <div className="space-y-0">
            {posts.map((post) => (
              <EditorialCard
                key={post.slug}
                title={post.title}
                description={post.excerpt}
                href={`/insights/${post.slug}`}
                meta={new Date(post.date).toLocaleDateString('sv-SE', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
                tags={post.tags}
              />
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
