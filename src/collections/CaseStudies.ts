import type { CollectionConfig } from 'payload'
import { seoField } from '../fields/seo'

export const CaseStudies: CollectionConfig = {
  slug: 'caseStudies',
  labels: { singular: 'Case Study', plural: 'Case Studies' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'industry', 'decisionSignal', 'updatedAt'],
  },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', localized: true, required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    { name: 'industry', type: 'text', localized: true },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    { name: 'publishedDate', type: 'date' },

    // ── Header chips (stored as text so locale-specific currency formats like
    //    "$4M" / "4 M$" render exactly as authored — no value can silently drop) ──
    { name: 'ebitdaLabel', type: 'text', localized: true, admin: { description: 'e.g. ~$800K' } },
    { name: 'askingPriceLabel', type: 'text', localized: true, admin: { description: 'e.g. $4M' } },
    { name: 'cardSummary', type: 'textarea', localized: true, admin: { description: 'Subtitle shown on the index card.' } },

    {
      name: 'decisionSignal',
      type: 'select',
      required: true,
      options: ['GO', 'PROCEED_WITH_CONDITIONS', 'NO_GO'],
      admin: { description: 'Drives the badge colour.' },
    },
    { name: 'decisionSignalLabel', type: 'text', localized: true, admin: { description: 'Display text, e.g. "PROCEED with conditions".' } },

    // ── Body sections ──
    {
      name: 'twoViews',
      type: 'group',
      fields: [
        { name: 'traditional', type: 'textarea', localized: true },
        { name: 'dvta', type: 'textarea', localized: true },
      ],
    },
    { name: 'setup', type: 'textarea', localized: true },
    {
      name: 'surfaced',
      type: 'group',
      label: 'What the assessment surfaced',
      fields: [
        { name: 'intro', type: 'textarea', localized: true },
        {
          name: 'metrics',
          type: 'array',
          localized: true,
          fields: [
            { name: 'label', type: 'text', localized: true, required: true },
            { name: 'value', type: 'text', localized: true, required: true },
            { name: 'note', type: 'textarea', localized: true },
          ],
        },
      ],
    },
    { name: 'evidence', type: 'textarea', localized: true },
    {
      name: 'decisionImpact',
      type: 'group',
      fields: [
        { name: 'body', type: 'textarea', localized: true },
        {
          name: 'stats',
          type: 'array',
          localized: true,
          fields: [
            { name: 'label', type: 'text', localized: true, required: true },
            { name: 'value', type: 'text', localized: true, required: true },
          ],
        },
      ],
    },
    { name: 'takeaway', type: 'textarea', localized: true },

    seoField,
  ],
}
