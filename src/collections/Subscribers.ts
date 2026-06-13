import type { CollectionConfig } from 'payload'

export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  labels: { singular: 'Subscriber', plural: 'Subscribers' },
  admin: { useAsTitle: 'email', defaultColumns: ['email', 'locale', 'createdAt'] },
  access: {
    // Public sign-up via the newsletter endpoint; reads/edits require auth.
    create: () => true,
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'email', type: 'email', required: true, unique: true, index: true },
    { name: 'locale', type: 'text' },
    { name: 'source', type: 'text', defaultValue: 'footer-form' },
  ],
}
