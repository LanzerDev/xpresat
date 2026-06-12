import type { GlobalConfig } from 'payload'

export const LandingPage: GlobalConfig = {
  slug: 'landing-page',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      label: 'Sección Hero',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Título Principal',
        },
        {
          name: 'subtitle',
          type: 'text',
          required: true,
          label: 'Subtítulo',
        },
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Imagen de Fondo',
        },
      ],
    },
    {
      name: 'about',
      type: 'group',
      label: 'Sección Nosotros',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Título de la Sección',
        },
        {
          name: 'history',
          type: 'richText',
          required: true,
          label: 'Nuestra Historia',
        },
        {
          name: 'directorName',
          type: 'text',
          required: true,
          label: 'Nombre del Director/Fundador',
        },
        {
          name: 'directorRole',
          type: 'text',
          required: true,
          label: 'Rol del Director',
        },
        {
          name: 'directorImage',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Foto del Director',
        },
      ],
    },
    {
      name: 'team',
      type: 'array',
      label: 'Sección Equipo',
      fields: [
        {
          name: 'memberName',
          type: 'text',
          required: true,
          label: 'Nombre Completo',
        },
        {
          name: 'memberRole',
          type: 'text',
          required: true,
          label: 'Rol / Especialidad',
        },
        {
          name: 'memberImage',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Foto de Perfil',
        },
        {
          name: 'linkedinUrl',
          type: 'text',
          label: 'Enlace de LinkedIn (Opcional)',
        },
      ],
    },
    {
      name: 'clients',
      type: 'array',
      label: 'Clientes (Logo Wall)',
      fields: [
        {
          name: 'clientName',
          type: 'text',
          required: true,
          label: 'Nombre de la Marca / Cliente',
        },
        {
          name: 'clientLogo',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Logo',
        },
        {
          name: 'clientUrl',
          type: 'text',
          label: 'Enlace Web (Opcional)',
        },
      ],
    },
    {
      name: 'services',
      type: 'array',
      label: 'Servicios',
      fields: [
        {
          name: 'serviceName',
          type: 'text',
          required: true,
          label: 'Nombre del Servicio',
        },
        {
          name: 'description',
          type: 'text',
          required: true,
          label: 'Descripción corta',
        },
        {
          name: 'icon',
          type: 'select',
          required: true,
          label: 'Icono del Servicio',
          options: [
            { label: 'Marketing (Megáfono)', value: 'marketing' },
            { label: 'Producción Audiovisual (Cámara)', value: 'audiovisual' },
            { label: 'Gestión de Redes (Teléfono)', value: 'redes' },
            { label: 'Desarrollo Web (Código)', value: 'web' },
            { label: 'Estrategia de Marca (Diana/Target)', value: 'estrategia' },
          ],
          defaultValue: 'marketing',
        },
      ],
    },
    {
      name: 'process',
      type: 'array',
      label: 'Proceso de Trabajo',
      fields: [
        {
          name: 'stepTitle',
          type: 'text',
          required: true,
          label: 'Nombre del Paso',
        },
        {
          name: 'stepDescription',
          type: 'text',
          required: true,
          label: 'Descripción del Paso',
        },
      ],
    },
    {
      name: 'contact',
      type: 'group',
      label: 'Información de Contacto',
      fields: [
        {
          name: 'phone',
          type: 'text',
          required: true,
          label: 'Teléfono de contacto',
        },
        {
          name: 'email',
          type: 'text',
          required: true,
          label: 'Email oficial',
        },
        {
          name: 'whatsappNumber',
          type: 'text',
          required: true,
          label: 'Número de WhatsApp (con código de país, ej: 5216674470203)',
        },
        {
          name: 'instagramUrl',
          type: 'text',
          required: true,
          label: 'URL de Instagram',
        },
        {
          name: 'facebookUrl',
          type: 'text',
          required: true,
          label: 'URL de Facebook',
        },
      ],
    },
  ],
}
