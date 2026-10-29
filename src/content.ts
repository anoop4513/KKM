export interface PageMetadata {
  path: string;
  title: string;
  description: string;
}

export interface ContentSection {
  title: string;
  body?: string;
  items?: string[];
}

export interface RelatedLink {
  href: string;
  label: string;
}

export interface PageContent extends PageMetadata {
  heading: string;
  intro: string;
  sections: ContentSection[];
  related: RelatedLink[];
  projectIndexes?: number[];
}

export interface Capability extends PageContent {
  slug: string;
  shortTitle: string;
  summary: string;
  pillar: 'Create' | 'Market' | 'Automate' | 'Grow';
  consultationLed: boolean;
}

export interface Industry extends PageContent {
  slug: string;
  summary: string;
}

export const agency = {
  name: 'Katha Kantam Media',
  positioning: '360° Creative, Digital Growth & Business Solutions.',
  tagline: 'Create. Market. Automate. Grow.',
  email: 'kathakaantam@gmail.com',
  instagram: 'https://www.instagram.com/kathakanthammedia?igsh=MXNmMmVmaXF5NDA4NQ==',
  homeMarket: 'Hindupur, India',
  localMarkets: ['Hindupur', 'Bengaluru', 'Hyderabad'],
  internationalMarkets: ['UAE', 'UK', 'USA', 'Canada', 'Australia'],
};

const proposalLink: RelatedLink = { href: '/contact/', label: 'Tell us about your project' };

