import { ArrowUpRight } from 'lucide-react';
import { projects } from './data';
import {
  capabilities,
  getPageContent,
  industries,
  normalizePath,
  partnershipOptions,
  projectNotes,
  type PageContent,
} from './content';

function CapabilityIndex() {
  return (
    <div className="editorial-list">
      {capabilities.map((capability) => (
        <a href={capability.path} key={capability.slug}>
          <div>
            <h2>{capability.shortTitle}</h2>
            <p>{capability.summary}</p>
            {capability.consultationLed && <small>Consultation-led · scope confirmed before delivery</small>}
          </div>
          <ArrowUpRight aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}

function IndustryIndex() {
  return (
    <div className="editorial-list">
      {industries.map((industry) => (
        <a href={industry.path} key={industry.slug}>
          <div>
            <h2>{industry.title.split(' | ')[0]}</h2>
            <p>{industry.summary}</p>
          </div>
          <ArrowUpRight aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}

function ProjectWork({ indexes, detailed = false }: { indexes: number[]; detailed?: boolean }) {
  return (
    <div className="work-grid">
      {indexes.map((index) => {
        const project = projects[index];
        const note = projectNotes[index];
        if (!project || !note) return null;
        return (
          <article className="work-card" key={project.title}>
            <p>{project.category}</p>
            <h3>{project.title}</h3>
            <p>{detailed ? note.context : project.description}</p>
            {detailed && (
              <>
                <h4>The work</h4>
                <p>{note.work}</p>
                {project.services && <ul>{project.services.map((service) => <li key={service}>{service}</li>)}</ul>}
                <p>{note.nextStep}</p>
              </>
            )}
            <div>
              {project.links?.map((link) => (
                <a className="inline-link" href={link.url} key={link.url} target="_blank" rel="noopener noreferrer" aria-label={`${link.label} — ${project.title} (opens in a new tab)`}>
                  {link.label}<ArrowUpRight size={17} aria-hidden="true" />
                </a>
              ))}
            </div>
          </article>
        );
      })}
    </div>
  );
}

function DetailSections({ content }: { content: PageContent }) {
  return (
    <div className="detail-columns">
      {content.sections.map((section) => (
        <section className="detail-section" key={section.title}>
          <h2>{section.title}</h2>
          {section.body && <p>{section.body}</p>}
          {section.items && <ul>{section.items.map((item) => <li key={item}>{item}</li>)}</ul>}
        </section>
      ))}
    </div>
  );
}

export default function DetailPage({ path }: { path: string }) {
  const normalized = normalizePath(path);
  const content = getPageContent(normalized);
  if (!content) {
    return (
      <div className="detail-page wrap">
        <section className="detail-hero">
          <h1>This page has moved out of frame.</h1>
          <p className="detail-intro">The address may be incomplete. Explore our capabilities or return to the homepage.</p>
          <a className="button button-dark" href="/">Back to the homepage<ArrowUpRight size={18} aria-hidden="true" /></a>
        </section>
      </div>
    );
  }

  const capability = capabilities.find((item) => item.path === normalized);
  const consultationLed = capability?.consultationLed;
  const proposalHref = normalized === '/global-partnerships/'
    ? '/contact/?intent=partnership'
    : capability ? `/contact/?service=${capability.slug}` : '/contact/';

  return (
    <div className="detail-page">
      <div className="wrap">
        <header className="detail-hero">
          <h1>{content.heading}</h1>
          <p className="detail-intro">{content.intro}</p>
          {consultationLed && <p>Consultation-led capability. Feasibility, specialist support and delivery scope are confirmed before a commitment.</p>}
          {normalized !== '/privacy/' && (
            <a className="button button-dark" href={proposalHref}>
              {normalized === '/global-partnerships/' ? 'Discuss a partnership' : 'Get a proposal'}<ArrowUpRight size={18} aria-hidden="true" />
            </a>
          )}
        </header>

        {normalized === '/services/' && <CapabilityIndex />}
        {normalized === '/industries/' && <IndustryIndex />}
        {content.sections.length > 0 && <DetailSections content={content} />}

        {normalized === '/global-partnerships/' && (
          <section className="detail-section">
            <h2>A working model that fits the brief.</h2>
            <div className="detail-columns">
              {partnershipOptions.map((option) => <div key={option.title}><h3>{option.title}</h3><p>{option.description}</p></div>)}
            </div>
          </section>
        )}

        {content.projectIndexes && content.projectIndexes.length > 0 && (
          <section className="detail-section">
            <h2>{normalized === '/work/' ? 'Selected project stories.' : 'Related published work.'}</h2>
            <ProjectWork indexes={content.projectIndexes} detailed={normalized === '/work/'} />
          </section>
        )}

        <nav className="detail-related" aria-label="Explore related pages">
          {content.related.map((link) => (
            <a className="inline-link" key={link.href} href={link.href}>{link.label}<ArrowUpRight size={18} aria-hidden="true" /></a>
          ))}
        </nav>
      </div>
    </div>
  );
}
