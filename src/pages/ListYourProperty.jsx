import { useLayoutEffect, useState } from 'react';
import { ArrowRight, BadgeCheck, Building2, ChartNoAxesCombined, Check, ClipboardList, Headset, House, KeyRound, MapPin, Send, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { SitePageHeader, AboutFooter } from './About';
import './Home.css';
import './ListYourProperty.css';

const benefits = [
  { icon: Users, title: 'Introduce your property', copy: 'Tell us where it is and what kind of stay you offer.' },
  { icon: Sparkles, title: 'Share the details', copy: 'Describe the features and experience that matter to your guests.' },
  { icon: Headset, title: 'Start with an enquiry', copy: 'Send your details for review; a listing or partnership is not guaranteed.' },
];

const steps = [
  { icon: ClipboardList, title: 'Send your property enquiry', copy: 'Share the basics and a short description of your property.' },
  { icon: BadgeCheck, title: 'The enquiry is received', copy: 'Your submitted details are saved for the team to review.' },
  { icon: KeyRound, title: 'Discuss any next steps', copy: 'Any listing arrangement would need to be agreed separately.' },
];

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '');
const STORY_WORD_LIMIT = 1000;

function countWords(text) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

export default function ListYourProperty() {
  const [story, setStory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    if (countWords(story) > STORY_WORD_LIMIT) {
      setSubmitStatus({ type: 'error', message: 'Your story must be 1,000 words or fewer.' });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });
    try {
      const response = await fetch(`${API_BASE}/api/property-enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: String(form.get('name') || '').trim(),
          email: String(form.get('email') || '').trim(),
          property: String(form.get('property') || '').trim(),
          location: String(form.get('location') || '').trim(),
          type: String(form.get('type') || '').trim(),
          story: story.trim(),
        }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || result?.success !== true) {
        throw new Error(result?.message || 'We could not save your enquiry. Please try again.');
      }
      setSubmitStatus({ type: 'success', message: 'Your property enquiry has been received. Sending it does not create or guarantee a listing.' });
      formElement.reset();
      setStory('');
    } catch (error) {
      setSubmitStatus({ type: 'error', message: error.message || 'We could not save your enquiry. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="property-page">
      <SitePageHeader activePage="property" />
      <main>
        <section className="property-hero">
          <div className="container property-hero-grid">
            <div className="property-hero-copy">
              <span className="property-eyebrow"><span /> For property owners</span>
              <h1>Tell us about your place with <span>VibezRoutes</span></h1>
              <p>Have a hotel, resort, villa, or homestay? Share a few details to start a property enquiry. Any listing or partnership would be subject to a separate agreement.</p>
              <a className="btn-signup property-hero-cta" href="#property-enquiry">List your property <ArrowRight size={17} /></a>
              <div className="property-trust-line"><ShieldCheck size={17} /> An enquiry is not a commitment to list.</div>
            </div>
            <div className="property-hero-image">
              <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=85" alt="A welcoming resort surrounded by greenery" fetchPriority="high" />
              <div className="property-image-caption"><span className="property-caption-icon"><House size={19} /></span><span><strong>Introduce your property</strong><small>Start a property enquiry with VibezRoutes</small></span></div>
            </div>
          </div>
        </section>

        <section className="section property-benefits" aria-labelledby="property-benefits-title">
          <div className="container">
            <div className="section-head">
              <span className="section-tag">Start with the details</span>
              <h2 className="section-title" id="property-benefits-title">Tell us what makes your <span className="hl">place yours</span></h2>
              <p className="section-desc">Share what travelers might want to know about your property and where it is.</p>
            </div>
            <div className="property-benefit-grid">
              {benefits.map(({ icon: Icon, title, copy }, index) => (
                <article className="property-benefit-card" key={title}>
                  <span className="property-benefit-icon"><Icon size={22} /></span>
                  <span className="property-benefit-number">0{index + 1}</span>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="property-process-section" aria-labelledby="property-process-title">
          <div className="container property-process-layout">
            <div className="property-process-intro">
              <span className="section-tag">How the enquiry works</span>
              <h2 id="property-process-title">A first step, <span className="hl">not a listing promise</span></h2>
              <p>Send your details through the form. Any follow-up or listing arrangement depends on a separate conversation.</p>
              <div className="property-process-note"><Check size={18} /> Share details to start an enquiry</div>
            </div>
            <div className="property-step-list">
              {steps.map(({ icon: Icon, title, copy }, index) => (
                <article className="property-step" key={title}>
                  <div className="property-step-marker"><Icon size={20} /><span>{index + 1}</span></div>
                  <div><h3>{title}</h3><p>{copy}</p></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section property-enquiry-section" id="property-enquiry" aria-labelledby="property-enquiry-title">
          <div className="container property-enquiry-layout">
            <div className="property-enquiry-copy">
              <span className="section-tag">Start with your story</span>
              <h2 id="property-enquiry-title">Introduce your <span className="hl">property</span></h2>
              <p>Share the basics and a little about the stay you offer. The form sends your property enquiry to VibezRoutes.</p>
              <div className="property-contact-hint"><MapPin size={19} /><span>We’re currently welcoming enquiries for stays across South India.</span></div>
              <div className="property-contact-hint"><ChartNoAxesCombined size={19} /><span>Have questions first? Contact our team and we’ll help you explore the options.</span></div>
            </div>
            <form className="property-enquiry-form" onSubmit={handleSubmit}>
              <div className="property-form-heading"><span><Building2 size={20} /></span><div><h3>Property details</h3><p>Fields marked as required help us understand your enquiry.</p></div></div>
              <div className="property-form-grid">
                <label>Your name<input name="name" type="text" autoComplete="name" placeholder="Full name" maxLength="120" required /></label>
                <label>Email address<input name="email" type="email" autoComplete="email" placeholder="you@example.com" maxLength="254" required /></label>
                <label className="property-form-wide">Property name<input name="property" type="text" placeholder="Name of your property" maxLength="160" required /></label>
                <label>City or destination<input name="location" type="text" placeholder="e.g. Pondicherry" maxLength="120" required /></label>
                <label>Property type<select name="type" defaultValue="" required><option value="" disabled>Select type</option><option>Hotel</option><option>Resort</option><option>Villa</option><option>Homestay</option><option>Guest house</option><option>Other</option></select></label>
                <label className="property-form-wide" htmlFor="property-story">Your story<textarea id="property-story" name="story" rows="7" placeholder="Tell us about your property, what makes it special, and the kind of guests you welcome..." value={story} onChange={(event) => { setStory(event.target.value); setSubmitStatus({ type: '', message: '' }); }} required aria-describedby="property-story-count property-story-help" /></label>
                <div className="property-story-meta property-form-wide"><span id="property-story-help">Share the story behind your stay. Maximum 1,000 words.</span><span id="property-story-count" aria-live="polite">{countWords(story).toLocaleString()} / 1,000 words</span></div>
              </div>
              {submitStatus.message && <p className={`property-submit-status ${submitStatus.type}`} role={submitStatus.type === 'error' ? 'alert' : 'status'}>{submitStatus.message}</p>}
              <button className="btn-signup property-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving…' : 'Send enquiry'} <Send size={16} /></button>
              <p className="property-form-privacy">Your information will be used to follow up about this property enquiry.</p>
            </form>
          </div>
        </section>

      </main>
      <AboutFooter activePage="property" />
    </div>
  );
}
