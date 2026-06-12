import type { CollectionConfig, CollectionBeforeChangeHook } from 'payload'

const formatSlug = (val: string): string =>
  val
    .trim()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
    .toLowerCase()

const beforeChangeHook: CollectionBeforeChangeHook = ({ data, originalDoc }) => {
  if (data?.title && (!data.slug || data.title !== originalDoc?.title)) {
    data.slug = formatSlug(data.title)
  }
  return data
}

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeChange: [beforeChangeHook],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Destacado en Home',
      defaultValue: false,
    },
    {
      name: 'mediaGallery',
      type: 'array',
      label: 'Galería Multimedia',
      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          options: [
            { label: 'Imagen', value: 'image' },
            { label: 'Video Subido (MP4)', value: 'video_upload' },
            { label: 'Video Externo (YouTube/Vimeo)', value: 'video_external' },
          ],
          defaultValue: 'image',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'image',
          },
        },
        {
          name: 'videoFile',
          type: 'upload',
          relationTo: 'media',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'video_upload',
          },
        },
        {
          name: 'videoUrl',
          type: 'text',
          label: 'URL de Video (YouTube o Vimeo)',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'video_external',
          },
        },
      ],
    },
  ],
}
