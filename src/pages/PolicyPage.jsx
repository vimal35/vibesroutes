import { useEffect, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, ShieldCheck } from 'lucide-react';
import { SitePageHeader, AboutFooter } from './About';
import { POLICY_LAST_UPDATED, policies, policyLinks } from './policies/policyContent';
import './Home.css';
import './PolicyPage.css';

export default function PolicyPage({ policy }) {
  const content = policies[policy] || policies.terms;
  const Icon = policy === 'privacy' ? ShieldCheck : FileText;
  const otherPolicies = policyLinks.filter((item) => item.key !== policy);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [policy]);

  useEffect(() => {
    const previousTitle = document.title;
    const metaDescription = document.querySelector('meta[name="description"]');
    const createdDescription = !metaDescription;
    const descriptionTag = metaDescription || document.createElement('meta');
    if (createdDescription) {
      descriptionTag.name = 'description';
      document.head.appendChild(descriptionTag);
    }
    document.title = `${content.title} | Stay Ease`;
    descriptionTag.content = content.description;

    return () => {
      document.title = previousTitle;
      if (createdDescription) descriptionTag.remove();
    };
  }, [content]);

  return (
    <div className="policy-page">
      <SitePageHeader activePage="policy" />
      <main>
        <section className="policy-hero">
          <div className="container">
            <span className="section-tag"><Icon size={15} /> STAY EASE POLICIES</span>
            <h1>{content.title}</h1>
            <p>{content.intro}</p>
            <span className="policy-updated">Last updated: {POLICY_LAST_UPDATED}</span>
            <p className="policy-review-note">Draft for business confirmation and review by a qualified legal professional before publication.</p>
          </div>
        </section>

        <section className="section policy-content-section" aria-label={content.title}>
          <div className="container policy-content-layout">
            <aside className="policy-aside">
              <div className="policy-aside-icon"><Icon size={23} /></div>
              <h2>On this page</h2>
              <nav aria-label={`${content.title} sections`}>
                <ol className="policy-toc">
                  {content.sections.map((item, index) => (
                    <li key={item.title}><a href={`#${policy}-section-${index + 1}`}>{item.title}</a></li>
                  ))}
                </ol>
              </nav>
              <div className="policy-aside-contact">
                <h3>Questions?</h3>
                <p>Contact Stay Ease through the customer enquiry page.</p>
                <Link to="/contact">Contact Us <ArrowRight size={15} /></Link>
              </div>
            </aside>

            <div className="policy-sections">
              {content.sections.map((item, index) => (
                <section className="policy-section" id={`${policy}-section-${index + 1}`} key={item.title} aria-labelledby={`${policy}-heading-${index + 1}`}>
                  <span className="policy-section-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <h2 id={`${policy}-heading-${index + 1}`}>{item.title}</h2>
                    {item.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                    {item.bullets?.length > 0 && <ul>{item.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
                    {item.links?.length > 0 && <p className="policy-section-links">Related: {item.links.map((link, linkIndex) => <span key={link.path}>{linkIndex > 0 && ' · '}<Link to={link.path}>{link.label}</Link></span>)}</p>}
                  </div>
                </section>
              ))}

              <div className="policy-bottom">
                <p>{content.closing}</p>
                <p>Questions about this policy? <Link to="/contact">Contact Us</Link>.</p>
                <nav className="policy-other-links" aria-label="Other Stay Ease policies">
                  {otherPolicies.map((item) => <Link key={item.key} to={item.path}>{item.title}</Link>)}
                </nav>
              </div>
            </div>
          </div>
        </section>
      </main>
      <AboutFooter activePage="policy" />
    </div>
  );
}
