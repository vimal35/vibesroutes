// src/pages/Home.jsx

import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AboutFooter } from './About';
import './Home.css';

import {
  Building2, MapPin, CalendarDays, Search, ChevronDown, Users,
  ShieldCheck, Headphones, Wallet, Plane,
  Globe, CreditCard, Sparkles, ArrowRight,
  Bell, Ticket, Banknote, Quote, Clock, UserRound, MessageCircle,
} from 'lucide-react';

const HOTEL_LIST_PATH = '/HotelList';
const ALL_LOCATIONS = 'All locations';

const SEARCH_LOCATIONS = [
  { city: 'Pondicherry', state: 'Tamil Nadu', stays: 15 },
  { city: 'Munnar', state: 'Kerala', stays: 15 },
  { city: 'Ooty', state: 'Tamil Nadu', stays: 15 },
  { city: 'Coimbatore', state: 'Tamil Nadu', stays: 15 },
  { city: 'Bangalore', state: 'Karnataka', stays: 15 },
  { city: 'Hyderabad', state: 'Telangana', stays: 15 },
];

const HOME_DESTINATIONS = [
  { city: 'Pondicherry', state: 'Tamil Nadu', hotels: 15, image: 'https://commons.wikimedia.org/wiki/Special:FilePath/French%20Quarter%20in%20Pondicherry%20%285%29%20%2823662220798%29.jpg?width=960' },
  { city: 'Munnar', state: 'Kerala', hotels: 15, image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Tea%20Estate%20in%20Munnar.jpg?width=960' },
  { city: 'Ooty', state: 'Tamil Nadu', hotels: 15, image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ooty%20Th%C3%A9%20Plantation.JPG?width=960' },
  { city: 'Coimbatore', state: 'Tamil Nadu', hotels: 15, image: 'https://r2imghtlak.mmtcdn.com/r2-mmt-htl-image/htl-imgs/201111221336068199-2f814bec41e211e7be9702755708f0b3.jpg' },
  { city: 'Bangalore', state: 'Karnataka', hotels: 15, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80' },
  { city: 'Hyderabad', state: 'Telangana', hotels: 15, image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Panoramic%20View%20of%20the%20Charminar%2C%20Hyderabad.jpg?width=960' },
];

const steps = [
  {
    title: 'Search & Discover',
    desc: 'Tell us where you want to go. Browse hotels, resorts and villas across Pondicherry, Kerala, Goa, Ooty, Coimbatore and Bangalore.',
    dur: 'Less than 1 minute',
    img: 'https://images.pexels.com/photos/7368269/pexels-photo-7368269.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: Search,
    to: '/explore-destinations',
    linkLabel: 'Explore destinations',
  },
  {
    title: 'Compare & Book',
    desc: 'Filter by price, rating, free cancellation and amenities. Compare the best deals side-by-side and instantly confirm your stay.',
    dur: 'Instant confirmation',
    img: 'https://images.pexels.com/photos/7368277/pexels-photo-7368277.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: CreditCard,
    to: HOTEL_LIST_PATH,
    linkLabel: 'Browse hotels',
  },
  {
    title: 'Travel & Enjoy',
    desc: 'Get your e-voucher instantly. Enjoy easy check-in, concierge support and flexible cancellation right from your phone.',
    dur: 'Enjoy your trip',
    img: 'https://images.pexels.com/photos/7368290/pexels-photo-7368290.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: Plane,
    to: '/contact',
    linkLabel: 'Contact support',
  },
];

const hotels = [
  {
    name: 'Palais de Mahe',
    city: 'Pondicherry',
    country: 'Tamil Nadu',
    img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80',
    price: 12500,
    rating: 9.4,
    reviews: 1842,
    amenities: ['Heritage Stay', 'Pool', 'Free Cancellation', 'Breakfast'],
    badge: 'Heritage',
  },
  {
    name: 'The Leela Palace Bengaluru',
    city: 'Bangalore',
    country: 'Karnataka',
    img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80',
    price: 18900,
    rating: 9.6,
    reviews: 3210,
    amenities: ['Luxury Palace', 'Spa', 'Pool', 'Breakfast'],
    badge: 'Luxury',
  },
  {
    name: 'Vivanta Coimbatore',
    city: 'Coimbatore',
    country: 'Tamil Nadu',
    img: 'https://r2imghtlak.mmtcdn.com/r2-mmt-htl-image/htl-imgs/201111221336068199-2f814bec41e211e7be9702755708f0b3.jpg',
    price: 6800,
    rating: 8.9,
    reviews: 1884,
    amenities: ['City Centre', 'Pool', 'Wi-Fi', 'Breakfast'],
    badge: 'Great Value',
  },
  {
    name: 'Taj Madikeri Resort & Spa',
    city: 'Kerala',
    country: 'Coorg',
    img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=900&q=80',
    price: 16400,
    rating: 9.3,
    reviews: 1568,
    amenities: ['Mountain View', 'Spa', 'Villa', 'Breakfast'],
    badge: 'Featured',
  },
  {
    name: 'Taj Fort Aguada Resort & Spa',
    city: 'Goa',
    country: 'West Coast',
    img: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=900&q=80',
    price: 17800,
    rating: 9.5,
    reviews: 2744,
    amenities: ['Beachfront', 'Infinity Pool', 'Spa', 'Breakfast'],
    badge: 'Hot Deal',
  },
  {
    name: 'Savoy – IHCL SeleQtions',
    city: 'Ooty',
    country: 'Tamil Nadu',
    img: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=900&q=80',
    price: 11200,
    rating: 9.1,
    reviews: 1296,
    amenities: ['Colonial Heritage', 'Garden', 'Fireplace', 'Breakfast'],
    badge: 'Trending',
  },
];

const offers = [
  {
    tag: 'Flash Sale • 40% OFF',
    title: 'Early Summer Escapes',
    desc: 'Book beachfront and hill-station stays and save up to 40% at top-rated resorts.',
    img: 'https://images.pexels.com/photos/29766360/pexels-photo-29766360.jpeg?auto=compress&cs=tinysrgb&w=900',
    btn: 'Grab the Deal',
    source: 'deal',
  },
  {
    tag: 'Members Only',
    title: 'Book + Save Extra 15%',
    desc: 'Sign up to StayEase Pro and unlock exclusive member prices on every booking.',
    img: 'https://images.pexels.com/photos/5577693/pexels-photo-5577693.jpeg?auto=compress&cs=tinysrgb&w=900',
    btn: 'Join for Free',
    source: 'join',
  },
];

const features = [
  { icon: ShieldCheck, title: 'Secure Booking', desc: '256-bit encryption & bank-grade payment protection on every reservation.' },
  { icon: Wallet, title: 'Best Price Promise', desc: 'Found it cheaper? We refund the difference — guaranteed within 24 hours.' },
  { icon: Headphones, title: '24/7 Concierge', desc: 'Real humans on the phone & chat, any time zone, any language. Always.' },
  { icon: Bell, title: 'Free Cancellation', desc: 'Flexible plans on most properties with zero-fee cancellation windows.' },
  { icon: Ticket, title: 'Instant Vouchers', desc: 'Your e-confirmation arrives in seconds — no waiting, no paper.' },
  { icon: Banknote, title: 'Earn Rewards', desc: 'Collect StayEase Points on every night and redeem them for free stays.' },
  { icon: Globe, title: 'Top Destinations', desc: 'Pondicherry, Bangalore, Kerala, Goa, Ooty and Coimbatore in one place.' },
  { icon: Sparkles, title: 'Curated Picks', desc: 'Handpicked, inspected and verified stays so you never book a surprise.' },
];

const testimonials = [
  {
    text: 'Booking with StayEase felt effortless. The trip planner mapped our whole Kerala escape in minutes and the price beat every other site.',
    name: 'Sofia Martinez',
    role: 'Travel Blogger',
    initials: 'SM',
  },
  {
    text: 'I travel 20+ weeks a year for work. The guest filters, instant confirmation and reward points make this my only booking app now.',
    name: 'James Carter',
    role: 'Consultant',
    initials: 'JC',
  },
  {
    text: 'The free cancellation saved us when our plans changed last minute. Their support team fixed everything within one call. Exceptional.',
    name: 'Amelia Wong',
    role: 'Family Traveler',
    initials: 'AW',
  },
];

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DOW = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function startOfDay(offsetDays = 0) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + offsetDays);
  return d;
}

function isSameDay(a, b) {
  return (
    !!a &&
    !!b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function toISODate(d) {
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}

function fromISODate(value) {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function formatDate(d) {
  if (!d) return 'Add date';
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function diffDays(a, b) {
  if (!a || !b) return 0;
  return Math.round((b - a) / 86400000);
}

function MonthGrid({ offset, selected, setSelected }) {
  const now = new Date();
  const base = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const year = base.getFullYear();
  const month = base.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = startOfDay(0);

  const cells = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ];

  return (
    <div>
      <div className="cal-title">{MONTHS[month]} {year}</div>
      <div className="cal-grid">
        {DOW.map((d) => <div key={d} className="dow">{d}</div>)}
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;
          const disabled = d < today;
          const isSelected = selected.some((s) => isSameDay(s, d));
          const cls = [
            'cal-day',
            disabled ? 'disabled' : '',
            isSelected ? 'selected' : '',
          ].join(' ').trim();

          return (
            <div
              key={i}
              className={cls}
              onClick={() => !disabled && setSelected(d)}
            >
              {d.getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [scrolled, setScrolled] = useState(false);
  const [openField, setOpenField] = useState(null);
  const [location, setLocation] = useState(SEARCH_LOCATIONS[0].city);
  const [checkIn, setCheckIn] = useState(() => startOfDay(3));
  const [checkOut, setCheckOut] = useState(() => startOfDay(6));
  const [adults, setAdults] = useState(2);
  const [kids, setKids] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [quickDestination, setQuickDestination] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest('.search-field')) setOpenField(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selectedDates = useMemo(
    () => [checkIn, checkOut].filter(Boolean),
    [checkIn, checkOut],
  );

  const handleDateClick = (d) => {
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(d);
      setCheckOut(null);
    } else if (d > checkIn) {
      setCheckOut(d);
    } else {
      setCheckIn(d);
    }
  };

  const nights = diffDays(checkIn, checkOut);
  const totalGuests = adults + kids;

  const selectedLocation = SEARCH_LOCATIONS.find((l) => l.city === location);
  const locationLabel = selectedLocation
    ? `${selectedLocation.city}, ${selectedLocation.state}`
    : 'All South India';

  const goToHotels = (cityName = location) => {
    setOpenField(null);

    const start = checkIn || startOfDay(1);
    let end = checkOut;
    if (!end || end <= start) {
      end = new Date(start);
      end.setDate(end.getDate() + 1);
    }

    const matchedCity = SEARCH_LOCATIONS.find((item) => item.city.toLowerCase() === String(cityName || '').trim().toLowerCase())?.city;
    const params = new URLSearchParams();
    if (matchedCity) {
      params.set('location', matchedCity);
    } else if (cityName && cityName !== ALL_LOCATIONS) {
      params.set('query', String(cityName).trim());
    }
    params.set('checkIn', toISODate(start));
    params.set('checkOut', toISODate(end));
    params.set('adults', String(Math.min(adults, 6)));
    params.set('children', String(Math.min(kids, 6)));
    params.set('rooms', String(Math.min(rooms, 4)));

    navigate({ pathname: HOTEL_LIST_PATH, search: `?${params.toString()}` });
  };

  const handleSearch = () => goToHotels(location);
  const handleQuickSearch = (event) => {
    event.preventDefault();
    goToHotels(quickDestination.trim() || location);
  };
  return (
    <>
      <header className={`header ${scrolled || menuOpen ? 'scrolled' : ''}`}>
        <div className="container header-inner">
          <Link to="/" className="brand">
            <div className="logo-badge">
              <Building2 size={22} />
            </div>
            <span className="brand-name">Stay<em>Ease</em></span>
          </Link>

          <nav className="nav-links" aria-label="Main navigation">
            <a href="#home" className="active">Home</a>
            <Link to="/about">About Us</Link>
            <Link to="/explore-destinations">Explore Destinations</Link>
            <Link to={HOTEL_LIST_PATH}>Hotels</Link>
            <Link to="/contact">Contact Us</Link>
          </nav>

          <div className="header-actions">
            <Link to="/list-your-property" className="btn-signup property-cta">List your property</Link>
            <Link to="/sign-in" className="btn-login sign-in-link"><UserRound size={16} aria-hidden="true" /> <span>Sign In</span></Link>
            <Link to="/AdminPanel" className="btn-login admin-panel-link">Admin Panel</Link>
            <button
              className="hamburger"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                {menuOpen ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
              </svg>
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav className="mobile-nav" id="mobile-navigation" aria-label="Mobile navigation">
            <a href="#home" onClick={() => setMenuOpen(false)}>Home</a>
            <Link to="/about" onClick={() => setMenuOpen(false)}>About Us</Link>
            <Link to="/explore-destinations" onClick={() => setMenuOpen(false)}>Explore Destinations</Link>
            <Link to={HOTEL_LIST_PATH} onClick={() => setMenuOpen(false)}>Hotels</Link>
            <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact Us</Link>
            <Link to="/sign-in" className="mobile-signin-link" onClick={() => setMenuOpen(false)}><UserRound size={16} aria-hidden="true" /> Sign In</Link>
            <Link to="/AdminPanel" className="mobile-admin-link" onClick={() => setMenuOpen(false)}>Admin Panel</Link>
          </nav>
        )}
      </header>

      <section className="hero" id="home">
        <div className="container hero-content">
          <span className="hero-eyebrow">
            <span className="dot" /> Trusted stays across South India
          </span>
          <h1>Discover, Book & Enjoy <span className="accent">Dream Stays</span> Nearby</h1>
          <p className="sub">
            Compare hotels, resorts and villas in Pondicherry, Bangalore, Kerala, Goa, Ooty and Coimbatore.
            Best price guaranteed, instant confirmation and free cancellation.
          </p>

          <div className="hero-trust">
            <div className="trust-item"><span className="num">90<span>+</span></span><span className="lbl">Listed Properties</span></div>
            <div className="trust-item"><span className="num">6</span><span className="lbl">Top Destinations</span></div>
            <div className="trust-item"><span className="num">4.9<span>★</span></span><span className="lbl">Average Rating</span></div>
            <div className="trust-item"><span className="num">24/7</span><span className="lbl">Guest Support</span></div>
          </div>

          <div className="search-wrap">
            <div className="search-bar">
              <div
                className={`search-field ${openField === 'location' ? 'open' : ''}`}
                onClick={() => setOpenField(openField === 'location' ? null : 'location')}
              >
                <div className="field-icon"><MapPin size={20} /></div>
                <div className="field-body">
                  <div className="field-label">Location</div>
                  <div className="field-value">{locationLabel}</div>
                </div>
                <ChevronDown className="chev" size={18} />
                {openField === 'location' && (
                  <div className="search-dropdown" onClick={(e) => e.stopPropagation()}>
                    <div
                      className="dropdown-city"
                      style={location === ALL_LOCATIONS ? { background: '#eef4ff' } : undefined}
                      onClick={() => { setLocation(ALL_LOCATIONS); setOpenField(null); }}
                    >
                      <div className="flag" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Globe size={16} />
                      </div>
                      <div>
                        <div className="cname">All South India</div>
                        <div className="cinfo">{SEARCH_LOCATIONS.length} destinations · {SEARCH_LOCATIONS.length * 15} stays</div>
                      </div>
                    </div>

                    {SEARCH_LOCATIONS.map((c) => (
                      <div
                        key={c.city}
                        className="dropdown-city"
                        style={location === c.city ? { background: '#eef4ff' } : undefined}
                        onClick={() => { setLocation(c.city); setOpenField(null); }}
                      >
                        <div className="flag" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <MapPin size={16} />
                        </div>
                        <div>
                          <div className="cname">{c.city}</div>
                          <div className="cinfo">{c.state} · {c.stays} stays</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div
                className={`search-field ${openField === 'date' ? 'open' : ''}`}
                onClick={() => setOpenField(openField === 'date' ? null : 'date')}
              >
                <div className="field-icon"><CalendarDays size={20} /></div>
                <div className="field-body">
                  <div className="field-label">Check-in — Check-out</div>
                  <div className="field-value">
                    {formatDate(checkIn)} {checkOut && `→ ${formatDate(checkOut)}`} {nights > 0 && ` · ${nights}n`}
                  </div>
                </div>
                <ChevronDown className="chev" size={18} />
                {openField === 'date' && (
                  <div className="date-pop" onClick={(e) => e.stopPropagation()}>
                    <div className="date-months">
                      <MonthGrid offset={0} selected={selectedDates} setSelected={handleDateClick} />
                      <MonthGrid offset={1} selected={selectedDates} setSelected={handleDateClick} />
                    </div>
                    <div className="cal-foot">
                      <span>Add your travel dates for exact pricing</span>
                      <button
                        style={{ color: 'var(--blue)', fontWeight: 700 }}
                        onClick={() => setOpenField(null)}
                      >
                        Apply ✓
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div
                className={`search-field ${openField === 'guests' ? 'open' : ''}`}
                onClick={() => setOpenField(openField === 'guests' ? null : 'guests')}
              >
                <div className="field-icon"><Users size={20} /></div>
                <div className="field-body">
                  <div className="field-label">Guests & Rooms</div>
                  <div className="field-value">
                    {totalGuests} {totalGuests === 1 ? 'Guest' : 'Guests'} · {rooms} Room{rooms > 1 ? 's' : ''}
                  </div>
                </div>
                <ChevronDown className="chev" size={18} />
                {openField === 'guests' && (
                  <div className="guests-pop" onClick={(e) => e.stopPropagation()}>
                    <div className="guests-row">
                      <div className="guests-info"><div className="g-title">Adults</div><div className="g-sub">Age 13+</div></div>
                      <div className="stepper">
                        <button disabled={adults <= 1} onClick={() => setAdults((a) => a - 1)}>−</button>
                        <span className="val">{adults}</span>
                        <button disabled={adults >= 6} onClick={() => setAdults((a) => a + 1)}>+</button>
                      </div>
                    </div>
                    <div className="guests-row">
                      <div className="guests-info"><div className="g-title">Children</div><div className="g-sub">Age 0–12</div></div>
                      <div className="stepper">
                        <button disabled={kids <= 0} onClick={() => setKids((k) => k - 1)}>−</button>
                        <span className="val">{kids}</span>
                        <button onClick={() => setKids((k) => k + 1)}>+</button>
                      </div>
                    </div>
                    <div className="guests-row">
                      <div className="guests-info"><div className="g-title">Rooms</div><div className="g-sub">Max 4 rooms</div></div>
                      <div className="stepper">
                        <button disabled={rooms <= 1} onClick={() => setRooms((r) => r - 1)}>−</button>
                        <span className="val">{rooms}</span>
                        <button disabled={rooms >= 4} onClick={() => setRooms((r) => r + 1)}>+</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button className="search-btn" onClick={handleSearch}>
                <Search size={20} /> Search
              </button>
            </div>
          </div>
        </div>

      </section>

      <section className="trip-zone" id="planner">
        <div className="container">
          <div className="section-head">
            <span className="section-tag" style={{ background: 'rgba(255,184,77,0.15)', color: 'var(--gold)' }}>
              Plan Smarter
            </span>
            <h2 className="section-title">Quick & Easy <span style={{ color: 'var(--gold-2)' }}>Trip Planner</span></h2>
            <p className="section-desc">Three effortless steps between "I need a holiday" and the perfect doorstep.</p>
          </div>

          <div className="trip-steps">
            {steps.map((s, i) => (
              <div className="step-card" key={s.title}>
                <Link className="step-img-link" to={s.to} aria-label={`${s.linkLabel}: ${s.title}`}>
                  <div className="step-img">
                    <img src={s.img} alt="" />
                    <div className="step-num">0{i + 1}</div>
                  </div>
                </Link>
                <div className="step-body">
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                  <div className="step-dur"><Clock size={15} /> {s.dur}</div>
                  <Link className="step-link" to={s.to}>{s.linkLabel} <ArrowRight size={15} /></Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section home-destinations-section" aria-labelledby="home-destinations-title">
        <div className="container">
          <div className="section-head">
            <span className="section-tag">Find your next stay</span>
            <h2 className="section-title" id="home-destinations-title">Explore by <span className="hl">destination</span></h2>
            <p className="section-desc">Browse stays in popular destinations and find the right place for your trip.</p>
          </div>
          <div className="home-destinations-grid">
            {HOME_DESTINATIONS.map((destination) => (
              <Link className="home-destination-card" key={destination.city} to={`${HOTEL_LIST_PATH}?location=${encodeURIComponent(destination.city)}`}>
                <img src={destination.image} alt={`${destination.city}, ${destination.state}`} loading="lazy" decoding="async" />
                <span className="home-destination-count">{destination.hotels} hotels</span>
                <div className="home-destination-overlay" />
                <div className="home-destination-info">
                  <span>{destination.state}</span>
                  <h3>{destination.city}</h3>
                  <span className="home-destination-link">Explore stays <ArrowRight size={15} /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="hotels">
        <div className="container">
          <div className="section-head">
            <span className="section-tag">Top Rated</span>
            <h2 className="section-title">Trending <span className="hl">Stays for You</span></h2>
            <p className="section-desc">
              Original, highly rated properties with exceptional guest reviews and unbeatable member rates.
            </p>
          </div>

          <div className="hotels-grid">
            {hotels.map((h) => (
              <article className="hotel-card" key={h.name}>
                <div className="hotel-img">
                  <img
                    src={h.img}
                    alt={h.name}
                    onError={h.city === 'Coimbatore' ? (event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = hotels[1].img;
                    } : undefined}
                  />
                  <span className="hotel-badge">{h.badge}</span>
                  <div className="hotel-fav"><HeartIcon /></div>
                </div>
                <div className="hotel-body">
                  <div className="hotel-top">
                    <div>
                      <div className="hotel-name">{h.name}</div>
                      <div className="hotel-loc">
                        <MapPin size={13} /> {h.city}, {h.country}
                      </div>
                    </div>
                    <div className="hotel-score">
                      <span className="score">{h.rating}</span>
                      <span className="reviews">{h.reviews.toLocaleString('en-IN')} reviews</span>
                    </div>
                  </div>
                  <div className="hotel-amenities">
                    {h.amenities.map((a) => <span className="amen" key={a}>{a}</span>)}
                  </div>
                  <div className="hotel-foot">
                    <div className="hotel-price">
                      <div className="from">per night</div>
                      <div className="price">₹{h.price.toLocaleString('en-IN')} <small>INR</small></div>
                    </div>
                    <button className="btn-ghost" onClick={() => goToHotels(h.city)}>
                      View Deal
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="offers" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head">
            <span className="section-tag">Exclusive Offers</span>
            <h2 className="section-title">Exclusive <span className="hl">Deals</span></h2>
            <p className="section-desc">Explore member-only savings, seasonal escapes, and limited-time offers for your next stay.</p>
          </div>

          <div className="offers-grid">
            {offers.map((o) => (
              <div className="offer-card" key={o.title}>
                <img src={o.img} alt={o.title} />
                <div className="ove" />
                <div className="odiv">
                  <span className="otag">{o.tag}</span>
                  <h3>{o.title}</h3>
                  <p>{o.desc}</p>
                  <Link className="obtn" to={`/customer-enquiry?source=${o.source}&offer=${encodeURIComponent(o.title)}`}>{o.btn}</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head">
            <span className="section-tag">Why StayEase</span>
            <h2 className="section-title">Book With <span className="hl">Total Confidence</span></h2>
            <p className="section-desc">From security to savings, every booking comes loaded with benefits designed to protect you.</p>
          </div>

          <div className="why-us">
            <div className="features-grid">
              {features.map((f) => (
                <div className="feature" key={f.title}>
                  <div className="ficon"><f.icon size={30} /></div>
                  <h4>{f.title}</h4>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head">
            <span className="section-tag">Loved Worldwide</span>
            <h2 className="section-title">What Our <span className="hl">Travelers Say</span></h2>
            <p className="section-desc">Travelers trust us with their journeys every single year.</p>
          </div>

          <div className="testi-grid">
            {testimonials.map((t) => (
              <div className="testi-card" key={t.name}>
                <span className="quote-mark"><Quote /></span>
                <div className="testi-stars">★★★★★</div>
                <p className="testi-text">"{t.text}"</p>
                <div className="testi-user">
                  <div className="avatar">{t.initials}</div>
                  <div>
                    <div className="uname">{t.name}</div>
                    <div className="urole">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-search-cta-section" aria-labelledby="home-search-cta-title">
        <div className="container">
          <div className="home-search-cta">
            <div className="home-search-cta-copy">
              <span className="section-tag">Stay Ease</span>
              <h2 id="home-search-cta-title">What’s on your mind?</h2>
              <p>Find your next stay across South India.</p>
            </div>
            <form className="home-quick-search" onSubmit={handleQuickSearch}>
              <label className="home-quick-search-input" htmlFor="home-quick-destination">
                <MapPin size={19} aria-hidden="true" />
                <input id="home-quick-destination" type="search" list="home-quick-destinations" placeholder="Where to?" value={quickDestination} onChange={(event) => setQuickDestination(event.target.value)} />
                <datalist id="home-quick-destinations">{SEARCH_LOCATIONS.map((item) => <option key={item.city} value={item.city} />)}</datalist>
              </label>
              <label className="home-quick-date" htmlFor="home-quick-checkin"><span>Check-in</span><input id="home-quick-checkin" type="date" min={toISODate(startOfDay())} value={checkIn ? toISODate(checkIn) : ''} onChange={(event) => { const date = fromISODate(event.target.value); setCheckIn(date); if (date && checkOut && checkOut <= date) { const next = new Date(date); next.setDate(next.getDate() + 1); setCheckOut(next); } }} /></label>
              <label className="home-quick-date" htmlFor="home-quick-checkout"><span>Check-out</span><input id="home-quick-checkout" type="date" min={checkIn ? toISODate(new Date(checkIn.getFullYear(), checkIn.getMonth(), checkIn.getDate() + 1)) : toISODate(startOfDay(1))} value={checkOut ? toISODate(checkOut) : ''} onChange={(event) => setCheckOut(fromISODate(event.target.value))} /></label>
              <label className="home-quick-guests" htmlFor="home-quick-guests"><Users size={17} aria-hidden="true" /><select id="home-quick-guests" value={Math.min(totalGuests, 6)} onChange={(event) => { setAdults(Number(event.target.value)); setKids(0); }}>{[1, 2, 3, 4, 5, 6].map((count) => <option key={count} value={count}>{count} {count === 1 ? 'Guest' : 'Guests'}</option>)}</select></label>
              <label className="home-quick-rooms" htmlFor="home-quick-rooms"><select id="home-quick-rooms" aria-label="Rooms" value={rooms} onChange={(event) => setRooms(Number(event.target.value))}>{[1, 2, 3, 4].map((count) => <option key={count} value={count}>{count} {count === 1 ? 'Room' : 'Rooms'}</option>)}</select></label>
              <button className="home-quick-search-button" type="submit"><Search size={17} /> Search</button>
              <a className="home-whatsapp-cta" href="https://wa.me/918005550199?text=Hi%20Stay%20Ease%2C%20I%20need%20help%20planning%20a%20stay." target="_blank" rel="noopener noreferrer" aria-label="Chat with Stay Ease on WhatsApp">
                <MessageCircle size={19} aria-hidden="true" /> <span>Chat on WhatsApp</span>
              </a>
            </form>
          </div>
        </div>
      </section>

      <AboutFooter activePage="home" />
    </>
  );
}

function HeartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}
