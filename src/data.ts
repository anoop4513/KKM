import { Video, Palette, Megaphone, Code, Bot, Workflow, BarChart3, Languages, type LucideIcon } from 'lucide-react';
interface Project {
  title: string;
  description: string;
  category: string;
  tags: string[];
  links?: { label: string; url: string; icon: 'instagram' | 'youtube' | 'web' }[];
  services?: string[];
  highlight?: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

export const projects: Project[] = [
  {
    title: 'Surya Vidyanikethan School',
    description:
      'Brand content creation, high-quality promotional reels, and social media storytelling for one of Bulla Samudram\'s premier educational institutions.',
    category: 'Educational Institution',
    tags: ['Brand Content', 'Reels', 'Social Media'],
    services: ['Brand content creation', 'High-quality promotional reels', 'Social media storytelling', 'Campaign videos'],
    links: [
      { label: 'Reel 1', url: 'https://www.instagram.com/reel/DYMKwrWSXud/', icon: 'instagram' },
      { label: 'Reel 2', url: 'https://www.instagram.com/reel/DYGlbLzv1le/', icon: 'instagram' },
    ],
  },
  {
    title: 'First Steps Play School',
    description:
      'Engaging and emotionally driven content highlighting the school\'s environment, student experiences, and brand identity across platforms.',
    category: 'Educational Institution',
    tags: ['Emotional Storytelling', 'Brand Identity', 'Content'],
    services: ['Emotional storytelling', 'Brand identity content', 'Student experience showcase', 'Instagram reels'],
    links: [
      { label: 'Reel 1', url: 'https://www.instagram.com/reel/DX0rz13JkU_/', icon: 'instagram' },
      { label: 'Reel 2', url: 'https://www.instagram.com/reel/DXopMjTichs/', icon: 'instagram' },
      { label: 'Reel 3', url: 'https://www.instagram.com/reel/DXhXC2diST1/', icon: 'instagram' },
      { label: 'Reel 4', url: 'https://www.instagram.com/reel/DXeeModiYz5/', icon: 'instagram' },
      { label: 'Reel 5', url: 'https://www.instagram.com/reel/DY19Td2J1W9/', icon: 'instagram' },
    ],
    highlight: '5 Featured Reels',
  },
  {
    title: 'Glitch in the Matrix',
    description:
      'Full Instagram brand management — strategic content planning, creative production, and ongoing audience engagement for a growing digital brand.',
    category: 'Social Media Management',
    tags: ['Instagram', 'Strategy', 'Brand Management'],
    services: ['Strategic content planning', 'Creative production', 'Audience engagement', 'Growth strategy'],
    links: [
      { label: 'Instagram', url: 'https://www.instagram.com/glitchinthematrix.in', icon: 'instagram' },
    ],
  },
  {
    title: 'The Jonas Analysis',
    description:
      'End-to-end YouTube channel management — content strategy, video optimization, consistent publishing, and long-term audience growth support.',
    category: 'YouTube Management',
    tags: ['YouTube', 'Content Strategy', 'SEO'],
    services: ['Channel strategy', 'Content optimization', 'Publishing schedule', 'Growth support'],
    links: [
      { label: 'YouTube', url: 'https://youtube.com/@thejonasanalysis', icon: 'youtube' },
    ],
  },
  {
    title: 'Real Estate Marketing',
    description:
      'Digital marketing and content creation for premium real estate projects — Ria Homes, GVK Avenue, Ria Brundhavan — across Hindupur, Pulakunta, and Mallireddypalli.',
    category: 'Real Estate',
    tags: ['Real Estate', 'Digital Marketing', 'Branding'],
    services: ['Digital marketing', 'Content creation', 'Branding campaigns', 'Location-based marketing'],
    links: [
      { label: 'View Project', url: 'https://share.google/bCqmYbkQwKQ2UZukK', icon: 'web' },
    ],
    highlight: 'Ria Homes · GVK Avenue · Ria Brundhavan',
  },
  {
    title: 'Health Awareness Campaign',
    description:
      'A high-profile public awareness campaign featuring MLA Nandamuri Balakrishna, focused on promoting community health and social responsibility.',
    category: 'Public Awareness',
    tags: ['Campaign', 'Public Health', 'Social Impact'],
    services: ['Campaign concept', 'Video production', 'Social amplification', 'Influencer partnership'],
    links: [
      { label: 'Watch Campaign', url: 'https://www.instagram.com/reel/DW_i25bkh2S/', icon: 'instagram' },
    ],
    highlight: 'ft. MLA Nandamuri Balakrishna',
  },
];



export const clientLogos: { file: string; name: string }[] = [
  { file: 'WhatsApp_Image_2026-06-07_at_9.47.34_AM.jpeg',      name: 'Verbo Labs'                       },
  { file: 'WhatsApp_Image_2026-06-07_at_9.47.35_AM_(1).jpeg',  name: 'Lakshya Learning Centre'          },
  { file: 'WhatsApp_Image_2026-06-07_at_9.47.35_AM_(2).jpeg',  name: 'First Steps Play School'          },
  { file: 'WhatsApp_Image_2026-06-07_at_9.47.35_AM_(3).jpeg',  name: 'Murf.AI'                          },
  { file: 'WhatsApp_Image_2026-06-07_at_9.47.35_AM.jpeg',      name: 'Orchid Aesthetic & Beauty Clinic' },
  { file: 'WhatsApp_Image_2026-06-07_at_9.47.43_AM.jpeg',      name: 'Godrej Capital'                   },
  { file: 'WhatsApp_Image_2026-06-07_at_9.49.09_AM.jpeg',      name: 'Truelancer'                       },
  { file: 'WhatsApp_Image_2026-06-07_at_9.49.18_AM.jpeg',      name: 'Rajamane'                         },
  { file: 'IMG-20260706-WA0011.jpg',                           name: 'Navadhatri Projects'               },
];

export const services: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Video,
    title: 'Creative & Media Production',
    description: 'From first frame to final delivery: scriptwriting, filming, editing, motion graphics, sound and localization for social reels, advertisements, promotional films, corporate videos and brand films.',
  },
  {
    icon: Palette,
    title: 'Branding & Creative Strategy',
    description: 'Identity before assets: brand strategy, positioning, visual identity and content strategy that turn an unclear story into a brand people recognize.',
  },
  {
    icon: Megaphone,
    title: 'Digital Marketing & Growth',
    description: 'Creative and media under one roof: social and paid acquisition, search and local SEO, lead generation and conversion campaigns — produced by the team that builds the creative.',
  },
  {
    icon: Code,
    title: 'Website & Digital Experience Development',
    description: 'From concept to conversion: business websites, landing pages, UI/UX design, customer portals and web applications, engineered to carry creative ambition into measurable journeys.',
  },
  {
    icon: Bot,
    title: 'AI & Business Automation',
    description: 'Consultation-led capability in market: AI-assisted creative operations, AI chatbots and WhatsApp Business integrations — scoped with clients before any delivery commitment.',
  },
  {
    icon: Workflow,
    title: 'CRM & Business Technology',
    description: 'Consultation-led capability in market: CRM implementation, booking and appointment systems, sales pipelines and workflow tooling — scoped per client before build commitments.',
  },
  {
    icon: BarChart3,
    title: 'Data Analytics & Performance',
    description: 'Measurement that backs claims: website analytics, campaign performance dashboards, lead tracking and customer journey reporting that turns creative work into evidence.',
  },
  {
    icon: Languages,
    title: 'Global Creative & Localization',
    description: 'White-label creative production for international partners: remote editing, creative outsourcing, multilingual voice-overs, subtitles and localized campaigns with production QA standards.',
  },
];




