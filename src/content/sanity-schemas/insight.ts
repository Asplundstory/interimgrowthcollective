// Sanity schema for Insights (blog posts)
// Copy this to your Sanity Studio project: schemas/insight.ts

export default {
  name: 'insight',
  title: 'Insights',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'publishedAt',
      title: 'Published Date',
      type: 'date',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      description: 'Short description for listings',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    },
    {
      name: 'body',
      title: 'Content',
      type: 'text',
      description: 'Full article content (markdown supported)',
    },
  ],
  preview: {
    select: {
      title: 'title',
      date: 'publishedAt',
    },
    prepare({ title, date }: { title: string; date: string }) {
      return {
        title,
        subtitle: date,
      };
    },
  },
};
