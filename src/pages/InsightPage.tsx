import { useState, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Section } from "@/components/editorial";
import { getPostBySlug, Post } from "@/content/adapter";

export default function InsightPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  
  useEffect(() => {
    if (!slug) {
      setNotFound(true);
      setIsLoading(false);
      return;
    }
    
    getPostBySlug(slug).then((data) => {
      if (!data) {
        setNotFound(true);
      } else {
        setPost(data);
      }
      setIsLoading(false);
    });
  }, [slug]);
  
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
  
  // Simple markdown-like rendering
  const renderContent = (content: string) => {
    return content.split('\n\n').map((block, index) => {
      if (block.startsWith('## ')) {
        return (
          <h2 key={index} className="font-serif text-xl md:text-2xl text-editorial mt-10 mb-4">
            {block.replace('## ', '')}
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
  
  return (
    <>
      {/* Back link */}
      <div className="container-editorial pt-8">
        <Link 
          to="/insights" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Alla inlägg
        </Link>
      </div>
      
      {/* Header */}
      <Section spacing="default">
        <div className="max-w-2xl">
          <span className="text-label block mb-4">
            {new Date(post.date).toLocaleDateString('sv-SE', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
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
      
      {/* Content */}
      <Section spacing="large" className="pt-0">
        <article className="max-w-2xl">
          {renderContent(post.content)}
        </article>
      </Section>
    </>
  );
}