export const capabilities: Capability[] = [
  {
    slug: 'creative-media-production',
    path: '/services/creative-media-production/',
    title: 'Creative & Media Production | Katha Kantam Media',
    shortTitle: 'Creative & Media Production',
    heading: 'Make a story worth watching.',
    summary: 'Films, reels and campaign content shaped around what your audience needs to feel and understand.',
    description: 'Explore video editing, reels, promotional films, scriptwriting, motion graphics and multilingual creative production with Katha Kantam Media.',
    pillar: 'Create',
    consultationLed: false,
    intro: 'A finished video needs more than polished frames. It needs a clear idea, a reason to watch and a format that works where your audience will see it.',
    sections: [
      { title: 'The challenge', body: 'A business can have a strong offering and still struggle to explain it on screen. Disconnected posts, unclear scripts and inconsistent production make the story harder to follow.' },
      { title: 'Our approach', body: 'We connect the brief, story and edit before production begins. The message leads the format, whether that is a school reel, a brand film, a founder interview or a social campaign.' },
      { title: 'What we can scope', items: ['Concept development, scriptwriting and story structure', 'Video editing for reels, advertisements, promotional and corporate films', 'Motion graphics, animation, voice-overs and sound', 'Podcast production and multilingual versions', 'Platform-specific exports, subtitles and delivery files'] },
      { title: 'From brief to delivery', items: ['Agree the audience, message, format and production requirements.', 'Develop the story and confirm the material required.', 'Create and review the edit against the approved brief.', 'Complete the agreed revisions and prepare final exports.'] },
    ],
    projectIndexes: [0, 1, 5],
    related: [{ href: '/industries/education/', label: 'Creative for schools' }, { href: '/global-partnerships/', label: 'Remote production partnerships' }, proposalLink],
  },
  {
    slug: 'branding-creative-strategy',
    path: '/services/branding-creative-strategy/',
    title: 'Branding & Creative Strategy | Katha Kantam Media',
    shortTitle: 'Branding & Creative Strategy',
    heading: 'Know what your brand stands for.',
    summary: 'Positioning, visual identity and content direction that give every expression a common purpose.',
    description: 'Discuss brand positioning, identity, founder personal branding and content strategy with Katha Kantam Media in India.',
    pillar: 'Create',
    consultationLed: false,
    intro: 'Your logo, words and content should tell the same story. We help you define that story before turning it into an identity people can recognize.',
    sections: [
      { title: 'The challenge', body: 'When a business grows without a clear brand direction, each new piece of content can feel like it belongs to a different company. Customers have to work harder to understand the value.' },
      { title: 'Our approach', body: 'We start with the people you serve, the problem you solve and the position you want to earn. That becomes a practical foundation for visual and verbal decisions.' },
      { title: 'What we can scope', items: ['Brand discovery, positioning and messaging direction', 'Logo design and visual identity', 'Company branding and visual communication', 'Founder personal branding', 'Content themes, channel direction and brand-use guidance'] },
      { title: 'How we work', items: ['Review the business, audience and existing brand materials.', 'Agree a positioning and creative direction.', 'Develop identity and communication applications.', 'Deliver the agreed assets with guidance for consistent use.'] },
    ],
    projectIndexes: [1, 2],
    related: [{ href: '/industries/founders-personal-brands/', label: 'Brand building for founders' }, { href: '/services/creative-media-production/', label: 'Bring the story to screen' }, proposalLink],
  },
  {
    slug: 'digital-marketing-growth',
    path: '/services/digital-marketing-growth/',
    title: 'Digital Marketing & Growth | Katha Kantam Media',
    shortTitle: 'Digital Marketing & Growth',
    heading: 'Reach the people who matter.',
    summary: 'Social, search and campaign planning that connects creative work to meaningful enquiries.',
    description: 'Digital marketing, social media management, local SEO and campaign planning for businesses in Hindupur, Bengaluru, Hyderabad and beyond.',
    pillar: 'Market',
    consultationLed: false,
    intro: 'Visibility matters when it reaches the right audience. We bring creative planning and channel strategy together around the action your business needs next.',
    sections: [
      { title: 'The challenge', body: 'Regular posting does not automatically create demand. Broad targeting, inconsistent creative and a weak enquiry journey can leave businesses unsure which activity is helping.' },
      { title: 'Our approach', body: 'We define the audience and conversion path before choosing channels. Content, campaigns and landing pages should support the same business objective, with reporting tied to what can actually be measured.' },
      { title: 'What we can scope', items: ['Social media management and content calendars', 'Meta Ads and Google Ads campaign planning', 'Search engine optimization and local search visibility', 'Lead-generation campaigns and landing-page coordination', 'Influencer collaborations and campaign reporting'] },
      { title: 'Campaign process', items: ['Agree objectives, audience, market and available budget.', 'Build the creative, channel plan and enquiry journey.', 'Launch the approved activity with measurement in place.', 'Review the evidence and agree the next adjustments.'] },
      { title: 'A clear commercial scope', body: 'Media spend, platform charges and third-party subscriptions are separate items to agree in the proposal. Campaign results depend on the offer, market, budget and execution; forecasts are not guarantees.' },
    ],
    projectIndexes: [2, 4],
    related: [{ href: '/industries/real-estate/', label: 'Marketing for property businesses' }, { href: '/services/data-analytics-performance/', label: 'Measurement and reporting' }, proposalLink],
  },
  {
    slug: 'website-digital-experience',
    path: '/services/website-digital-experience/',
    title: 'Websites & Digital Experiences | Katha Kantam Media',
    shortTitle: 'Websites & Digital Experiences',
    heading: 'Turn a visit into a next step.',
    summary: 'Websites, landing pages and digital journeys that make your business easier to understand and contact.',
    description: 'Plan business websites, landing pages, UI/UX, customer portals and conversion-focused digital experiences with Katha Kantam Media.',
    pillar: 'Grow',
    consultationLed: false,
    intro: 'A website should help someone make a decision. We connect the story, structure and interaction so visitors understand your offer and know how to move forward.',
    sections: [
      { title: 'The challenge', body: 'A visually polished site can still hide the services, feel difficult on a phone or send enquiries nowhere. Each broken step adds friction between interest and conversation.' },
      { title: 'Our approach', body: 'We map the visitor’s questions, the content that answers them and the action each page should support. Design and development follow that journey, with accessibility and responsive behavior considered from the start.' },
      { title: 'What we can scope', items: ['Business websites, digital portfolios and campaign landing pages', 'Information architecture, UX and interface design', 'Customer portals and web applications after technical discovery', 'Enquiry flows, conversion optimization and analytics planning', 'Content handover, launch checks and maintenance requirements'] },
      { title: 'Delivery process', items: ['Define users, content, integrations and the scope of the site.', 'Review the page structure and visual direction.', 'Build a working preview and test key visitor journeys.', 'Agree launch, ownership, maintenance and ongoing costs.'] },
    ],
    related: [{ href: '/services/crm-business-technology/', label: 'Connect the next business workflow' }, { href: '/services/data-analytics-performance/', label: 'Understand the visitor journey' }, proposalLink],
  },
  {
    slug: 'ai-business-automation',
    path: '/services/ai-business-automation/',
    title: 'AI & Business Automation Consultation | Katha Kantam Media',
    shortTitle: 'AI & Business Automation',
    heading: 'Give repetitive work a better route.',
    summary: 'Consultation-led planning for chatbots, enquiry routing and useful business automation.',
    description: 'Discuss AI chatbots, WhatsApp Business integrations, lead routing and workflow automation. Capabilities and delivery are confirmed through consultation.',
    pillar: 'Automate',
    consultationLed: true,
    intro: 'Automation should solve a specific operational problem. We begin with the workflow, the people using it and the points where a human needs to stay in control.',
    sections: [
      { title: 'The challenge', body: 'Repeated customer questions, manual handoffs and scattered enquiries can consume time. Automating the wrong step can also create new errors or make a customer’s experience worse.' },
      { title: 'Our approach', body: 'This is a consultation-led expansion capability. We assess the use case, required integrations, data needs and specialist support before confirming feasibility or making a delivery commitment.' },
      { title: 'Areas for discussion', items: ['AI chatbots for clearly defined customer questions', 'WhatsApp Business integration and response workflows', 'Enquiry classification, lead routing and follow-up handoffs', 'AI-assisted content and internal business processes', 'Human review, error recovery and maintenance planning'] },
      { title: 'Discovery before implementation', items: ['Document the current workflow and the repetitive task.', 'Review data access, consent, tools and human approvals.', 'Confirm technical feasibility, ownership and running costs.', 'Propose a bounded pilot only when delivery support is in place.'] },
    ],
    related: [{ href: '/services/crm-business-technology/', label: 'CRM and business workflows' }, proposalLink],
  },
  {
    slug: 'crm-business-technology',
    path: '/services/crm-business-technology/',
    title: 'CRM & Business Technology Consultation | Katha Kantam Media',
    shortTitle: 'CRM & Business Technology',
    heading: 'Keep the next opportunity in view.',
    summary: 'Consultation-led discovery for sales pipelines, booking systems and everyday business software.',
    description: 'Explore CRM, booking systems, sales pipelines, catalogues and business technology through a scoped consultation with Katha Kantam Media.',
    pillar: 'Automate',
    consultationLed: true,
    intro: 'A new system is useful only if it fits how your team works. We help define the requirement before choosing software or promising an implementation.',
    sections: [
      { title: 'The challenge', body: 'When appointments, customer details and sales follow-ups live in separate places, teams can lose context. Adding another tool without changing the workflow rarely resolves the underlying issue.' },
      { title: 'Our approach', body: 'This is a consultation-led expansion capability. We map the work, identify the minimum useful system and confirm the implementation support required before agreeing delivery.' },
      { title: 'Areas for discussion', items: ['Customer relationship management and lead stages', 'Appointment and booking systems', 'Sales pipelines and team handoffs', 'Online catalogues and customer portals', 'Software selection, migration, access and team handover'] },
      { title: 'A practical first step', items: ['Review the current process and the information it needs.', 'Agree users, permissions and the essential workflow.', 'Compare suitable tools and confirm specialist requirements.', 'Scope setup, testing, training and ongoing ownership separately.'] },
    ],
    related: [{ href: '/industries/salons-retail-local-businesses/', label: 'Systems for local businesses' }, { href: '/services/ai-business-automation/', label: 'Automation discovery' }, proposalLink],
  },
  {
    slug: 'data-analytics-performance',
    path: '/services/data-analytics-performance/',
    title: 'Data Analytics & Performance | Katha Kantam Media',
    shortTitle: 'Data Analytics & Performance',
    heading: 'Make the next decision with evidence.',
    summary: 'Measurement plans, lead tracking and reporting that connect activity to useful business questions.',
    description: 'Discuss website analytics, campaign dashboards, lead tracking and customer-journey reporting with Katha Kantam Media.',
    pillar: 'Grow',
    consultationLed: true,
    intro: 'A report should explain what happened, what remains uncertain and what to investigate next. We begin with the decisions your team needs to make.',
    sections: [
      { title: 'The challenge', body: 'Platform totals and disconnected spreadsheets can make activity look measurable without explaining where relevant enquiries came from or how they progressed.' },
      { title: 'Our approach', body: 'We agree the questions, available data and measurement limits first. Reporting requirements and integrations are scoped during consultation, with advanced work confirmed against the specialist support available.' },
      { title: 'What we can discuss', items: ['Website analytics and a meaningful conversion-event plan', 'Campaign performance reporting and dashboard requirements', 'Enquiry-source tracking and lead-stage reporting', 'Customer-journey analysis across agreed touchpoints', 'Data quality, access permissions and reporting handover'] },
      { title: 'Measurement process', items: ['Choose the business questions and define each measure.', 'Review data access, consent and tracking quality.', 'Implement the agreed measurement scope and validate events.', 'Review findings with their limitations and next actions.'] },
      { title: 'Respect the customer behind the data', body: 'Names, email addresses, phone numbers and project descriptions do not belong in analytics event payloads. Any measurement scope should distinguish operational enquiry data from behavioral reporting.' },
    ],
    related: [{ href: '/services/digital-marketing-growth/', label: 'Campaign planning and growth' }, proposalLink],
  },
  {
    slug: 'global-creative-localization',
    path: '/services/global-creative-localization/',
    title: 'Global Creative & Localization | Katha Kantam Media',
    shortTitle: 'Global Creative & Localization',
    heading: 'Carry the story across borders.',
    summary: 'Remote editing, white-label creative and localization scoped around your team’s requirements.',
    description: 'Remote creative production, white-label editing, subtitles, voice-overs and localization coordination for international brands and agencies.',
    pillar: 'Create',
    consultationLed: false,
    intro: 'Working across markets takes a shared brief and careful handoffs. We discuss the creative, language and delivery requirements before confirming a partnership.',
    sections: [
      { title: 'The challenge', body: 'A strong idea can lose clarity when formats, languages or teams change. Remote production also needs clear ownership of source files, feedback and final approval.' },
      { title: 'Our approach', body: 'We align on the brand, audience and production workflow, then confirm the language support and specialist review required. Translation and localization requirements are scoped per project.' },
      { title: 'What we can scope', items: ['White-label creative production and remote video editing', 'Short-form social content and brand creatives', 'Motion graphics and versioning', 'Multilingual voice-overs, subtitles and translation coordination', 'Project-based or monthly production partnerships'] },
      { title: 'A shared production rhythm', items: ['Agree the brief, references, assets and confidentiality requirements.', 'Confirm time-zone overlap, delivery dates and review milestones.', 'Collect consolidated feedback through an agreed channel.', 'Complete quality checks and transfer the agreed deliverables.'] },
    ],
    related: [{ href: '/global-partnerships/', label: 'Explore a global partnership' }, { href: '/industries/international-agencies/', label: 'Support for brands and agencies' }, proposalLink],
  },
];

