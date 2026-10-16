import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { BrandMark, BrandName } from "../components/BrandLogo";
import {
  Eye,
  Target,
  ArrowRight,
  Mail,
  Heart,
  Compass,
  RefreshCw,
  UserRound,
  X,
} from "lucide-react";
import "./Home.css";
import "./About.css";

const HOTEL_LIST_PATH = "/HotelList";

const aboutImages = [
  {
    city: "Ooty",
    region: "Tamil Nadu",
    img: "https://commons.wikimedia.org/wiki/Special:FilePath/Ooty%20Th%C3%A9%20Plantation.JPG?width=1200",
    source:
      "https://commons.wikimedia.org/wiki/File:Ooty_Th%C3%A9_Plantation.JPG",
    credit: "Harrieta171",
    license: "CC BY-SA",
  },
  {
    city: "Munnar",
    region: "Kerala",
    img: "https://commons.wikimedia.org/wiki/Special:FilePath/Tea%20Estate%20in%20Munnar.jpg?width=1200",
    source: "https://commons.wikimedia.org/wiki/File:Tea_Estate_in_Munnar.jpg",
    credit: "Kps",
    license: "Public domain",
  },
  {
    city: "Alleppey",
    region: "Kerala",
    img: "https://commons.wikimedia.org/wiki/Special:FilePath/Alleppey_backwaters.1.jpg?width=1200",
    source: "https://commons.wikimedia.org/wiki/File:Alleppey_backwaters.1.jpg",
    credit: "Sravanbaddi",
    license: "CC BY-SA 4.0",
  },
  {
    city: "Mysuru",
    region: "Karnataka",
    img: "https://commons.wikimedia.org/wiki/Special:FilePath/Mysore%20palace%20front%20view%20001.jpg?width=1200",
    source:
      "https://commons.wikimedia.org/wiki/File:Mysore_palace_front_view_001.jpg",
    credit: "Rijin S",
    license: "CC BY-SA 4.0",
  },
];

