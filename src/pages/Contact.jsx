import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, ArrowUpRight, Building2, CheckCircle2, ChevronDown, Mail, MessageCircle, Phone, Send, ShieldCheck, Sparkles } from 'lucide-react';
import { AboutFooter, SitePageHeader } from './About';
import './Home.css';
import './Contact.css';

const CONTACT_API_URL = import.meta.env.VITE_CONTACT_API_URL;

const subjectOptions = [
  'Booking Enquiry',
  'Help With a Stay',
  'Listing My Property',
  'General Question',
  'Feedback or Suggestion',
  'Other',
];

const enquiries = [
  {
    title: 'Questions about your trip',
    description: 'Ask about exploring destinations, stays, or using the website.',
    icon: MessageCircle,
    destination: 'faq',
  },
  {
    title: 'Property enquiries',
    description: 'Share a few details about your property to start an enquiry.',
    icon: Building2,
    destination: 'property',
  },
];

const faqs = [
  {
    question: 'How can I ask about a stay?',
    answer: 'Use the contact form and choose the enquiry type that best fits your question. If you have a booking reference, include it for context.',
  },
  {
    question: 'Can I get in touch before choosing a stay?',
    answer: 'Yes. Send a general enquiry if you have a question about the website or want to ask about the options shown.',
  },
  {
    question: 'How do I enquire about listing a property?',
    answer: 'Choose “Listing My Property” in the contact form and share a little about the property and your question. Sending an enquiry does not create or publish a listing.',
  },
  {
    question: 'What details should I include?',
    answer: 'Describe your question clearly and include relevant details. If your enquiry concerns an existing booking, include the booking reference where available. Avoid sharing passwords, payment card details, or other sensitive information.',
  },
  {
    question: 'How will I know if my message went through?',
    answer: 'The page displays a confirmation only after the contact service accepts your message. Email confirmation is not available unless that service is configured to provide it.',
  },
];

const initialForm = {
  fullName: '',
  email: '',
  subject: '',
  bookingReference: '',
  message: '',
};

function validateForm(values) {
  const errors = {};

  if (!values.fullName.trim()) errors.fullName = 'Enter your full name.';
  if (!values.email.trim()) errors.email = 'Enter your email address.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = 'Enter a valid email address.';
  if (!values.subject) errors.subject = 'Choose an enquiry type.';
  if (!values.message.trim()) errors.message = 'Enter a message.';

  return errors;
}