export const industries: Industry[] = [
  {
    slug: 'healthcare',
    path: '/industries/healthcare/',
    title: 'Marketing & Creative for Healthcare | Katha Kantam Media',
    heading: 'Help people understand your care.',
    summary: 'Clear, considered communication for hospitals, clinics and healthcare organizations.',
    description: 'Healthcare content, awareness campaigns, local visibility and enquiry-journey planning for hospitals and clinics.',
    intro: 'Healthcare communication needs clarity, care and a responsible approval process. We help plan content that explains services without relying on exaggerated promises.',
    sections: [
      { title: 'What your audience needs', body: 'People looking for care need understandable information about services, clinicians, location and how to make an enquiry. Their decision should not depend on confusing claims or vague promotional content.' },
      { title: 'How we can help', items: ['Service explainers and health-awareness content', 'Doctor and team introductions with approved credentials', 'Social content and local search visibility', 'Campaign landing pages and appointment-enquiry journeys', 'A content review workflow with the healthcare team'] },
      { title: 'A considered process', body: 'We agree the message and evidence with your clinical or authorized review team before production. Patient stories, images and sensitive information require appropriate permission. Clinical facts and treatment claims remain subject to your approval.' },
    ],
    projectIndexes: [5],
    related: [{ href: '/services/creative-media-production/', label: 'Awareness and video production' }, { href: '/services/digital-marketing-growth/', label: 'Local visibility and campaigns' }, proposalLink],
  },
  {
    slug: 'education',
    path: '/industries/education/',
    title: 'School Content & Admissions Marketing | Katha Kantam Media',
    heading: 'Show families what makes your school yours.',
    summary: 'School stories, admissions content and clear digital journeys for educational institutions.',
    description: 'Creative content, school reels, admissions campaigns and digital-experience planning for schools and educational institutions.',
    intro: 'Parents want to understand the people, environment and learning experience behind a school’s name. Thoughtful content makes those qualities easier to see.',
    sections: [
      { title: 'The admissions journey', body: 'A family may first discover a school through a reel, then look for practical information and a way to visit. The story and the enquiry process need to connect across those steps.' },
      { title: 'How we can help', items: ['Campus, classroom and school-culture storytelling', 'Promotional reels and admissions campaign content', 'Parent-facing service and admissions information', 'Social media planning and local campaign coordination', 'Admissions landing pages and enquiry tracking'] },
      { title: 'Build on what is real', body: 'We plan around actual school experiences and approved information. Filming involving students should follow the institution’s consent process. Academic results, facilities and outcomes must be checked by the school before publication.' },
    ],
    projectIndexes: [0, 1],
    related: [{ href: '/services/creative-media-production/', label: 'School films and reels' }, { href: '/services/website-digital-experience/', label: 'An easier admissions journey' }, proposalLink],
  },
  {
    slug: 'real-estate',
    path: '/industries/real-estate/',
    title: 'Real Estate Creative & Marketing | Katha Kantam Media',
    heading: 'Make the place easier to picture.',
    summary: 'Property stories, project content and enquiry journeys for real estate businesses.',
    description: 'Real estate content, property marketing, project campaigns and lead-journey planning for developers and property businesses.',
    intro: 'A property decision needs more than an attractive image. We help organize the project story, location context and next step into a coherent marketing journey.',
    sections: [
      { title: 'The buyer’s questions', body: 'Potential buyers need clear details about the project, its setting and how to get verified information. Generic creatives and disconnected follow-ups can leave those questions unanswered.' },
      { title: 'How we can help', items: ['Project stories, walkthrough content and promotional edits', 'Location-focused content and brand communication', 'Campaign creatives and lead-generation planning', 'Project landing pages and site-visit enquiry journeys', 'Lead-source reporting and sales-team handoff planning'] },
      { title: 'Keep the details accurate', body: 'Project specifications, approvals, pricing and availability come from your authorized team. We distinguish actual photography from architectural visualizations and agree a review process before campaign release.' },
    ],
    projectIndexes: [4],
    related: [{ href: '/services/digital-marketing-growth/', label: 'Property campaign planning' }, { href: '/services/crm-business-technology/', label: 'Lead and follow-up systems' }, proposalLink],
  },
  {
    slug: 'founders-personal-brands',
    path: '/industries/founders-personal-brands/',
    title: 'Founder Content & Personal Branding | Katha Kantam Media',
    heading: 'Let people hear your point of view.',
    summary: 'Positioning, content direction and production for founders, experts and creators.',
    description: 'Founder personal branding, creator content, video editing and channel strategy with Katha Kantam Media.',
    intro: 'A personal brand works when the ideas sound like the person behind them. We help turn your experience and perspective into a consistent body of content.',
    sections: [
      { title: 'The challenge of consistency', body: 'Founders and creators often have plenty to say but limited time to shape, edit and publish it. Chasing every format can dilute the voice that made the content useful.' },
      { title: 'How we can help', items: ['Personal positioning and content themes', 'Interview, podcast and short-form production', 'Video editing and platform-specific versions', 'YouTube and social channel planning', 'Publishing workflows and performance review'] },
      { title: 'Keep your voice in the work', body: 'We begin with your audience, ideas and available time. Content is reviewed with you, and published claims should reflect your actual expertise and experience.' },
    ],
    projectIndexes: [3],
    related: [{ href: '/services/branding-creative-strategy/', label: 'Positioning and identity' }, { href: '/services/creative-media-production/', label: 'Content production support' }, proposalLink],
  },
  {
    slug: 'salons-retail-local-businesses',
    path: '/industries/salons-retail-local-businesses/',
    title: 'Marketing for Salons, Retail & Local Businesses | Katha Kantam Media',
    heading: 'Be easier to discover. Easier to choose.',
    summary: 'Practical creative, local visibility and enquiry journeys for neighborhood businesses.',
    description: 'Local business branding, content, search visibility, websites and consultation-led booking and CRM planning.',
    intro: 'For a local business, useful marketing helps someone nearby understand the offer, trust the business and take the next step on their phone.',
    sections: [
      { title: 'The local customer journey', body: 'A customer may discover a service on social media, check the location and then ask about availability. Accurate information and an easy contact route matter at each step.' },
      { title: 'How we can help', items: ['Brand identity and product or service content', 'Social media planning and local search visibility', 'Promotional campaigns with clear terms', 'Mobile-friendly websites, landing pages and catalogues', 'Consultation-led booking, customer management and follow-up planning'] },
      { title: 'Start with the useful essentials', body: 'We review what customers ask, how enquiries arrive and which steps the team can maintain. Booking, CRM and automation work is confirmed through discovery before an implementation is promised.' },
    ],
    related: [{ href: '/services/digital-marketing-growth/', label: 'Local marketing and campaigns' }, { href: '/services/crm-business-technology/', label: 'Explore booking and CRM requirements' }, proposalLink],
  },
  {
    slug: 'international-agencies',
    path: '/industries/international-agencies/',
    title: 'Creative Support for International Agencies | Katha Kantam Media',
    heading: 'An extension of your creative team.',
    summary: 'Remote production and white-label collaboration for international brands and agencies.',
    description: 'Discuss white-label editing, short-form production, creative versioning and localization support with an India-based production partner.',
    intro: 'When your team needs production support, the handoff should preserve the idea. We agree how briefs, feedback, files and approvals move between teams.',
    sections: [
      { title: 'The partnership requirement', body: 'Agency work can involve several stakeholders, brand guidelines and different time zones. A clear production process matters as much as the final creative.' },
      { title: 'How we can help', items: ['White-label creative production and video editing', 'Short-form content and motion graphics', 'Brand-creative versioning across formats', 'Subtitles, voice-overs and localization coordination', 'Project-based or monthly production scopes'] },
      { title: 'Agree the working model first', body: 'We confirm capacity, communication overlap, file access, confidentiality, approval responsibility and revision scope before work begins. Deadlines are agreed against the actual brief and asset readiness.' },
      { title: 'Markets we welcome enquiries from', body: 'We are India-based and welcome collaboration enquiries from the UAE, UK, USA, Canada, Australia and other markets. These are markets we aim to serve, not a list of physical offices or existing international clients.' },
    ],
    related: [{ href: '/global-partnerships/', label: 'The partnership workflow' }, { href: '/services/global-creative-localization/', label: 'Global creative and localization' }, proposalLink],
  },
];