export function AboutFooter({ activePage = "about" }) {
  return (
    <footer className="footer" id="contact">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand-column">
            <Link to="/" className="brand footer-brand">
              <BrandMark />
              <BrandName />
            </Link>
            <p className="footer-about">
              Follow the feeling that brought you here. Explore South Indian
              destinations, compare stay details, and find a route that feels
              like your own.
            </p>
          </div>
          <div>
            <h5>NEED A HAND?</h5>
            <ul className="footer-contact">
              <li>
                <span>Questions about a stay or the website? Get in touch.</span>
              </li>
              <li>
                <Mail size={17} />
                <a href="mailto:support@vibezroutes.com">support@vibezroutes.com</a>
              </li>
            </ul>
          </div>
          <div>
            <h5>EXPLORE</h5>
            <ul className="footer-links">
              <li>
                <Link
                  to="/"
                  aria-current={activePage === "home" ? "page" : undefined}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  aria-current={activePage === "about" ? "page" : undefined}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/explore-destinations"
                  aria-current={
                    activePage === "destinations" ? "page" : undefined
                  }
                >
                  Explore Destinations
                </Link>
              </li>
              <li>
                <Link
                  to={HOTEL_LIST_PATH}
                  aria-current={activePage === "hotels" ? "page" : undefined}
                >
                  Hotels
                </Link>
              </li>
              <li>
                <Link to="/list-your-property">List Your Property</Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  aria-current={activePage === "contact" ? "page" : undefined}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h5>DESTINATION IDEAS</h5>
            <ul className="footer-links">
              <li><Link to="/explore-destinations">Explore destinations</Link></li>
              <li><Link to={`${HOTEL_LIST_PATH}?location=${encodeURIComponent("Munnar")}`}>Munnar</Link></li>
              <li><Link to={`${HOTEL_LIST_PATH}?location=${encodeURIComponent("Ooty")}`}>Ooty</Link></li>
              <li><Link to={`${HOTEL_LIST_PATH}?location=${encodeURIComponent("Pondicherry")}`}>Puducherry</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-credit-wrap">
            <span className="footer-credit">
              Designed and developed by{" "}
              <a
                href="https://adlinkwebservices.in/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Adlink web services
              </a>{" "}
              <span aria-hidden="true">/</span>{" "}
              <Link to="/AdminPanel">Admin Panel</Link>{" "}
            </span>
            <AuthPromptButton />
          </div>
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

export function AuthPromptButton() {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const trigger = triggerRef.current;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      trigger?.focus();
    };
  }, [isOpen]);

  const closeDialog = () => setIsOpen(false);

  return (
    <div className="auth-menu-wrap">
      <button
        ref={triggerRef}
        type="button"
        className="auth-menu-trigger"
        onClick={() => setIsOpen((open) => !open)}
        aria-label="Log in or sign up"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <UserRound size={16} aria-hidden="true" />
      </button>
      {isOpen && (
        <div
          className="auth-dialog-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeDialog();
          }}
        >
          <section
            className="auth-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-dialog-title"
          >
            <button
              ref={closeRef}
              className="auth-dialog-close"
              type="button"
              onClick={closeDialog}
              aria-label="Close login options"
            >
              <X size={18} />
            </button>
            <Link
              to="/"
              className="brand auth-dialog-brand"
              onClick={closeDialog}
            >
              <BrandMark />
              <BrandName />
            </Link>
            <h2 id="auth-dialog-title">Welcome to VibezRoutes</h2>
            <p>Log in or create an account to continue.</p>
            <div className="auth-dialog-choices">
              <Link
                to="/sign-in"
                className="auth-dialog-choice"
                onClick={closeDialog}
              >
                Log in
              </Link>
              <Link
                to="/sign-up"
                className="auth-dialog-choice"
                onClick={closeDialog}
              >
                Sign up
              </Link>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export function SitePageHeader({ activePage }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef(null);
  const aboutLinkClass = activePage === "about" ? "active" : "";

  // Publish the header's real height so pages with sticky bars can sit below it.
  useLayoutEffect(() => {
    const header = headerRef.current;
    if (!header?.querySelector(".header-inner")) return undefined;

    // Measure the bar itself, not the whole header, so opening the mobile menu
    // does not push the page down.
    const bar = header.querySelector(".header-inner");
    const update = () => {
      const style = getComputedStyle(header);
      const height =
        bar.offsetHeight + parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
      document.documentElement.style.setProperty("--site-header-h", `${Math.round(height)}px`);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(bar);

    return () => observer.disconnect();
  }, []);
  const destinationsLinkClass = activePage === "destinations" ? "active" : "";

  return (
    <header
      ref={headerRef}
      className={`header scrolled ${menuOpen ? "menu-open" : ""}`}
    >
      <div className="container header-inner">
        <Link to="/" className="brand">
          <BrandMark />
          <BrandName />
        </Link>
        <nav className="nav-links" aria-label="Main navigation">
          <Link to="/">Home</Link>
          <Link
            to="/about"
            className={aboutLinkClass}
            aria-current={activePage === "about" ? "page" : undefined}
          >
            About Us
          </Link>
          <Link
            to="/explore-destinations"
            className={destinationsLinkClass}
            aria-current={activePage === "destinations" ? "page" : undefined}
          >
            Explore Destinations
          </Link>
          <Link
            to={HOTEL_LIST_PATH}
            className={activePage === "hotels" ? "active" : ""}
            aria-current={activePage === "hotels" ? "page" : undefined}
          >
            Hotels
          </Link>
          <Link
            to="/contact"
            className={activePage === "contact" ? "active" : ""}
            aria-current={activePage === "contact" ? "page" : undefined}
          >
            Contact Us
          </Link>
        </nav>
        <div className="header-actions">
          <Link to="/list-your-property" className="btn-signup property-cta">
            List your property
          </Link>
          <button
            className="hamburger"
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="page-mobile-navigation"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
            >
              {menuOpen ? (
                <path d="M6 6l12 12M6 18L18 6" />
              ) : (
                <path d="M3 6h18M3 12h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav
          className="mobile-nav"
          id="page-mobile-navigation"
          aria-label="Mobile navigation"
        >
          <Link to="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>
            About Us
          </Link>
          <Link to="/explore-destinations" onClick={() => setMenuOpen(false)}>
            Explore Destinations
          </Link>
          <Link to={HOTEL_LIST_PATH} onClick={() => setMenuOpen(false)}>
            Hotels
          </Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>
            Contact Us
          </Link>
          <Link to="/sign-in" onClick={() => setMenuOpen(false)}>
            <UserRound size={16} aria-hidden="true" /> Sign In
          </Link>
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

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return undefined;
    const timer = window.setInterval(
      () => setImageIndex((current) => (current + 1) % aboutImages.length),
      1600,
    );
    return () => window.clearInterval(timer);
  }, []);

  const image = aboutImages[imageIndex];

  return (
    <div className="about-page">
      <SitePageHeader activePage="about" />

      <main className="about-page-main">
        <section
          className="about-page-intro container"
          aria-labelledby="about-title"
        >
          <span className="section-tag">Find your vibe. Follow your route.</span>
          <h1 id="about-title">
            About <span className="hl">VibezRoutes</span>
          </h1>
          <p>
            Travel is personal: the place, the pace, and the stay all shape how
            a journey feels. VibezRoutes brings destination discovery and stay
            options together so you can explore what suits you.
          </p>
        </section>

        <section className="about-page-story container" aria-label="Our story">
          <div className="about-page-copy">
            <span className="about-page-kicker">Our story and purpose</span>
            <h2>A route should feel like yours</h2>
            <p>
              A trip can begin with a feeling: a few quiet days in the hills, a
              new city to wander, or time by the water. The stay is part of
              that picture, not just a box to tick along the way.
            </p>
            <p>
              VibezRoutes is built around that connection between destination,
              personal travel style, and a comfortable place to pause. We bring
              travel inspiration and accommodation information into one place
              to make it easier to explore possibilities and compare what is
              available.
            </p>
            <p>
              Our purpose is to make the search feel less scattered, so
              travelers can spend more time considering where they want to go
              and what kind of stay fits their plans.
            </p>
            <Link to={HOTEL_LIST_PATH} className="btn-signup about-page-cta">
              Explore stays <ArrowRight size={17} />
            </Link>
          </div>
          <div className="about-visual about-page-visual">
            <img
              key={image.city}
              src={image.img}
              alt={`${image.city}, ${image.region}`}
              decoding="async"
            />
            <div className="about-visual-caption">
              <span className="about-visual-label">Explore South India</span>
              <strong>{image.city}</strong>
              <span>{image.region}</span>
            </div>
            <div className="about-photo-credit">
              <a href={image.source} target="_blank" rel="noreferrer">
                Photo: {image.credit}
              </a>
              <span aria-hidden="true"> | </span>
              <a href={image.source} target="_blank" rel="noreferrer">
                {image.license}
              </a>
            </div>
            <div
              className="about-image-dots"
              aria-label="Choose a destination image"
            >
              {aboutImages.map((item, index) => (
                <button
                  key={item.city}
                  type="button"
                  className={index === imageIndex ? "active" : ""}
                  aria-label={`Show ${item.city} photo`}
                  aria-pressed={index === imageIndex}
                  onClick={() => setImageIndex(index)}
                />
              ))}
            </div>
          </div>
        </section>

        <section
          className="about-page-values container"
          aria-label="Our vision and mission"
        >
          <article className="about-value">
            <Eye size={30} aria-hidden="true" />
            <span className="about-value-label">Our Vision</span>
            <h2>Make room for more ways to travel</h2>
            <p>
              Our vision is a more inviting way to explore travel: one that
              makes different destinations and kinds of stays easier to
              discover, compare, and imagine as part of a journey.
            </p>
            <blockquote>
              “Find your vibe. Follow your route.”
            </blockquote>
          </article>
          <article className="about-value">
            <Target size={30} aria-hidden="true" />
            <span className="about-value-label">Our Mission</span>
            <h2>Turn travel ideas into clear next steps</h2>
            <p>
              Our mission is to make discovering destinations and exploring
              accommodation options easier through useful information,
              straightforward browsing, and ways to ask questions when needed.
            </p>
            <p>
              We want each step—from finding inspiration to reviewing a stay—to
              feel clear, considered, and centered on the traveler’s own plans.
            </p>
          </article>
        </section>

        <section className="about-page-approach container">
          <span className="section-tag">Our approach</span>
          <h2>Explore first. Choose at your pace.</h2>
          <p>
            Start with a place, a travel mood, or the details that matter to
            you. Explore destination ideas, review accommodation information,
            and use the available enquiry forms to take a next step.
          </p>
          <p>
            Our values are clarity, curiosity, and respect for different ways
            of traveling. We aim to make useful information easier to navigate
            without making the choice for you.
          </p>
          <h3>What matters to us</h3>
          <div className="about-principles">
            <article>
              <Heart size={23} aria-hidden="true" />
              <h4>Travel on your terms</h4>
              <p>Make space for different budgets, plans, and travel styles.</p>
            </article>
            <article>
              <Target size={23} aria-hidden="true" />
              <h4>Clear information</h4>
              <p>Help travelers review the details before choosing what to do.</p>
            </article>
            <article>
              <Compass size={23} aria-hidden="true" />
              <h4>Stay curious</h4>
              <p>
                Encourage discovery beyond the places you already know.
              </p>
            </article>
            <article>
              <RefreshCw size={23} aria-hidden="true" />
              <h4>Thoughtful progress</h4>
              <p>Keep making the stay-discovery journey better.</p>
            </article>
          </div>
        </section>
      </main>
      <AboutFooter />
    </div>
  );
}
