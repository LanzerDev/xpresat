import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    mimeTypes: ['image/svg+xml', 'image/png', 'image/jpeg', 'image/gif', 'image/webp'],
    staticDir: 'media',
    pasteURL: {
      allowList: [
        { hostname: '*', protocol: 'https' },
        { hostname: '*', protocol: 'http' },
      ],
    },
  },
}
