import type { GlobalConfig } from 'payload'
import { linkField } from '../fields/link'

export const Header: GlobalConfig = {
  slug: 'header',
  access: { read: () => true },
  fields: [
    { name: 'logo', type: 'upload', relationTo: 'media' },
    {
      name: 'navItems',
      type: 'array',
      maxRows: 8,
      localized: true,
      fields: [linkField('link')],
    },
    linkField('cta'),
  ],
}
