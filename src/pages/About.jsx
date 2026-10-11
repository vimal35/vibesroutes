import { useEffect, useLayoutEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Eye, Target, ArrowRight, Phone, Mail, MapPin, Heart, Compass, RefreshCw, UserRound } from 'lucide-react';
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

export function AboutFooter({ activePage = 'about' }) {
  return (
    <footer className="footer" id="contact">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand-column">
            <Link to="/" className="brand footer-brand">
              <span className="logo-badge"><Building2 size={22} /></span>
              <span className="brand-name">Stay<em>Ease</em></span>
            </Link>
            <p className="footer-about">Stay Ease makes it easier to discover welcoming hotels, villas, and resorts across South India, helping you find a stay that fits your journey.</p>
          </div>
          <div>
            <h5>GET IN TOUCH</h5>
            <ul className="footer-contact">
              <li><MapPin size={17} /><span>100 Harbor Point, Suite 500<br />Bengaluru, India</span></li>
              <li><Mail size={17} /><a href="mailto:support@stayease.com">support@stayease.com</a></li>
              <li><Phone size={17} /><a href="tel:+918005550199">+91 80055 50199</a></li>
            </ul>
          </div>
          <div>
            <h5>EXPLORE</h5>
            <ul className="footer-links">
              <li><Link to="/" aria-current={activePage === 'home' ? 'page' : undefined}>Home</Link></li>
              <li><Link to="/about" aria-current={activePage === 'about' ? 'page' : undefined}>About</Link></li>
              <li><Link to="/explore-destinations" aria-current={activePage === 'destinations' ? 'page' : undefined}>Explore Destinations</Link></li>
              <li><Link to={HOTEL_LIST_PATH}>Hotels</Link></li>
              <li><Link to="/list-your-property">List Your Property</Link></li>
              <li><Link to="/contact" aria-current={activePage === 'contact' ? 'page' : undefined}>Contact</Link></li>
            </ul>
          </div>
          <div>
            <h5>OFFICE TIME</h5>
            <p className="footer-hours">Operating Hours:<br /><strong>24/7 Monday to Sunday</strong></p>
            <div className="footer-social" aria-label="Social media">
              <a href="#" aria-label="Facebook"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M13 10h3l.5-3H13V5.5c0-.9.3-1.5 1.6-1.5H17V1.2C16.6 1.1 15.6 1 14.6 1 12 1 10.3 2.5 10.3 5.2V7H7v3h3.3v9H13v-9z" /></svg></a>
              <a href="#" aria-label="Instagram"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg></a>
              <a href="#" aria-label="X"><svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 1.2h3.7l-8.1 9.2L24 22.8h-7.4l-5.8-7.6-6.6 7.6H.5l8.6-9.8L0 1.2h7.6l5.2 6.9 6.1-6.9Zm-1.3 19.7h2L6.5 3.1H4.3l13.3 17.8Z" /></svg></a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span className="footer-credit">Designed and developed by <a href="https://adlinkwebservices.in/" target="_blank" rel="noopener noreferrer">Adlink web services</a> <span aria-hidden="true">/</span> <Link to="/AdminPanel">Admin Panel</Link></span>
          <nav className="footer-policy-links" aria-label="Policies">
            <Link to="/refund-policy">Refund Policy</Link>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-and-conditions">Terms &amp; Conditions</Link>
            <Link to="/cancellation-policy">Cancellation Policy</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

export function SitePageHeader({ activePage }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const aboutLinkClass = activePage === 'about' ? 'active' : '';
  const destinationsLinkClass = activePage === 'destinations' ? 'active' : '';

  return (
    <header className={`header scrolled ${menuOpen ? 'menu-open' : ''}`}>
      <div className="container header-inner">
        <Link to="/" className="brand"><div className="logo-badge"><Building2 size={22} /></div><span className="brand-name">Stay<em>Ease</em></span></Link>
        <nav className="nav-links" aria-label="Main navigation">
          <Link to="/">Home</Link>
          <Link to="/about" className={aboutLinkClass} aria-current={activePage === 'about' ? 'page' : undefined}>About Us</Link>
          <Link to="/explore-destinations" className={destinationsLinkClass} aria-current={activePage === 'destinations' ? 'page' : undefined}>Explore Destinations</Link>
          <Link to={HOTEL_LIST_PATH}>Hotels</Link>
          <Link to="/contact" className={activePage === 'contact' ? 'active' : ''} aria-current={activePage === 'contact' ? 'page' : undefined}>Contact Us</Link>
        </nav>
        <div className="header-actions">
          <Link to="/list-your-property" className="btn-signup property-cta">List your property</Link>
          <Link to="/sign-in" className="btn-login sign-in-link" aria-current={activePage === 'sign-in' ? 'page' : undefined}><UserRound size={16} aria-hidden="true" /> <span>Sign In</span></Link>
          <Link to="/AdminPanel" className="btn-login admin-panel-link">Admin Panel</Link>
          <button className="hamburger" type="button" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="page-mobile-navigation">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
              {menuOpen ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
            </svg>
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav className="mobile-nav" id="page-mobile-navigation" aria-label="Mobile navigation">
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>About Us</Link>
          <Link to="/explore-destinations" onClick={() => setMenuOpen(false)}>Explore Destinations</Link>
          <Link to={HOTEL_LIST_PATH} onClick={() => setMenuOpen(false)}>Hotels</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact Us</Link>
          <Link to="/sign-in" onClick={() => setMenuOpen(false)}><UserRound size={16} aria-hidden="true" /> Sign In</Link>
          <Link to="/AdminPanel" className="mobile-admin-link" onClick={() => setMenuOpen(false)}>Admin Panel</Link>
        </nav>
      )}
    </header>
  );
}

export default function About() {
  const [imageIndex, setImageIndex] = useState(0);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    aboutImages.forEach(({ img }) => {
      const preload = new Image();
      preload.src = img;
    });

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timer = window.setInterval(() => setImageIndex((current) => (current + 1) % aboutImages.length), 4500);
    return () => window.clearInterval(timer);
  }, []);

  const image = aboutImages[imageIndex];

  return (
    <div className="about-page">
      <SitePageHeader activePage="about" />

      <main className="about-page-main">
        <section className="about-page-intro container" aria-labelledby="about-title">
          <span className="section-tag">A better way to get away</span>
          <h1 id="about-title">About <span className="hl">Stay Ease</span></h1>
          <p>Every journey deserves a comfortable stay. Discover places that feel right for your journey, from peaceful hill retreats and coastal escapes to vibrant city stays across South India.</p>
        </section>

        <section className="about-page-story container" aria-label="Our story">
          <div className="about-page-copy">
            <span className="about-page-kicker">Travel, made simpler</span>
            <h2>Where every journey finds its stay</h2>
            <p>Travel is about more than reaching a destination. It is about the moments along the way, the places you discover, and the comfort of having somewhere to unwind. Stay Ease is built around making the search for your next stay simpler, clearer, and more convenient.</p>
            <p>From mist-covered hill stations and tranquil backwaters to lively cities and relaxing coastal getaways, we bring destination inspiration and stay discovery together in one place. Whether you are planning a quick weekend escape, a family holiday, a romantic getaway, or a business trip, Stay Ease helps you explore your options and find a stay that fits your plans.</p>
            <p>Our goal is simple: make discovering your next stay feel just as enjoyable as the journey itself.</p>
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
          <article className="about-value">
            <Eye size={30} aria-hidden="true" />
            <span className="about-value-label">Our Vision</span>
            <h2>Making every journey easier to imagine and plan</h2>
            <p>Our vision is to make travel and stay discovery more accessible, intuitive, and inspiring. We aspire to help travelers explore new destinations with confidence, discover places that match their preferences, and spend less time searching and more time looking forward to the journey ahead.</p>
            <blockquote>“Every great journey begins with finding the right place to stay.”</blockquote>
          </article>
          <article className="about-value">
            <Target size={30} aria-hidden="true" />
            <span className="about-value-label">Our Mission</span>
            <h2>Bringing travelers and the right stays closer together</h2>
            <p>Our mission is to create a seamless stay-discovery experience through thoughtful design, useful information, and a convenient booking journey. We aim to help travelers compare their options, explore destinations, and make informed decisions based on their needs and preferences.</p>
            <p>By keeping convenience, clarity, and the traveler experience at the heart of what we do, Stay Ease strives to make planning a stay feel straightforward, welcoming, and reliable.</p>
          </article>
        </section>

        <section className="about-page-approach container">
          <span className="section-tag">Thoughtful by design</span>
          <h2>Built around better stay experiences</h2>
          <p>Stay Ease is designed with a simple idea in mind: finding a place to stay should be easier than ever. We bring together destination discovery and accommodation exploration in an experience that helps travelers move from inspiration to planning with greater ease.</p>
          <p>Our approach focuses on thoughtful technology, accessible information, and a traveler-first experience. As the platform grows, our focus remains on helping people discover places worth visiting and stays that suit the way they travel.</p>
          <h3>What guides us</h3>
          <div className="about-principles">
            <article><Heart size={23} aria-hidden="true" /><h4>Traveler first</h4><p>Design the experience around real travel needs.</p></article>
            <article><Target size={23} aria-hidden="true" /><h4>Clarity and convenience</h4><p>Make exploring stay options straightforward.</p></article>
            <article><Compass size={23} aria-hidden="true" /><h4>Discover more</h4><p>Help travelers find destinations and experiences worth exploring.</p></article>
            <article><RefreshCw size={23} aria-hidden="true" /><h4>Continuous improvement</h4><p>Keep making the stay-discovery journey better.</p></article>
          </div>
        </section>
      </main>
      <AboutFooter />
    </div>
  );
}
