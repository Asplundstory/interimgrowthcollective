// Content adapter pattern
// Switch between local data and Sanity CMS by changing USE_SANITY

import { insights } from './insights';
import { sanityAdapter } from './sanityAdapter';

// Set to true when you have configured your Sanity Project ID
const USE_SANITY = false;

export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  content: string;
}

// Local adapter using TypeScript files
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

// Select adapter based on configuration
const activeAdapter = USE_SANITY ? sanityAdapter : localAdapter;

// Export functions that use the active adapter
export const getAllPosts = activeAdapter.getAllPosts;
export const getPostBySlug = activeAdapter.getPostBySlug;
export const getPostsByTag = activeAdapter.getPostsByTag;
