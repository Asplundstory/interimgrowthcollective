// Sanity schema for Static Pages
// Copy this to your Sanity Studio project: schemas/page.ts

export default {
  name: 'page',
  title: 'Pages',
  type: 'document',
  fields: [
    {
      name: 'pageId',
      title: 'Page ID',
      type: 'string',
      description: 'Unique identifier: home, forCompanies, forCreators, about, contact',
      options: {
        list: [
          { title: 'Home', value: 'home' },
          { title: 'For Companies', value: 'forCompanies' },
          { title: 'For Creators', value: 'forCreators' },
          { title: 'About', value: 'about' },
          { title: 'Contact', value: 'contact' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      fields: [
        { name: 'headline', title: 'Headline', type: 'string' },
        { name: 'subheadline', title: 'Subheadline', type: 'string' },
        { name: 'cta', title: 'CTA Button Text', type: 'string' },
      ],
    },
    {
      name: 'intro',
      title: 'Introduction',
      type: 'object',
      fields: [
        { name: 'text', title: 'Text', type: 'text', rows: 4 },
      ],
    },
    {
      name: 'valueProposition',
      title: 'Value Proposition (Home only)',
      type: 'object',
      hidden: ({ document }: { document: { pageId?: string } }) => document?.pageId !== 'home',
      fields: [
        { name: 'headline', title: 'Headline', type: 'string' },
        {
          name: 'items',
          title: 'Items',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'title', title: 'Title', type: 'string' },
                { name: 'description', title: 'Description', type: 'text', rows: 2 },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'process',
      title: 'Process (For Companies only)',
      type: 'object',
      hidden: ({ document }: { document: { pageId?: string } }) => document?.pageId !== 'forCompanies',
      fields: [
        { name: 'headline', title: 'Headline', type: 'string' },
        {
          name: 'steps',
          title: 'Steps',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'title', title: 'Title', type: 'string' },
                { name: 'description', title: 'Description', type: 'text', rows: 2 },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'expectations',
      title: 'Expectations (For Creators only)',
      type: 'object',
      hidden: ({ document }: { document: { pageId?: string } }) => document?.pageId !== 'forCreators',
      fields: [
        {
          name: 'whatYouGet',
          title: 'What You Get',
          type: 'object',
          fields: [
            { name: 'headline', title: 'Headline', type: 'string' },
            { name: 'items', title: 'Items', type: 'array', of: [{ type: 'string' }] },
          ],
        },
        {
          name: 'whatWeExpect',
          title: 'What We Expect',
          type: 'object',
          fields: [
            { name: 'headline', title: 'Headline', type: 'string' },
            { name: 'items', title: 'Items', type: 'array', of: [{ type: 'string' }] },
          ],
        },
      ],
    },
    {
      name: 'story',
      title: 'Story (About only)',
      type: 'object',
      hidden: ({ document }: { document: { pageId?: string } }) => document?.pageId !== 'about',
      fields: [
        { name: 'text', title: 'Text', type: 'text', rows: 10 },
      ],
    },
    {
      name: 'values',
      title: 'Values (About only)',
      type: 'object',
      hidden: ({ document }: { document: { pageId?: string } }) => document?.pageId !== 'about',
      fields: [
        { name: 'headline', title: 'Headline', type: 'string' },
        {
          name: 'items',
          title: 'Items',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'title', title: 'Title', type: 'string' },
                { name: 'description', title: 'Description', type: 'text', rows: 2 },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'cta',
      title: 'CTA Section',
      type: 'object',
      fields: [
        { name: 'headline', title: 'Headline', type: 'string' },
        { name: 'text', title: 'Text', type: 'text', rows: 2 },
        { name: 'buttonText', title: 'Button Text', type: 'string' },
      ],
    },
    {
      name: 'form',
      title: 'Form Settings',
      type: 'object',
      hidden: ({ document }: { document: { pageId?: string } }) => 
        !['forCreators', 'contact'].includes(document?.pageId || ''),
      fields: [
        { name: 'headline', title: 'Headline', type: 'string' },
        { name: 'submitText', title: 'Submit Button Text', type: 'string' },
        { name: 'successMessage', title: 'Success Message', type: 'text', rows: 2 },
      ],
    },
  ],
  preview: {
    select: {
      pageId: 'pageId',
      headline: 'hero.headline',
    },
    prepare({ pageId, headline }: { pageId: string; headline: string }) {
      const titles: Record<string, string> = {
        home: 'Home',
        forCompanies: 'For Companies',
        forCreators: 'For Creators',
        about: 'About',
        contact: 'Contact',
      };
      return {
        title: titles[pageId] || pageId,
        subtitle: headline,
      };
    },
  },
};
