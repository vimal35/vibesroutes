import { useLayoutEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, CalendarDays, CheckCircle2, MapPin, MessageCircle, ShieldCheck, UserRound } from 'lucide-react';
import { SitePageHeader, AboutFooter } from './About';
import './Home.css';
import './CustomerEnquiry.css';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '');
const OFFER_CONTEXT = {
  deal: { title: 'Early Summer Escapes', label: 'Grab the Deal' },
  join: { title: 'Book + Save Extra 15%', label: 'Join for Free' },
};

const emptyForm = {
  fullName: '',
  mobile: '',
  location: '',
  checkIn: '',
  checkOut: '',
  message: '',
};

function getToday() {
  const date = new Date();
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
}

function nextDate(dateString) {
  if (!dateString) return getToday();
  const date = new Date(`${dateString}T00:00:00`);
  date.setDate(date.getDate() + 1);
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
}

function isValidIndianMobile(value) {
  const compact = value.trim().replace(/[\s()-]/g, '');
  return /^(?:(?:\+|00)?91)?[6-9]\d{9}$/.test(compact);
}

function validate(values) {
  const errors = {};
  if (!values.fullName.trim()) errors.fullName = 'Enter your full name.';
  if (!values.mobile.trim()) errors.mobile = 'Enter your mobile number.';
  else if (!isValidIndianMobile(values.mobile)) errors.mobile = 'Enter a valid Indian mobile number, with or without +91.';
  if (!values.location.trim()) errors.location = 'Enter your preferred destination.';
  if (!values.checkIn) errors.checkIn = 'Choose a check-in date.';
  else if (values.checkIn < getToday()) errors.checkIn = 'Check-in cannot be in the past.';
  if (!values.checkOut) errors.checkOut = 'Choose a check-out date.';
  else if (values.checkIn && values.checkOut <= values.checkIn) errors.checkOut = 'Check-out must be after check-in.';
  return errors;
}

