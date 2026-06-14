import 'dotenv/config'
import { getPayload } from 'payload'
import config from './payload.config'

// A 1x1 transparent PNG image in base64
const base64Png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
const fileBuffer = Buffer.from(base64Png, 'base64')

async function runSeed() {
  console.log('--- Starting Seeding Process for XpresaT ---')
  const payload = await getPayload({ config })

  // 1. Seed Admin User
  console.log('Seeding Admin User...')
  const adminEmail = 'admin@xpresat.com'
  const adminPassword = 'adminpassword123'

  const existingAdmin = await payload.find({
    collection: 'users',
    where: {
      email: {
        equals: adminEmail,
      },
    },
  })

  if (existingAdmin.docs.length > 0) {
    console.log('Admin user already exists. Skipping user creation.')
  } else {
    await payload.create({
      collection: 'users',
      data: {
        email: adminEmail,
        password: adminPassword,
      },
    })
    console.log(`Admin user created: ${adminEmail} / ${adminPassword}`)
  }

  // Helper function to upload mock media
  const uploadMockMedia = async (name: string, alt: string) => {
    const doc = await payload.create({
      collection: 'media',
      data: {
        alt,
      },
      file: {
        data: fileBuffer,
        name,
        mimetype: 'image/png',
        size: fileBuffer.length,
      },
    })
    return doc.id
  }

  console.log('Seeding mock media uploads...')
  const heroBgId = await uploadMockMedia('hero-bg.png', 'XpresaT Hero Background')
  const directorImgId = await uploadMockMedia('director.png', 'Director XpresaT')
  const edgarImgId = await uploadMockMedia('edgar.png', 'Edgar Sanchez Photo')
  const lanzerImgId = await uploadMockMedia('lanzer.png', 'Lanzer Cabanillas Photo')
  const projectFeaturedImgId = await uploadMockMedia('project-featured.png', 'Project Featured Image')
  const galleryImg1Id = await uploadMockMedia('gallery-1.png', 'Gallery Asset 1')
  const galleryImg2Id = await uploadMockMedia('gallery-2.png', 'Gallery Asset 2')

  // 2. Seed LandingPage Global
  console.log('Seeding LandingPage Global...')
  await payload.updateGlobal({
    slug: 'landing-page',
    data: {
      hero: {
        title: 'Creamos Experiencias que Conectan y Comunican',
        subtitle: 'Agencia de marketing digital, producción audiovisual y desarrollo web de alto impacto.',
        backgroundImage: heroBgId,
      },
      about: {
        title: 'Nuestra Historia y Misión',
        history: {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            version: 1,
            children: [
              {
                type: 'paragraph',
                format: '',
                indent: 0,
                version: 1,
                children: [
                  {
                    type: 'text',
                    text: 'En XpresaT nos apasiona llevar las marcas al siguiente nivel. Nacimos como un colectivo creativo enfocado en romper los esquemas tradicionales del marketing. Creemos que cada proyecto merece una identidad visual única y un desarrollo robusto, combinando arte audiovisual con ingeniería web.',
                    version: 1,
                  },
                ],
              },
            ],
          },
        },
        directorName: 'Edgar Sanchez',
        directorRole: 'Director Creativo y Fundador',
        directorImage: directorImgId,
      },
      team: [
        {
          memberName: 'Edgar Sanchez',
          memberRole: 'Marketing | Producción Audiovisual | Redes',
          memberImage: edgarImgId,
          linkedinUrl: 'https://linkedin.com',
        },
        {
          memberName: 'Lanzer Cabanillas',
          memberRole: 'Fullstack Developer | Tech Lead',
          memberImage: lanzerImgId,
          linkedinUrl: 'https://linkedin.com',
        },
      ],
      clients: [],
      services: [
        {
          serviceName: 'Producción Audiovisual',
          description: 'Creación de spots comerciales, videos corporativos y contenido audiovisual de alta calidad que cuenta historias memorables.',
          icon: 'audiovisual',
        },
        {
          serviceName: 'Marketing Digital',
          description: 'Estrategias a medida orientadas a resultados para posicionar tu marca y aumentar la conversión digital.',
          icon: 'marketing',
        },
        {
          serviceName: 'Gestión de Redes Sociales',
          description: 'Manejo profesional de comunidades digitales, pauta publicitaria y creación de contenido dinámico.',
          icon: 'redes',
        },
        {
          serviceName: 'Creación de Landing Pages',
          description: 'Sitios web ultra rápidos, optimizados para SEO y conversiones que complementan tus campañas publicitarias.',
          icon: 'web',
        },
        {
          serviceName: 'Estrategias de Marca',
          description: 'Desarrollo de branding y posicionamiento estratégico para definir la identidad de tu empresa.',
          icon: 'estrategia',
        },
      ],
      process: [
        {
          stepTitle: '01. Descubrimiento',
          stepDescription: 'Entendemos los objetivos de tu marca, analizamos la competencia y definimos los KPIs del proyecto.',
        },
        {
          stepTitle: '02. Planificación',
          stepDescription: 'Diseñamos la estrategia creativa y la arquitectura de la solución, definiendo entregables específicos.',
        },
        {
          stepTitle: '03. Ejecución y Desarrollo',
          stepDescription: 'Programamos y producimos las piezas visuales y técnicas aplicando estándares premium.',
        },
        {
          stepTitle: '04. Optimización',
          stepDescription: 'Lanzamos el proyecto al mercado y realizamos un seguimiento activo para asegurar su máximo rendimiento.',
        },
      ],
      contact: {
        phone: '+52 1 667 447 0203',
        email: 'Xtampacln@gmail.com',
        whatsappNumber: '5216674470203',
        socialNetworks: [
          { platform: 'instagram', url: 'https://www.instagram.com/xpresatcln?igsh=dG1nY3l1NGQ1amI4' },
          { platform: 'facebook', url: 'https://www.facebook.com/share/18dwa1LV61/?mibextid=wwXIfr' },
        ],
      },
      theme: {
        logoVariant: 'default',
        primaryColor: '#3d9ef2',
        accentColor: '#e53455',
        accentYellowColor: '#f8aa1f',
      },
    },
  })
  console.log('LandingPage Global seeded successfully.')

  // 3. Seed Projects Collection
  console.log('Seeding Projects Collection...')
  
  // Clean existing projects first
  const existingProjects = await payload.find({
    collection: 'projects',
    limit: 100,
  })
  
  for (const doc of existingProjects.docs) {
    await payload.delete({
      collection: 'projects',
      id: doc.id,
    })
  }

  const sampleProjects = [
    {
      title: 'Campaña Volvo S60',
      description: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [{ type: 'text', text: 'Producción audiovisual y campaña digital integral para el lanzamiento del nuevo modelo de Volvo. Diseñamos spots de video dinámicos enfocados en la elegancia y la seguridad vial.' }],
            },
          ],
        },
      },
      featuredImage: projectFeaturedImgId,
      featured: true,
      mediaGallery: [
        { type: 'video_external', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
        { type: 'image', image: galleryImg1Id },
        { type: 'image', image: galleryImg2Id },
      ],
    },
    {
      title: 'Estrategia de Marca Mazda',
      description: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [{ type: 'text', text: 'Rediseño y consultoría estratégica de la comunicación digital para Mazda. Implementamos campañas B2B y dinámicas de redes para aumentar el flujo de leads calificados.' }],
            },
          ],
        },
      },
      featuredImage: projectFeaturedImgId,
      featured: true,
      mediaGallery: [
        { type: 'image', image: galleryImg2Id },
        { type: 'image', image: galleryImg1Id },
      ],
    },
    {
      title: 'Portal Informativo TM Noticias',
      description: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [{ type: 'text', text: 'Desarrollo web y optimización de infraestructura serverless para el portal de TM Noticias. Logramos tiempos de carga menores a un segundo para alto tráfico diario.' }],
            },
          ],
        },
      },
      featuredImage: projectFeaturedImgId,
      featured: true,
      mediaGallery: [
        { type: 'image', image: galleryImg1Id },
      ],
    },
    {
      title: 'Producción Crunchy Fest',
      description: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [{ type: 'text', text: 'Cobertura audiovisual multicanal para el festival de música Crunchy. Capturamos transmisiones en vivo, reels virales y fotografía artística del evento.' }],
            },
          ],
        },
      },
      featuredImage: projectFeaturedImgId,
      featured: false,
      mediaGallery: [
        { type: 'video_external', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      ],
    },
    {
      title: 'Branding HM Total Home',
      description: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [{ type: 'text', text: 'Identidad de marca y empaques comerciales para HM Total Home. Desarrollamos un manual de marca que refleja sofisticación y comodidad hogareña.' }],
            },
          ],
        },
      },
      featuredImage: projectFeaturedImgId,
      featured: false,
      mediaGallery: [
        { type: 'image', image: galleryImg1Id },
        { type: 'image', image: galleryImg2Id },
      ],
    },
    {
      title: 'Landing Pages Natuvid',
      description: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [{ type: 'text', text: 'Creación de landing pages orientadas a conversiones e integradas con embudos de venta para los suplementos de Natuvid. Incrementamos las ventas en un 35%.' }],
            },
          ],
        },
      },
      featuredImage: projectFeaturedImgId,
      featured: false,
      mediaGallery: [
        { type: 'image', image: galleryImg2Id },
      ],
    },
  ]

  for (const proj of sampleProjects) {
    const created = await payload.create({
      collection: 'projects',
      data: proj as any,
    })
    console.log(`Created Project: "${created.title}" (slug: ${created.slug}, featured: ${created.featured})`)
  }

  console.log('--- Seeding Process Finished Successfully! ---')
  process.exit(0)
}

runSeed().catch((err) => {
  console.error('Error seeding database:', err)
  process.exit(1)
})
