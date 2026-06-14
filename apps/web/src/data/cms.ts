export interface Media {
  id: string | number;
  url: string;
  alt: string;
  mimeType?: string;
}

export interface TeamMember {
  memberName: string;
  memberRole: string;
  memberImage: Media;
  linkedinUrl?: string;
}

export interface ClientBrand {
  clientName: string;
  clientLogoDark: Media;
  clientLogoLight: Media;
  clientUrl?: string;
}

export interface ServiceItem {
  serviceName: string;
  description: string;
  icon: 'marketing' | 'audiovisual' | 'redes' | 'web' | 'estrategia';
}

export interface ProcessStep {
  stepTitle: string;
  stepDescription: string;
}

export interface SocialNetwork {
  platform: 'instagram' | 'facebook' | 'tiktok' | 'linkedin' | 'youtube' | 'x';
  url: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  whatsappNumber: string;
  socialNetworks: SocialNetwork[];
}

export type LogoColor = 'default' | 'amarillo' | 'rojo' | 'azul' | 'verde';

export interface ThemeConfig {
  logoVariant: 'default' | 'azul' | 'rojo' | 'amarillo';
  primaryColor: string;
  accentColor: string;
  accentYellowColor: string;
  logoLight?: Media;
  logoDark?: Media;
  aboutLogoColor?: LogoColor;
  servicesLogoColor?: LogoColor;
  processLogoColor?: LogoColor;
  contactLogoColor?: LogoColor;
}

export interface LandingPageData {
  hero: {
    title: string;
    subtitle: string;
    backgroundImage: Media;
  };
  about: {
    title: string;
    history: any; // Lexical rich text
    directorName: string;
    directorRole: string;
    directorImage: Media;
  };
  team: TeamMember[];
  clients: ClientBrand[];
  services: ServiceItem[];
  process: ProcessStep[];
  contact: ContactInfo;
  theme: ThemeConfig;
}

export interface ProjectMedia {
  id?: string;
  type: 'image' | 'video_upload' | 'video_external';
  image?: Media;
  videoFile?: Media;
  videoUrl?: string;
}

export interface Project {
  id: string | number;
  title: string;
  slug: string;
  description: any; // Lexical rich text
  featuredImage: Media;
  featured: boolean;
  mediaGallery: ProjectMedia[];
}

const PAYLOAD_URL = process.env.PAYLOAD_API_URL || 'http://localhost:3000';

// Recursively walks the response object and prepends PAYLOAD_URL to any relative image/video paths
function resolveUrls(obj: any): any {
  if (!obj) return obj;
  if (Array.isArray(obj)) {
    return obj.map(resolveUrls);
  }
  if (typeof obj === 'object') {
    if (obj.url && typeof obj.url === 'string' && obj.url.startsWith('/')) {
      obj.url = `${PAYLOAD_URL}${obj.url}`;
    }
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        obj[key] = resolveUrls(obj[key]);
      }
    }
  }
  return obj;
}

export async function getLandingPage(): Promise<LandingPageData> {
  const url = `${PAYLOAD_URL}/api/globals/landing-page?depth=2`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    return resolveUrls(data);
  } catch (error) {
    console.error('Error fetching landing page from CMS:', error);
    // Return fallback empty structure to prevent build failure
    return {
      hero: { title: 'XpresaT', subtitle: '', backgroundImage: { id: '', url: '', alt: '' } },
      about: { title: '', history: {}, directorName: '', directorRole: '', directorImage: { id: '', url: '', alt: '' } },
      team: [],
      clients: [],
      services: [],
      process: [],
      contact: { phone: '', email: '', whatsappNumber: '', socialNetworks: [] },
      theme: { logoVariant: 'default', primaryColor: '#3d9ef2', accentColor: '#e53455', accentYellowColor: '#f8aa1f' },
    };
  }
}

export async function getProjects(): Promise<Project[]> {
  const url = `${PAYLOAD_URL}/api/projects?limit=100&depth=2`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    const docs = data.docs || [];
    return resolveUrls(docs);
  } catch (error) {
    console.error('Error fetching projects from CMS:', error);
    return [];
  }
}