export const partnershipOptions = [
  { title: 'A defined project', description: 'A clear brief, agreed deliverables and a production schedule for a specific launch, campaign or content need.' },
  { title: 'A monthly production scope', description: 'A planned volume of creative work, agreed review windows and a delivery rhythm shaped around your team.' },
  { title: 'White-label collaboration', description: 'Production support within an agreed brand, confidentiality and approval workflow for agency partners.' },
];

export const projectNotes = [
  { context: 'School communication and brand content', work: 'Promotional reels, brand content and social storytelling.', nextStep: 'Explore the published school reels through the original project links.' },
  { context: 'Play-school identity and everyday experiences', work: 'Content shaped around the school environment, student experiences and brand identity.', nextStep: 'Watch the published reels to see the storytelling and production.' },
  { context: 'An ongoing Instagram brand presence', work: 'Content planning, creative production and audience-engagement support.', nextStep: 'Visit the brand’s Instagram profile to explore its published content.' },
  { context: 'YouTube channel production and publishing', work: 'Channel strategy, content optimization, publishing coordination and growth support.', nextStep: 'Visit the original YouTube channel to explore the published videos.' },
  { context: 'Real estate projects in and around Hindupur', work: 'Digital marketing, content creation and branding for Ria Homes, GVK Avenue and Ria Brundhavan.', nextStep: 'Open the original property project link for its published information.' },
  { context: 'A public health-awareness campaign', work: 'Campaign concept, video production and social amplification.', nextStep: 'Watch the published awareness campaign through the original reel link.' },
];

