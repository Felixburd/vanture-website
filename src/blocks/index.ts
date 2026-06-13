import type { Block, Field } from 'payload'
import { linksField } from '../fields/link'

/** Hero — headline, subhead, CTA buttons. */
export const HeroBlock: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',
  labels: { singular: 'Hero', plural: 'Heroes' },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true },
    { name: 'headline', type: 'textarea', localized: true, required: true },
    { name: 'subhead', type: 'textarea', localized: true },
    linksField('buttons'),
  ],
}

/** Intro + stat cards (the "47% / 30% / 40–60%" row). */
export const StatsBlock: Block = {
  slug: 'stats',
  interfaceName: 'StatsBlock',
  labels: { singular: 'Stats Row', plural: 'Stats Rows' },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true },
    { name: 'heading', type: 'textarea', localized: true },
    { name: 'body', type: 'textarea', localized: true },
    {
      name: 'stats',
      type: 'array',
      fields: [
        { name: 'value', type: 'text', localized: true, required: true },
        { name: 'label', type: 'textarea', localized: true, required: true },
        { name: 'source', type: 'text', localized: true },
      ],
    },
  ],
}

/** The DVTA sample-assessment panel: score cards + findings table + decision. */
export const DvtaPanelBlock: Block = {
  slug: 'dvtaPanel',
  interfaceName: 'DvtaPanelBlock',
  labels: { singular: 'DVTA Demo Panel', plural: 'DVTA Demo Panels' },
  fields: [
    { name: 'panelLabel', type: 'text', localized: true },
    {
      name: 'tabs',
      type: 'array',
      labels: { singular: 'Tab', plural: 'Tabs' },
      fields: [{ name: 'label', type: 'text', localized: true, required: true }],
    },
    {
      name: 'scoreCards',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', localized: true, required: true },
        { name: 'value', type: 'number', required: true },
        {
          name: 'status',
          type: 'select',
          required: true,
          options: ['GREEN', 'AMBER', 'CRITICAL'],
        },
      ],
    },
    {
      name: 'findings',
      type: 'array',
      fields: [
        { name: 'finding', type: 'text', localized: true, required: true },
        { name: 'lens', type: 'text', localized: true, required: true },
        {
          name: 'status',
          type: 'select',
          required: true,
          options: ['GREEN', 'AMBER', 'CRITICAL'],
        },
      ],
    },
    {
      name: 'decision',
      type: 'group',
      fields: [
        { name: 'signal', type: 'text', localized: true },
        { name: 'text', type: 'textarea', localized: true },
      ],
    },
    { name: 'heading', type: 'textarea', localized: true },
    { name: 'body', type: 'textarea', localized: true },
    linksField('buttons'),
  ],
}

/** The four governance lenses. */
export const LensesBlock: Block = {
  slug: 'lenses',
  interfaceName: 'LensesBlock',
  labels: { singular: 'Four Lenses', plural: 'Four Lenses' },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true },
    { name: 'heading', type: 'textarea', localized: true },
    { name: 'body', type: 'textarea', localized: true },
    {
      name: 'lenses',
      type: 'array',
      fields: [
        { name: 'code', type: 'text', required: true },
        { name: 'title', type: 'text', localized: true, required: true },
        { name: 'description', type: 'textarea', localized: true, required: true },
        { name: 'failurePercent', type: 'text' },
        { name: 'failureLabel', type: 'text', localized: true },
      ],
    },
  ],
}

/** Audience cards (Advisors / Owners / Buyers / Mergers). */
export const AudienceBlock: Block = {
  slug: 'audience',
  interfaceName: 'AudienceBlock',
  labels: { singular: 'Audience Cards', plural: 'Audience Cards' },
  fields: [
    {
      name: 'cards',
      type: 'array',
      fields: [
        { name: 'eyebrow', type: 'text', localized: true },
        { name: 'title', type: 'text', localized: true, required: true },
        { name: 'body', type: 'textarea', localized: true },
        linksField('buttons'),
      ],
    },
  ],
}

/** Traditional DD vs DVTA comparison table. */
export const ComparisonBlock: Block = {
  slug: 'comparison',
  interfaceName: 'ComparisonBlock',
  labels: { singular: 'Comparison Table', plural: 'Comparison Tables' },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true },
    { name: 'heading', type: 'textarea', localized: true },
    { name: 'colTraditional', type: 'text', localized: true, defaultValue: 'Traditional DD' },
    { name: 'colDvta', type: 'text', localized: true, defaultValue: 'DVTA' },
    {
      name: 'rows',
      type: 'array',
      fields: [
        { name: 'dimension', type: 'text', localized: true, required: true },
        { name: 'traditional', type: 'text', localized: true, required: true },
        { name: 'dvta', type: 'text', localized: true, required: true },
      ],
    },
  ],
}

/** Generic centered CTA band. */
export const CtaBlock: Block = {
  slug: 'cta',
  interfaceName: 'CtaBlock',
  labels: { singular: 'CTA Band', plural: 'CTA Bands' },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true },
    { name: 'heading', type: 'textarea', localized: true },
    { name: 'body', type: 'textarea', localized: true },
    linksField('buttons'),
  ],
}

/** Free-form rich text (used by the About body). */
export const RichTextBlock: Block = {
  slug: 'richText',
  interfaceName: 'RichTextBlock',
  labels: { singular: 'Rich Text', plural: 'Rich Text' },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true },
    { name: 'heading', type: 'textarea', localized: true },
    { name: 'content', type: 'richText', localized: true },
  ],
}

/** Section background tone, shared by every block. */
const toneField: Field = {
  name: 'tone',
  type: 'select',
  defaultValue: 'light',
  options: [
    { label: 'Light (#f2f2f2)', value: 'light' },
    { label: 'White', value: 'white' },
    { label: 'Dark (#010202)', value: 'dark' },
    { label: 'Gray dark (#4d4d4d)', value: 'graydark' },
  ],
  admin: { description: 'Background tone for this section.' },
}

export const layoutBlocks: Block[] = [
  HeroBlock,
  StatsBlock,
  DvtaPanelBlock,
  LensesBlock,
  AudienceBlock,
  ComparisonBlock,
  CtaBlock,
  RichTextBlock,
].map((b) => ({ ...b, fields: [toneField, ...b.fields] }))
