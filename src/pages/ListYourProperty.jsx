import { useLayoutEffect, useState } from 'react';
import { ArrowRight, BadgeCheck, Building2, ChartNoAxesCombined, Check, ClipboardList, Headset, House, KeyRound, MapPin, Send, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { SitePageHeader, AboutFooter } from './About';
import './Home.css';
import './ListYourProperty.css';

const benefits = [
  { icon: Users, title: 'Meet travelers looking for their next stay', copy: 'Present your property to people exploring places across South India.' },
  { icon: Sparkles, title: 'Show what makes your stay special', copy: 'Share the details, amenities, and photos that help guests picture their visit.' },
  { icon: Headset, title: 'Get help as you get started', copy: 'Tell us about your property and our team can guide you through the next steps.' },
];

const steps = [
  { icon: ClipboardList, title: 'Tell us about your property', copy: 'Share a few details so we can understand your stay and where it is.' },
  { icon: BadgeCheck, title: 'Connect with our team', copy: 'We’ll follow up to learn more and discuss the listing process with you.' },
  { icon: KeyRound, title: 'Get ready to welcome guests', copy: 'Prepare your property information and photos for your listing.' },
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
      setSubmitStatus({ type: 'success', message: 'Your property enquiry has been saved. Our team will be in touch.' });
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
              <h1>Put your place on the map with <span>Stay Ease</span></h1>
              <p>Have a hotel, resort, villa, or homestay? Tell us about it and take the first step toward welcoming travelers to your property.</p>
              <a className="btn-signup property-hero-cta" href="#property-enquiry">List your property <ArrowRight size={17} /></a>
              <div className="property-trust-line"><ShieldCheck size={17} /> A simple first step. No commitment to list.</div>
            </div>
            <div className="property-hero-image">
              <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=85" alt="A welcoming resort surrounded by greenery" fetchPriority="high" />
              <div className="property-image-caption"><span className="property-caption-icon"><House size={19} /></span><span><strong>Your property, discovered</strong><small>Start a conversation with Stay Ease</small></span></div>
            </div>
          </div>
        </section>

        <section className="section property-benefits" aria-labelledby="property-benefits-title">
          <div className="container">
            <div className="section-head">
              <span className="section-tag">A partnership that starts with you</span>
              <h2 className="section-title" id="property-benefits-title">Bring your stay to <span className="hl">more travelers</span></h2>
              <p className="section-desc">Every property has something special to offer. Let’s make it easier for travelers to find yours.</p>
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
              <span className="section-tag">Getting started</span>
              <h2 id="property-process-title">A clear path from <span className="hl">hello to hosting</span></h2>
              <p>Start by sharing a few details. Our team can then help you understand what comes next.</p>
              <div className="property-process-note"><Check size={18} /> No lengthy application to begin</div>
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
              <span className="section-tag">Let’s get to know your stay</span>
              <h2 id="property-enquiry-title">Start your <span className="hl">listing enquiry</span></h2>
              <p>Share a few details about your property and tell us your story. Your enquiry will be saved for our team.</p>
              <div className="property-contact-hint"><MapPin size={19} /><span>We’re currently welcoming enquiries for stays across South India.</span></div>
              <div className="property-contact-hint"><ChartNoAxesCombined size={19} /><span>Have questions first? Contact our team and we’ll help you explore the options.</span></div>
            </div>
            <form className="property-enquiry-form" onSubmit={handleSubmit}>
              <div className="property-form-heading"><span><Building2 size={20} /></span><div><h3>Property details</h3><p>It only takes a moment to get started.</p></div></div>
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
