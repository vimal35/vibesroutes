import { useLayoutEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, LockKeyhole, UserRound } from 'lucide-react';
import { SitePageHeader, AboutFooter } from './About';
import './Home.css';
import './SignIn.css';

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!email.trim()) nextErrors.email = 'Enter your email address.';
    else if (!isValidEmail(email)) nextErrors.email = 'Enter a valid email address.';
    if (!password) nextErrors.password = 'Enter your password.';
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      document.getElementById(`signin-${Object.keys(nextErrors)[0]}`)?.focus();
      return;
    }

    // Customer authentication is not implemented in the current backend.
    // Never send credentials to an endpoint that does not exist.
    setPassword('');
    setShowPassword(false);
    setErrors({ form: 'Customer sign-in is not available yet because no customer authentication service is connected. Your password was not sent or saved.' });
  };

  return (
    <div className="signin-page">
      <SitePageHeader activePage="sign-in" />
      <main className="signin-main">
        <section className="signin-layout container" aria-labelledby="signin-title">
          <div className="signin-form-panel">
            <div className="signin-brand-mark"><span className="logo-badge"><UserRound size={20} /></span><span>Stay<em>Ease</em></span></div>
            <span className="section-tag">WELCOME BACK</span>
            <h1 id="signin-title">Your Next Stay <span className="hl">Awaits.</span></h1>
            <p className="signin-intro">Sign in to Stay Ease to access your account, keep track of your bookings, and continue planning your next getaway.</p>

            <form className="signin-form" onSubmit={handleSubmit} noValidate>
              <div className="signin-field">
                <label htmlFor="signin-email">Email Address <span aria-hidden="true">*</span></label>
                <input id="signin-email" name="email" type="email" autoComplete="email" inputMode="email" placeholder="you@example.com" maxLength="254" required value={email} onChange={(event) => { setEmail(event.target.value); setErrors((current) => ({ ...current, email: undefined, form: undefined })); }} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'signin-email-error' : undefined} />
                {errors.email && <span className="signin-error" id="signin-email-error">{errors.email}</span>}
              </div>
              <div className="signin-field">
                <label htmlFor="signin-password">Password <span aria-hidden="true">*</span></label>
                <div className="signin-password-wrap">
                  <LockKeyhole size={17} aria-hidden="true" />
                  <input id="signin-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required value={password} onChange={(event) => { setPassword(event.target.value); setErrors((current) => ({ ...current, password: undefined, form: undefined })); }} aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? 'signin-password-error' : undefined} />
                  <button className="signin-password-toggle" type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                </div>
                {errors.password && <span className="signin-error" id="signin-password-error">{errors.password}</span>}
              </div>
              {errors.form && <div className="signin-server-error" role="alert">{errors.form}</div>}
              <button className="btn-signup signin-submit" type="submit">Sign In</button>
            </form>

            <p className="signin-help">Forgot your password? Password recovery isn't available yet. <Link to="/contact">Contact us</Link> for assistance.</p>
            <p className="signin-signup">Don't have an account? <Link to="/sign-up">Create one</Link></p>
          </div>

          <aside className="signin-visual" aria-label="A welcoming Stay Ease destination">
            <div className="signin-visual-overlay" />
            <div className="signin-visual-copy"><span>Make room for a getaway</span><h2>Find a place to feel at ease.</h2></div>
          </aside>
        </section>
      </main>
      <AboutFooter />
    </div>
  );
}