export default function CustomerEnquiry() {
  const [searchParams] = useSearchParams();
  const rawSource = searchParams.get('source');
  const offerContext = useMemo(() => {
    const expected = OFFER_CONTEXT[rawSource];
    return expected && searchParams.get('offer') === expected.title
      ? { source: rawSource, ...expected }
      : { source: 'direct', title: '', label: '' };
  }, [rawSource, searchParams]);
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const updateField = (event) => {
    const { name, value } = event.target;
    setFormData((current) => {
      const updated = { ...current, [name]: value };
      if (name === 'checkIn' && updated.checkOut && updated.checkOut <= value) updated.checkOut = '';
      return updated;
    });
    setErrors((current) => ({ ...current, [name]: undefined, ...(name === 'checkIn' ? { checkOut: undefined } : {}) }));
    setSubmitStatus({ type: '', message: '' });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    const nextErrors = validate(formData);
    setErrors(nextErrors);
    setSubmitStatus({ type: '', message: '' });
    const firstInvalid = Object.keys(nextErrors)[0];
    if (firstInvalid) {
      document.getElementById(`customer-${firstInvalid}`)?.focus();
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/api/customer-enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          fullName: formData.fullName.trim(),
          mobile: formData.mobile.trim(),
          location: formData.location.trim(),
          message: formData.message.trim(),
          source: offerContext.source,
          offer: offerContext.title || undefined,
        }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || result?.success !== true) {
        throw new Error(result?.message || 'We could not submit your enquiry. Please try again.');
      }
      setIsSubmitted(true);
      setFormData(emptyForm);
      setErrors({});
      setSubmitStatus({ type: '', message: '' });
    } catch (error) {
      setSubmitStatus({ type: 'error', message: error.message || 'We could not submit your enquiry. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="customer-enquiry-page">
      <SitePageHeader activePage="customer-enquiry" />
      <main>
        <section className="customer-enquiry-hero">
          <div className="container">
            <span className="section-tag">PLAN YOUR NEXT STAY</span>
            <h1>Let's Find Your <span className="hl">Perfect Stay.</span></h1>
            <p>Tell us a little about your travel plans, and let us help you take the next step towards your stay. Share your details, preferred location, and travel dates so we can understand what you're looking for.</p>
            {offerContext.title && <div className="customer-offer-context"><span>{offerContext.label}</span><strong>{offerContext.title}</strong></div>}
          </div>
        </section>

        <section className="section customer-enquiry-section" aria-labelledby="customer-form-title">
          <div className="container customer-enquiry-layout">
            <aside className="customer-enquiry-aside">
              <span className="customer-aside-icon"><MessageCircle size={22} /></span>
              <h2>Start with the details that matter to your trip.</h2>
              <p>This is a travel enquiry, not a confirmed booking. Our team will use the information you share to understand what you’re looking for.</p>
              <div className="customer-aside-points">
                <span><UserRound size={17} /> Your contact details</span>
                <span><MapPin size={17} /> Where you’d like to stay</span>
                <span><CalendarDays size={17} /> When you plan to travel</span>
              </div>
              <p className="customer-privacy-note"><ShieldCheck size={16} /> Your information will be used to handle this travel enquiry. See our <Link to="/privacy-policy">Privacy Policy</Link>.</p>
            </aside>

            <div className="customer-enquiry-card">
              {isSubmitted ? (
                <div className="customer-success" role="status" aria-live="polite">
                  <span><CheckCircle2 size={30} /></span>
                  <h2>Your Enquiry Has Been Received!</h2>
                  <p>Thank you for choosing Stay Ease. We've received your travel enquiry and will use the details you provided to help with your next steps.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <div className="customer-form-heading">
                    <span className="section-tag">A few details</span>
                    <h2 id="customer-form-title">Tell us about your plans</h2>
                    <p>Fields marked <span aria-hidden="true">*</span> are required.</p>
                  </div>
                  <div className="customer-form-grid">
                    <div className="customer-field">
                      <label htmlFor="customer-fullName">Full Name <span aria-hidden="true">*</span></label>
                      <input id="customer-fullName" name="fullName" type="text" autoComplete="name" placeholder="Your full name" maxLength="120" required value={formData.fullName} onChange={updateField} aria-invalid={Boolean(errors.fullName)} aria-describedby={errors.fullName ? 'customer-fullName-error' : undefined} />
                      {errors.fullName && <span className="customer-field-error" id="customer-fullName-error">{errors.fullName}</span>}
                    </div>
                    <div className="customer-field">
                      <label htmlFor="customer-mobile">Mobile Number <span aria-hidden="true">*</span></label>
                      <input id="customer-mobile" name="mobile" type="tel" inputMode="tel" autoComplete="tel" placeholder="+91 98765 43210" maxLength="18" required value={formData.mobile} onChange={updateField} aria-invalid={Boolean(errors.mobile)} aria-describedby={errors.mobile ? 'customer-mobile-error' : 'customer-mobile-help'} />
                      {errors.mobile ? <span className="customer-field-error" id="customer-mobile-error">{errors.mobile}</span> : <span className="customer-field-help" id="customer-mobile-help">Indian mobile number, with optional +91.</span>}
                    </div>
                    <div className="customer-field customer-field-wide">
                      <label htmlFor="customer-location">Preferred Location <span aria-hidden="true">*</span></label>
                      <input id="customer-location" name="location" type="text" list="customer-destinations" autoComplete="address-level2" placeholder="Choose or enter a destination" maxLength="160" required value={formData.location} onChange={updateField} aria-invalid={Boolean(errors.location)} aria-describedby={errors.location ? 'customer-location-error' : undefined} />
                      <datalist id="customer-destinations">
                        {['Ooty', 'Kodaikanal', 'Munnar', 'Alleppey', 'Coorg', 'Mysuru', 'Puducherry', 'Hyderabad', 'Wayanad'].map((destination) => <option value={destination} key={destination} />)}
                      </datalist>
                      {errors.location && <span className="customer-field-error" id="customer-location-error">{errors.location}</span>}
                    </div>
                    <div className="customer-field">
                      <label htmlFor="customer-checkIn">Check-in Date <span aria-hidden="true">*</span></label>
                      <input id="customer-checkIn" name="checkIn" type="date" min={getToday()} required value={formData.checkIn} onChange={updateField} aria-invalid={Boolean(errors.checkIn)} aria-describedby={errors.checkIn ? 'customer-checkIn-error' : undefined} />
                      {errors.checkIn && <span className="customer-field-error" id="customer-checkIn-error">{errors.checkIn}</span>}
                    </div>
                    <div className="customer-field">
                      <label htmlFor="customer-checkOut">Check-out Date <span aria-hidden="true">*</span></label>
                      <input id="customer-checkOut" name="checkOut" type="date" min={nextDate(formData.checkIn)} required value={formData.checkOut} onChange={updateField} aria-invalid={Boolean(errors.checkOut)} aria-describedby={errors.checkOut ? 'customer-checkOut-error' : undefined} />
                      {errors.checkOut && <span className="customer-field-error" id="customer-checkOut-error">{errors.checkOut}</span>}
                    </div>
                    <div className="customer-field customer-field-wide">
                      <label htmlFor="customer-message">Message <span className="customer-optional">Optional</span></label>
                      <textarea id="customer-message" name="message" rows="5" maxLength="2000" placeholder="Tell us about your preferences, number of guests, budget, or any special requirements…" value={formData.message} onChange={updateField} aria-describedby="customer-message-help" />
                      <span className="customer-field-help" id="customer-message-help">Please don’t include passwords, payment card details, or other sensitive information.</span>
                    </div>
                  </div>
                  {submitStatus.message && <div className="customer-submit-status error" role="alert">{submitStatus.message}</div>}
                  <button className="btn-signup customer-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Submitting…' : 'Submit Enquiry'} <ArrowRight size={17} /></button>
                  <p className="customer-form-privacy">By submitting, you’re asking Stay Ease to use these details to handle your travel enquiry. Read our <Link to="/privacy-policy">Privacy Policy</Link>.</p>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
      <AboutFooter />
    </div>
  );
}