export default function Contact() {
  const formSectionRef = useRef(null);
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState(-1);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const revealElements = document.querySelectorAll('[data-contact-reveal]');
    if (!('IntersectionObserver' in window)) {
      revealElements.forEach((element) => element.classList.add('is-visible'));
      return undefined;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealElements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const scrollToForm = () => {
    formSectionRef.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  };

  const updateField = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    if (formStatus.type === 'error') setFormStatus({ type: '', message: '' });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    const nextErrors = validateForm(formData);
    setErrors(nextErrors);
    setFormStatus({ type: '', message: '' });
    if (Object.keys(nextErrors).length > 0) {
      const fieldIds = {
        fullName: 'contact-full-name',
        email: 'contact-email',
        subject: 'contact-subject',
        message: 'contact-message',
      };
      window.requestAnimationFrame(() => document.getElementById(fieldIds[Object.keys(nextErrors)[0]])?.focus());
      return;
    }

    if (!CONTACT_API_URL) {
      setFormStatus({
        type: 'error',
        message: 'Message delivery is not configured yet, so your message has not been sent. The site owner must connect a contact submission endpoint before this form can deliver enquiries.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(CONTACT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          subject: formData.subject,
          bookingReference: formData.bookingReference.trim(),
          message: formData.message.trim(),
        }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || result?.success !== true) {
        throw new Error(result?.message || 'The contact service could not accept your message.');
      }

      setFormStatus({ type: 'success', message: 'Your message was submitted successfully.' });
      setFormData(initialForm);
      setErrors({});
    } catch {
      setFormStatus({ type: 'error', message: 'We could not submit your message. Your entries are still here; please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <SitePageHeader activePage="contact" />
      <main>
        <section className="contact-hero" aria-labelledby="contact-title">
          <div className="container contact-hero-layout">
            <div className="contact-hero-copy">
              <span className="contact-eyebrow"><span /> A route for every kind of question</span>
              <h1 id="contact-title">Let’s talk about <span className="hl">what’s next.</span></h1>
              <p>Ask us about the website, a stay you’re considering, or a property enquiry. Share the details that matter and we’ll receive your message through the contact form.</p>
              <button className="btn-signup contact-primary-cta" type="button" onClick={scrollToForm}>Get in Touch <ArrowDown size={17} /></button>
            </div>
            <div className="contact-hero-visual" aria-hidden="true">
              <img src="https://images.pexels.com/photos/7368269/pexels-photo-7368269.jpeg?auto=compress&cs=tinysrgb&w=1000" alt="" fetchPriority="high" />
              <div className="contact-hero-badge"><Sparkles size={18} /><span>Every journey starts somewhere</span></div>
            </div>
          </div>
        </section>

        <section className="section contact-main-section" id="contact-form" ref={formSectionRef} aria-labelledby="contact-form-title">
          <div className="container">
            <div className="section-head">
              <span className="section-tag">Send us a message</span>
              <h2 className="section-title" id="contact-form-title">We'd Love to <span className="hl">Hear From You</span></h2>
              <p className="section-desc">Share your question or tell us how we can help. Fill in the details below, and we'll help you find the right next step.</p>
            </div>

            <div className="contact-main-grid">
              <form className="contact-form-card" onSubmit={handleSubmit} noValidate>
                <div className="contact-form-grid">
                  <div className="contact-field">
                    <label htmlFor="contact-full-name">Full Name <span aria-hidden="true">*</span></label>
                    <input id="contact-full-name" name="fullName" type="text" autoComplete="name" placeholder="Your full name" required value={formData.fullName} onChange={updateField} aria-invalid={Boolean(errors.fullName)} aria-describedby={errors.fullName ? 'contact-full-name-error' : undefined} />
                    {errors.fullName && <span className="contact-field-error" id="contact-full-name-error">{errors.fullName}</span>}
                  </div>
                  <div className="contact-field">
                    <label htmlFor="contact-email">Email Address <span aria-hidden="true">*</span></label>
                    <input id="contact-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required value={formData.email} onChange={updateField} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'contact-email-error' : undefined} />
                    {errors.email && <span className="contact-field-error" id="contact-email-error">{errors.email}</span>}
                  </div>
                  <div className="contact-field">
                    <label htmlFor="contact-subject">Subject <span aria-hidden="true">*</span></label>
                    <div className="contact-select-wrap">
                      <select id="contact-subject" name="subject" required value={formData.subject} onChange={updateField} aria-invalid={Boolean(errors.subject)} aria-describedby={errors.subject ? 'contact-subject-error' : undefined}>
                        <option value="">Choose an enquiry type</option>
                        {subjectOptions.map((option) => <option value={option} key={option}>{option}</option>)}
                      </select>
                      <ChevronDown size={17} aria-hidden="true" />
                    </div>
                    {errors.subject && <span className="contact-field-error" id="contact-subject-error">{errors.subject}</span>}
                  </div>
                  <div className="contact-field">
                    <label htmlFor="contact-booking-reference">Booking Reference <span className="contact-optional">Optional</span></label>
                    <input id="contact-booking-reference" name="bookingReference" type="text" placeholder="If you have one" value={formData.bookingReference} onChange={updateField} />
                  </div>
                  <div className="contact-field contact-field-full">
                    <label htmlFor="contact-message">Message <span aria-hidden="true">*</span></label>
                    <textarea id="contact-message" name="message" rows="6" placeholder="Tell us a little about how we can help..." required value={formData.message} onChange={updateField} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'contact-message-error' : 'contact-privacy-note'} />
                    {errors.message && <span className="contact-field-error" id="contact-message-error">{errors.message}</span>}
                    <span className="contact-privacy-note" id="contact-privacy-note">Please don't include passwords or payment card details.</span>
                  </div>
                </div>

                {formStatus.message && (
                  <div className={`contact-form-status ${formStatus.type}`} role={formStatus.type === 'error' ? 'alert' : 'status'}>
                    {formStatus.type === 'success' && <CheckCircle2 size={19} aria-hidden="true" />}
                    <span>{formStatus.message}</span>
                  </div>
                )}

                <div className="contact-form-submit-row">
                  <button className="btn-signup contact-submit" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending…' : 'Send Message'} <Send size={16} aria-hidden="true" />
                  </button>
                  <span>Fields marked * are required.</span>
                </div>
              </form>

              <aside className="contact-info-column" data-contact-reveal aria-labelledby="contact-info-title">
                <div className="contact-info-heading">
                  <span className="section-tag">Here for your questions</span>
                  <h2 id="contact-info-title">Other Ways to Reach Us</h2>
                  <p>Choose the way that works best for you.</p>
                </div>
                <div className="contact-info-cards">
                  {enquiries.map(({ title, description, icon: Icon, destination }, index) => (
                    <article className="contact-info-card" key={title} style={{ '--reveal-delay': `${index * 90}ms` }}>
                      <span className="contact-info-icon"><Icon size={20} aria-hidden="true" /></span>
                      <div>
                        <h3>{title}</h3>
                        <p>{description}</p>
                        {destination === 'faq' ? (
                          <button className="contact-info-action" type="button" onClick={() => document.getElementById('contact-faq')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })}>Before You Reach Out <ArrowUpRight size={15} /></button>
                        ) : (
                          <Link className="contact-info-action" to="/list-your-property">List your property <ArrowUpRight size={15} /></Link>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
                <div className="contact-existing-details">
                  <a href="mailto:support@vibezroutes.com"><Mail size={17} /> support@vibezroutes.com</a>
                  <a href="tel:+918005550199"><Phone size={17} /> +91 80055 50199</a>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="section contact-story-section" data-contact-reveal aria-labelledby="contact-story-title">
          <div className="container contact-story-layout">
            <div className="contact-story-image">
              <img src="https://images.pexels.com/photos/7368277/pexels-photo-7368277.jpeg?auto=compress&cs=tinysrgb&w=900" alt="Travelers planning their next journey together" loading="lazy" decoding="async" />
            </div>
            <div className="contact-story-copy">
              <span className="section-tag">Every journey matters</span>
              <h2 id="contact-story-title">A Better Stay Begins With a <span className="hl">Conversation</span></h2>
              <p>Every journey comes with its own plans, questions, and little details that matter. Whether you're exploring a new destination, arranging a family holiday, planning a weekend escape, or considering listing your property, we're here to make the process feel easier.</p>
              <p>VibezRoutes brings destination ideas and stay information together. If something is unclear as you explore, use the form to tell us what you need to know.</p>
              <strong>Every trip has its own questions. Start with yours.</strong>
            </div>
          </div>
        </section>

        <section className="section contact-faq-section" id="contact-faq" data-contact-reveal aria-labelledby="contact-faq-title">
          <div className="container contact-faq-layout">
            <div className="contact-faq-heading">
              <span className="section-tag">Quick answers</span>
              <h2 className="section-title" id="contact-faq-title">Before You <span className="hl">Reach Out</span></h2>
              <p className="section-desc">Here are a few helpful answers to common questions.</p>
            </div>
            <div className="contact-faq-list">
              {faqs.map(({ question, answer }, index) => {
                const isOpen = openFaq === index;
                const panelId = `contact-faq-answer-${index + 1}`;
                return (
                  <article className={`contact-faq-item ${isOpen ? 'open' : ''}`} key={question}>
                    <h3>
                      <button type="button" className="contact-faq-question" aria-expanded={isOpen} aria-controls={panelId} onClick={() => setOpenFaq(isOpen ? -1 : index)}>
                        <span><small>Q{index + 1}.</small> {question}</span>
                        <ChevronDown size={19} aria-hidden="true" />
                      </button>
                    </h3>
                    <div className={`contact-faq-answer-wrap ${isOpen ? 'expanded' : ''}`} id={panelId} aria-hidden={!isOpen}>
                      <div><p>{answer}</p></div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="contact-final-cta container" data-contact-reveal aria-labelledby="contact-final-title">
          <div className="contact-final-icon"><ShieldCheck size={25} aria-hidden="true" /></div>
          <div>
            <h2 id="contact-final-title">Your Next Journey Starts With a Conversation.</h2>
            <p>Share a question about a destination, stay, or property enquiry.</p>
          </div>
          <button type="button" className="btn-signup" onClick={scrollToForm}>Send Us a Message <ArrowRight size={16} /></button>
        </section>
      </main>
      <AboutFooter activePage="contact" />
    </div>
  );
}
