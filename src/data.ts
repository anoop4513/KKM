import { Video, Instagram, Youtube, Megaphone, Building2, TrendingUp } from 'lucide-react';
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

export const services = [
  {
    icon: Video,
    title: 'Video Production',
    description: 'Cinematic reels, promotional videos, and brand films crafted to stop the scroll and drive action.',
  },
  {
    icon: Instagram,
    title: 'Social Media Management',
    description: 'End-to-end Instagram and platform management — strategy, content, scheduling, and engagement.',
  },
  {
    icon: Youtube,
    title: 'YouTube Management',
    description: 'Channel growth from strategy to optimization — consistent publishing and audience building.',
  },
  {
    icon: Megaphone,
    title: 'Brand Campaigns',
    description: 'Integrated campaigns that connect your brand with the right audience through compelling storytelling.',
  },
  {
    icon: Building2,
    title: 'Real Estate Marketing',
    description: 'Premium digital marketing tailored for real estate — from project launches to lead generation.',
  },
  {
    icon: TrendingUp,
    title: 'Growth Strategy',
    description: 'Data-informed growth planning to build lasting brand presence and measurable audience expansion.',
  },
];




