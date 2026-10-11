import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Eye, Target, ArrowRight, Phone, Mail, MapPin } from 'lucide-react';
import './Home.css';
import './About.css';

const HOTEL_LIST_PATH = '/HotelList';

const aboutImages = [
  {
    city: 'Ooty', region: 'Tamil Nadu',
    img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ooty%20Th%C3%A9%20Plantation.JPG?width=1200',
    source: 'https://commons.wikimedia.org/wiki/File:Ooty_Th%C3%A9_Plantation.JPG', credit: 'Harrieta171', license: 'CC BY-SA',
  },
  {
    city: 'Munnar', region: 'Kerala',
    img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Tea%20Estate%20in%20Munnar.jpg?width=1200',
    source: 'https://commons.wikimedia.org/wiki/File:Tea_Estate_in_Munnar.jpg', credit: 'Kps', license: 'Public domain',
  },
  {
    city: 'Alleppey', region: 'Kerala',
    img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Alleppey_backwaters.1.jpg?width=1200',
    source: 'https://commons.wikimedia.org/wiki/File:Alleppey_backwaters.1.jpg', credit: 'Sravanbaddi', license: 'CC BY-SA 4.0',
  },
  {
    city: 'Mysuru', region: 'Karnataka',
    img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mysore%20palace%20front%20view%20001.jpg?width=1200',
    source: 'https://commons.wikimedia.org/wiki/File:Mysore_palace_front_view_001.jpg', credit: 'Rijin S', license: 'CC BY-SA 4.0',
  },
];

function AboutFooter() {
  return (
    <footer className="footer" id="contact">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link to="/" className="brand">
              <div className="logo-badge"><Building2 size={22} /></div>
              <span className="brand-name">Stay<em>Ease</em></span>
            </Link>
            <p className="footer-about">StayEase connects travelers to verified properties with best-price guarantees, instant confirmation and 24/7 support.</p>
            <div className="footer-social">
              <a href="#" aria-label="Facebook"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M13 10h3l.5-3H13V5.5c0-.9.3-1.5 1.6-1.5H17V1.2C16.6 1.1 15.6 1 14.6 1 12 1 10.3 2.5 10.3 5.2V7H7v3h3.3v9H13v-9z" /></svg></a>
              <a href="#" aria-label="Instagram"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg></a>
              <a href="#" aria-label="Twitter"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22 5.9c-.7.3-1.5.5-2.3.6.8-.5 1.4-1.3 1.7-2.2-.8.5-1.7.8-2.6 1a4 4 0 0 0-6.9 3.6A11.4 11.4 0 0 1 3.8 4.6a4 4 0 0 0 1.2 5.3c-.6 0-1.2-.2-1.7-.5v.1a4 4 0 0 0 3.2 3.9c-.6.2-1.2.2-1.8.1a4 4 0 0 0 3.7 2.8A8 8 0 0 1 2 18.6a11.3 11.3 0 0 0 6.1 1.8c7.4 0 11.4-6.1 11.4-11.4v-.5c.8-.6 1.5-1.3 2-2.2z" /></svg></a>
            </div>
          </div>
          <div>
            <h5>Company</h5>
            <ul className="footer-links">
              <li><Link to="/about" aria-current="page">About Us</Link></li>
              <li><a href="#">Careers</a></li><li><a href="#">Press &amp; Media</a></li>
              <li><a href="#">Partner Program</a></li><li><a href="#">Sustainability</a></li>
            </ul>
          </div>
          <div>
            <h5>Explore</h5>
            <ul className="footer-links">
              <li><Link to={HOTEL_LIST_PATH}>Hotels &amp; Resorts</Link></li>
              <li><Link to={HOTEL_LIST_PATH}>Villas &amp; Apartments</Link></li>
              <li><a href="#">Flight + Hotel</a></li><li><a href="#">Group Booking</a></li>
              <li><a href="#">StayEase Business</a></li>
            </ul>
          </div>
          <div>
            <h5>Get in Touch</h5>
            <ul className="footer-contact">
              <li><Phone size={16} /> +91 80055 50199</li>
              <li><Mail size={16} /> support@stayease.com</li>
              <li><MapPin size={16} /> 100 Harbor Point, Suite 500<br />Bengaluru, India</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} StayEase Travel Ltd. All rights reserved.</span>
          <div className="pay">We accept <span className="pay-chip">VISA</span><span className="pay-chip">Mastercard</span><span className="pay-chip">UPI</span><span className="pay-chip">PayPal</span></div>
        </div>
      </div>
    </footer>
  );
}

