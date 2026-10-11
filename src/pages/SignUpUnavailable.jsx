import { useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserRound } from 'lucide-react';
import { SitePageHeader, AboutFooter } from './About';
import './Home.css';
import './SignIn.css';

export default function SignUpUnavailable() {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="signin-page">
      <SitePageHeader activePage="sign-in" />
      <main className="signin-main">
        <section className="signin-unavailable container" aria-labelledby="signup-title">
          <span className="signin-unavailable-icon"><UserRound size={24} /></span>
          <span className="section-tag">STAY EASE ACCOUNT</span>
          <h1 id="signup-title">Customer accounts aren't available yet.</h1>
          <p>The current Stay Ease website does not have a customer registration service, so an account cannot be created here yet.</p>
          <div><Link className="btn-signup" to="/sign-in">Back to Sign In</Link><Link className="signin-contact-link" to="/contact">Contact Us</Link></div>
        </section>
      </main>
      <AboutFooter />
    </div>
  );
}
