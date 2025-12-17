// Content adapter pattern
// Default implementation reads from local TypeScript files
// Can be swapped for CMS implementation later

import { insights } from './insights';

export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  content: string;
}

// Default adapter using local data
const localAdapter = {
  getAllPosts: async (): Promise<Post[]> => {
    return insights.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  },
  
  getPostBySlug: async (slug: string): Promise<Post | null> => {
    return insights.find(post => post.slug === slug) || null;
  },
  
  getPostsByTag: async (tag: string): Promise<Post[]> => {
    return insights.filter(post => 
      post.tags.some(t => t.toLowerCase() === tag.toLowerCase())
    );
  },
};

// Export functions that use the adapter
// When switching to CMS, only change the adapter implementation

export const getAllPosts = localAdapter.getAllPosts;
export const getPostBySlug = localAdapter.getPostBySlug;
export const getPostsByTag = localAdapter.getPostsByTag;

// For future CMS integration:
// 1. Create a new adapter file (e.g., cmsAdapter.ts)
// 2. Import and use that adapter instead of localAdapter
// 3. No changes needed in UI components