const generalPages: PageContent[] = [
  {
    path: '/about/',
    title: 'About the Agency | Katha Kantam Media',
    description: 'Meet the direction behind Katha Kantam Media: an India-based creative, marketing and technology partner with local roots and global ambitions.',
    heading: 'Built around the whole story.',
    intro: 'Katha Kantam Media is an India-based agency growing from content creation into a broader creative, digital growth and business technology partner.',
    sections: [
      { title: 'Where we begin', body: 'Our existing work spans school content, creator channels, real estate marketing and public-awareness campaigns. The next chapter brings those creative foundations together with brand strategy, digital experiences and carefully scoped technology support.' },
      { title: 'Our mission', body: 'Help ambitious businesses build stronger brands, reach the right audiences and grow through creative storytelling, digital marketing, technology and smart automation.' },
      { title: 'Our vision', body: 'Build a company that can support a business from brand creation and digital visibility to customer acquisition and long-term growth. We aim to bring international creative standards within reach of local businesses.' },
      { title: 'How we approach a brief', items: ['Understand the business problem before choosing the deliverables.', 'Connect the creative, marketing and enquiry journey.', 'Agree responsibilities, review points and a realistic scope.', 'Use real work and available evidence to explain what was delivered.'] },
      { title: 'Local understanding. A wider outlook.', body: 'Our initial local markets include Hindupur, Bengaluru, Hyderabad and surrounding regions. We also welcome remote partnership enquiries from international teams. Markets served are not presented as physical offices.' },
      { title: 'Growth with clear commitments', body: 'Some technology and automation capabilities are expanding. We use consultation to confirm feasibility, specialist support and delivery scope before committing to an implementation.' },
    ],
    related: [{ href: '/work/', label: 'Explore existing work' }, { href: '/services/', label: 'Our capabilities' }, proposalLink],
  },
  {
    path: '/global-partnerships/',
    title: 'Global Creative Partnerships | Katha Kantam Media',
    description: 'Explore India-based remote creative production, white-label video editing and localization partnerships for brands and marketing agencies.',
    heading: 'Your brief. A shared creative ambition.',
    intro: 'Remote production works when the creative direction and working process are equally clear. We welcome project-based and monthly partnership enquiries from brands, creators and agencies.',
    sections: [
      { title: 'Where we can support', items: ['White-label creative production and remote video editing', 'Short-form social content and brand creatives', 'Motion graphics and format versioning', 'Multilingual voice-overs, subtitles and localization coordination'] },
      { title: 'Start with a shared brief', body: 'Tell us about the audience, brand guidelines, reference material, deliverables and required dates. We review the source assets, production needs and specialist requirements before confirming capacity.' },
      { title: 'Communication without guesswork', body: 'The proposal should name the review channel, feedback owner, time-zone overlap and approval milestones. Consolidated feedback helps keep production decisions clear across teams.' },
      { title: 'Turnaround is agreed per brief', body: 'Delivery dates depend on the scope, source-material readiness, format count, language requirements and review process. We agree milestones before starting instead of promising a universal turnaround.' },
      { title: 'Revisions and quality checks', body: 'The written scope defines review rounds, revision boundaries and how new requirements are handled. Final checks cover the agreed specifications, brand consistency, subtitles and export requirements before handover.' },
      { title: 'A market outlook, not an office map', body: 'We are based in India and welcome enquiries from the UAE, UK, USA, Canada, Australia and other markets. These locations describe our intended partnership reach; they do not imply overseas offices or existing client relationships.' },
    ],
    related: [{ href: '/services/global-creative-localization/', label: 'Creative and localization capabilities' }, { href: '/work/', label: 'Explore published work' }, { href: '/contact/?intent=partnership', label: 'Discuss a partnership' }],
  },
  {
    path: '/privacy/',
    title: 'Privacy & Enquiry Information | Katha Kantam Media',
    description: 'How to contact Katha Kantam Media about website enquiries, personal information and privacy questions.',
    heading: 'Your enquiry starts with your information.',
    intro: 'This page explains the information requested when you contact Katha Kantam Media through this website. For a privacy question, contact kathakaantam@gmail.com.',
    sections: [
      { title: 'Information you choose to provide', body: 'A project enquiry may include your name, company, location, email address, phone number, required service, approximate budget and project description. Provide business-relevant information and avoid including sensitive personal information in the description.' },
      { title: 'Why we request it', body: 'Enquiry information is used to understand your requirements, respond to you, prepare a proposal and manage the resulting business conversation. Sending an enquiry does not automatically subscribe you to promotional messages.' },
      { title: 'External services and links', body: 'Links to Instagram, YouTube, email and other external platforms take you to services with their own privacy practices. If a WhatsApp contact option is available, opening it shares your interaction with WhatsApp under its terms.' },
      { title: 'Website measurement', body: 'Where website analytics is configured, conversion measurement should record actions such as enquiry completion or contact-link clicks without sending names, email addresses, phone numbers or project descriptions as analytics-event data.' },
      { title: 'Questions about your enquiry', body: 'Email kathakaantam@gmail.com to ask about information you submitted, request a correction or request deletion. Include enough context to identify the enquiry without sending unnecessary personal documents.' },
    ],
    related: [proposalLink],
  },
  {
    path: '/services/',
    title: 'Creative, Marketing & Technology Services | Katha Kantam Media',
    description: 'Explore eight capability areas across creative production, branding, marketing, websites, automation, CRM, analytics and global creative services.',
    heading: 'One growth partner. A connected set of capabilities.',
    intro: 'Start with the business problem. We bring together the creative, marketing and digital work it needs, with consultation-led discovery for expanding technology capabilities.',
    sections: [],
    related: [{ href: '/industries/', label: 'Find your industry' }, proposalLink],
  },
  {
    path: '/industries/',
    title: 'Industries We Serve | Katha Kantam Media',
    description: 'Creative, marketing and digital support for healthcare, schools, real estate, founders, local businesses and international agencies.',
    heading: 'Different businesses. The right story for each.',
    intro: 'Your audience, buying journey and working realities shape the brief. Explore how creative, marketing and digital support can fit your industry.',
    sections: [],
    related: [{ href: '/services/', label: 'Explore our capabilities' }, proposalLink],
  },
  {
    path: '/work/',
    title: 'Selected Work & Project Stories | Katha Kantam Media',
    description: 'Explore Katha Kantam Media’s existing school, creator, real estate and public-awareness portfolio through original project links.',
    heading: 'Stories with somewhere to go.',
    intro: 'School communities. Creator channels. Places to call home. Explore selected projects through their original published work.',
    sections: [],
    projectIndexes: [0, 1, 2, 3, 4, 5],
    related: [{ href: '/services/', label: 'What could we make together?' }, proposalLink],
  },
];

export function normalizePath(path: string): string {
  const clean = path.split('?')[0].split('#')[0].replace(/\/+$/, '');
  return clean ? `${clean}/` : '/';
}

export const detailPages: PageContent[] = [...generalPages, ...capabilities, ...industries];

export const pages: PageMetadata[] = [
  {
    path: '/',
    title: 'Katha Kantam Media | Creative. Marketing. Technology.',
    description: 'Creative. Marketing. Technology. One Growth Partner. Katha Kantam Media helps ambitious businesses build stronger brands and grow from India to the world.',
  },
  {
    path: '/contact/',
    title: 'Request a Proposal | Katha Kantam Media',
    description: 'Tell Katha Kantam Media about your business, creative brief or digital growth project. Request a proposal, discovery call or global partnership conversation.',
  },
  ...detailPages.map(({ path, title, description }) => ({ path, title, description })),
];

export function getPageContent(path: string): PageContent | undefined {
  const normalized = normalizePath(path);
  return detailPages.find((page) => page.path === normalized);
}