export default function About() {
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timer = window.setInterval(() => setImageIndex((current) => (current + 1) % aboutImages.length), 4500);
    return () => window.clearInterval(timer);
  }, []);

  const image = aboutImages[imageIndex];

  return (
    <div className="about-page">
      <header className="header scrolled">
        <div className="container header-inner">
          <Link to="/" className="brand"><div className="logo-badge"><Building2 size={22} /></div><span className="brand-name">Stay<em>Ease</em></span></Link>
          <nav className="nav-links" aria-label="Main navigation">
            <Link to="/">Home</Link><Link to="/about" className="active" aria-current="page">About Us</Link>
            <Link to="/#destinations">Explore Destinations</Link><Link to="/#contact">Contact Us</Link><Link to={HOTEL_LIST_PATH}>Hotel List</Link>
          </nav>
          <div className="header-actions">
            <Link to={HOTEL_LIST_PATH} className="btn-signup property-cta">List your property</Link>
            <Link to="/AdminPanel" className="btn-login admin-panel-link">Admin Panel</Link>
          </div>
        </div>
      </header>

      <main className="about-page-main">
        <section className="about-page-intro container" aria-labelledby="about-title">
          <span className="section-tag">A better way to get away</span>
          <h1 id="about-title">About <span className="hl">StayEase</span></h1>
          <p>We make it easier to find a stay that feels right for your journey.</p>
        </section>

        <section className="about-page-story container" aria-label="Our story">
          <div className="about-page-copy">
            <span className="about-page-kicker">Travel, made simpler</span>
            <h2>Make room for the moments that matter.</h2>
            <p>Every memorable trip begins with a place that feels right. StayEase helps travelers discover destinations, explore available stays, and compare the details that matter when choosing where to stay.</p>
            <p>From a quiet escape in the hills to a lively city break, we bring the discovery journey together in one place. Browse with confidence, find a stay that suits your plans, and spend more time looking forward to the trip ahead.</p>
            <Link to={HOTEL_LIST_PATH} className="btn-signup about-page-cta">Explore stays <ArrowRight size={17} /></Link>
          </div>
          <div className="about-visual about-page-visual">
            <img key={image.city} src={image.img} alt={`${image.city}, ${image.region}`} decoding="async" />
            <div className="about-visual-caption"><span className="about-visual-label">Explore South India</span><strong>{image.city}</strong><span>{image.region}</span></div>
            <div className="about-photo-credit"><a href={image.source} target="_blank" rel="noreferrer">Photo: {image.credit}</a><span aria-hidden="true"> | </span><a href={image.source} target="_blank" rel="noreferrer">{image.license}</a></div>
            <div className="about-image-dots" aria-label="Choose a destination image">
              {aboutImages.map((item, index) => <button key={item.city} type="button" className={index === imageIndex ? 'active' : ''} aria-label={`Show ${item.city} photo`} aria-pressed={index === imageIndex} onClick={() => setImageIndex(index)} />)}
            </div>
          </div>
        </section>

        <section className="about-page-values container" aria-label="Our vision and mission">
          <article className="about-value"><Eye size={30} aria-hidden="true" /><h2>Our Vision</h2><p>Make it easier for travelers to discover stays that feel right for every kind of trip.</p></article>
          <article className="about-value"><Target size={30} aria-hidden="true" /><h2>Our Mission</h2><p>Bring destination discovery, useful stay details, and a clear booking journey together in one place.</p></article>
        </section>

        <section className="about-page-approach container">
          <span className="section-tag">Thoughtful by design</span>
          <h2>A clear path from inspiration to check-in.</h2>
          <p>Start with a destination, compare the stays available, and choose the option that works for you. StayEase keeps the experience focused on the details travelers need to plan their next stay.</p>
        </section>
      </main>
      <AboutFooter />
    </div>
  );
}
