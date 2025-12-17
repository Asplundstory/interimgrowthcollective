import { createClient } from '@sanity/client';
import type { Post } from './adapter';

// Configure your Sanity project here
const SANITY_PROJECT_ID = 'YOUR_PROJECT_ID'; // Replace with your Sanity Project ID
const SANITY_DATASET = 'production';
const SANITY_API_VERSION = '2024-01-01';

export const sanityClient = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: SANITY_API_VERSION,
  useCdn: true, // Use CDN for faster responses in production
});

// GROQ queries
const postFields = `
  "slug": slug.current,
  title,
  "date": publishedAt,
  excerpt,
  tags,
  "content": body
`;

export const sanityAdapter = {
  getAllPosts: async (): Promise<Post[]> => {
    const query = `*[_type == "insight"] | order(publishedAt desc) {
      ${postFields}
    }`;
    
    try {
      const posts = await sanityClient.fetch<Post[]>(query);
      return posts;
    } catch (error) {
      console.error('Error fetching posts from Sanity:', error);
      return [];
    }
  },

  getPostBySlug: async (slug: string): Promise<Post | null> => {
    const query = `*[_type == "insight" && slug.current == $slug][0] {
      ${postFields}
    }`;
    
    try {
      const post = await sanityClient.fetch<Post | null>(query, { slug });
      return post;
    } catch (error) {
      console.error('Error fetching post from Sanity:', error);
      return null;
    }
  },

  getPostsByTag: async (tag: string): Promise<Post[]> => {
    const query = `*[_type == "insight" && $tag in tags] | order(publishedAt desc) {
      ${postFields}
    }`;
    
    try {
      const posts = await sanityClient.fetch<Post[]>(query, { tag: tag.toLowerCase() } as Record<string, string>);
      return posts;
    } catch (error) {
      console.error('Error fetching posts by tag from Sanity:', error);
      return [];
    }
  },
};
