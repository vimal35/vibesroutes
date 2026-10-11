// src/pages/Home.jsx

import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';

import {
  Building2, MapPin, CalendarDays, Search, ChevronDown, Users,
  ShieldCheck, Wifi, Headphones, Wallet, Plane, Phone,
  Mail, MapPin as Pin, Globe, CreditCard, Sparkles, ArrowRight, ArrowUpRight,
  Bell, Ticket, Banknote, Quote, Clock,
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

const LOCATION_REDIRECT = {
  Pondicherry: 'Pondicherry',
  Bangalore: 'Bangalore',
  Kerala: 'Munnar',
  Goa: 'Pondicherry',
  Ooty: 'Ooty',
  Coimbatore: 'Coimbatore',
  Munnar: 'Munnar',
  Hyderabad: 'Hyderabad',
};

const destinations = [
  {
    city: 'Pondicherry',
    country: 'Tamil Nadu',
    img: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=900&q=80',
    hotels: 15,
    deals: 6,
    start: 2800,
  },
  {
    city: 'Bangalore',
    country: 'Karnataka',
    img: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=900&q=80',
    hotels: 15,
    deals: 8,
    start: 4200,
    tall: true,
  },
  {
    city: 'Kerala',
    country: 'God’s Own Country',
    img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=900&q=80',
    hotels: 15,
    deals: 7,
    start: 3200,
  },
  {
    city: 'Goa',
    country: 'West Coast',
    img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=80',
    hotels: 18,
    deals: 9,
    start: 4500,
  },
  {
    city: 'Ooty',
    country: 'Tamil Nadu',
    img: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=900&q=80',
    hotels: 15,
    deals: 5,
    start: 3000,
  },
  {
    city: 'Coimbatore',
    country: 'Tamil Nadu',
    img: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=900&q=80',
    hotels: 15,
    deals: 4,
    start: 2400,
  },
];

const steps = [
  {
    title: 'Search & Discover',
    desc: 'Tell us where you want to go. Browse hotels, resorts and villas across Pondicherry, Kerala, Goa, Ooty, Coimbatore and Bangalore.',
    dur: 'Less than 1 minute',
    img: 'https://images.pexels.com/photos/7368269/pexels-photo-7368269.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: Search,
  },
  {
    title: 'Compare & Book',
    desc: 'Filter by price, rating, free cancellation and amenities. Compare the best deals side-by-side and instantly confirm your stay.',
    dur: 'Instant confirmation',
    img: 'https://images.pexels.com/photos/7368277/pexels-photo-7368277.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: CreditCard,
  },
  {
    title: 'Travel & Enjoy',
    desc: 'Get your e-voucher instantly. Enjoy easy check-in, concierge support and flexible cancellation right from your phone.',
    dur: 'Enjoy your trip',
    img: 'https://images.pexels.com/photos/7368290/pexels-photo-7368290.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: Plane,
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
  {
    name: 'Vivanta Coimbatore',
    city: 'Coimbatore',
    country: 'Tamil Nadu',
    img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfe4c?auto=format&fit=crop&w=900&q=80',
    price: 6800,
    rating: 8.9,
    reviews: 1884,
    amenities: ['City Centre', 'Pool', 'Wi-Fi', 'Breakfast'],
    badge: 'Great Value',
  },
];

const offers = [
  {
    tag: 'Flash Sale • 40% OFF',
    title: 'Early Summer Escapes',
    desc: 'Book beachfront and hill-station stays and save up to 40% at top-rated resorts.',
    img: 'https://images.pexels.com/photos/29766360/pexels-photo-29766360.jpeg?auto=compress&cs=tinysrgb&w=900',
    btn: 'Grab the deal',
  },
  {
    tag: 'Members Only',
    title: 'Book + Save Extra 15%',
    desc: 'Sign up to StayEase Pro and unlock exclusive member prices on every booking.',
    img: 'https://images.pexels.com/photos/5577693/pexels-photo-5577693.jpeg?auto=compress&cs=tinysrgb&w=900',
    btn: 'Join for free',
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

const footerLinks = {
  company: ['About Us', 'Careers', 'Press & Media', 'Partner Program', 'Sustainability'],
  products: ['Hotels & Resorts', 'Villas & Apartments', 'Flight + Hotel', 'Group Booking', 'StayEase Business'],
  help: ['Help Center', 'Contact Support', 'Cancellation Policy', 'Privacy Policy', 'Terms & Conditions'],
};

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

  const [scrolled, setScrolled] = useState(false);
  const [openField, setOpenField] = useState(null);
  const [location, setLocation] = useState(SEARCH_LOCATIONS[0].city);
  const [checkIn, setCheckIn] = useState(() => startOfDay(3));
  const [checkOut, setCheckOut] = useState(() => startOfDay(6));
  const [adults, setAdults] = useState(2);
  const [kids, setKids] = useState(0);
  const [rooms, setRooms] = useState(1);
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

    const mapped = LOCATION_REDIRECT[cityName] || cityName;

    const params = new URLSearchParams();
    if (mapped && mapped !== ALL_LOCATIONS) params.set('location', mapped);
    params.set('checkIn', toISODate(start));
    params.set('checkOut', toISODate(end));
    params.set('adults', String(Math.min(adults, 6)));
    params.set('rooms', String(Math.min(rooms, 4)));

    navigate({ pathname: HOTEL_LIST_PATH, search: `?${params.toString()}` });
  };

  const handleSearch = () => goToHotels(location);

  return (
    <>
      <header className={`header ${scrolled || menuOpen ? 'scrolled' : ''}`}>
        <div className="container header-inner">
          <Link to="/" className="brand">
            <div className="logo-badge">
              <Building2 size={22} />
            </div>
            Stay<em>Ease</em>
          </Link>

          <nav className="nav-links">
            <a href="#home" className="active">Home</a>
            <a href="#hotels">Hotels</a>
            <a href="#contact">Contact</a>
            <Link to={HOTEL_LIST_PATH}>Hotel List</Link>
          </nav>

          <div className="header-actions">
            <Link to="/AdminPanel" className="btn-login">Admin Panel</Link>
            <button className="btn-signup">Become a partner</button>
            <button className="hamburger" onClick={() => setMenuOpen((o) => !o)} aria-label="Menu">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                {menuOpen ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
              </svg>
            </button>
          </div>
        </div>
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

        <div className="scroll-hint">
          <div className="mouse" />
          Scroll to explore
        </div>
      </section>

      <section className="section" id="destinations">
        <div className="container">
          <div className="section-head">
            <span className="section-tag">Explore South India</span>
            <h2 className="section-title">Popular Destinations <span className="hl">By Locale</span></h2>
            <p className="section-desc">
              Handpicked cities loved by our travelers, with real-time hotel availability and exclusive local deals.
            </p>
          </div>

          <div className="dest-grid dest-grid-six">
            {destinations.map((d) => (
              <button
                key={d.city}
                className={`dest-card ${d.tall ? 'tall' : ''}`}
                onClick={() => goToHotels(d.city)}
              >
                <img src={d.img} alt={d.city} />
                <div className="overlay" />
                <div className="info">
                  <div className="city">
                    {d.city}
                    <span className="arrow"><ArrowUpRight size={18} /></span>
                  </div>
                  <div className="country">{d.country}</div>
                  <div className="meta">
                    <span><b>{d.hotels}</b> stays</span>
                    <span><b>{d.deals}</b> deals</span>
                    <span>from <b>₹{d.start.toLocaleString('en-IN')}</b></span>
                  </div>
                </div>
              </button>
            ))}
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
                <div className="step-img">
                  <img src={s.img} alt={s.title} />
                  <div className="step-num">0{i + 1}</div>
                </div>
                <div className="step-body">
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                  <div className="step-dur"><Clock size={15} /> {s.dur}</div>
                  <div className="step-link">Learn more <ArrowRight size={15} /></div>
                </div>
              </div>
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
                  <img src={h.img} alt={h.name} />
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
            <span className="section-tag">Limited Time</span>
            <h2 className="section-title">Deals & <span className="hl">Special Offers</span></h2>
            <p className="section-desc">Save big with seasonal promotions, member-exclusive rates and flash deals.</p>
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
                  <button className="obtn" onClick={handleSearch}>{o.btn}</button>
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

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="cta-zone">
            <div>
              <span className="section-tag" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}>
                Take us everywhere
              </span>
              <h2>Your Entire Trip, In Your Pocket</h2>
              <p>Book, manage, check-in and get live concierge support from the StayEase app.</p>
              <div className="cta-badges">
                <a className="store-badge">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                  <div><div className="st-small">Download on the</div><div className="st-big">App Store</div></div>
                </a>
                <a className="store-badge">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M3 20.5v-17c0-.59.34-1.11.84-1.35L13.69 12 3.84 21.85c-.5-.25-.84-.76-.84-1.35zm13.81-5.38L6.05 21.34l8.49-8.49 2.27 2.27zm3.35-4.31c.34.27.59.69.61 1.19s-.24.94-.6 1.2l-2.27 1.31-2.5-2.5 2.5-2.5 2.26 1.3zM6.05 2.66l10.76 6.22-2.27 2.27L6.05 2.66z"/></svg>
                  <div><div className="st-small">Get it on</div><div className="st-big">Google Play</div></div>
                </a>
              </div>
            </div>
            <div className="cta-mock">
              <div className="phone">
                <div className="phone-screen">
                  <img src="https://images.pexels.com/photos/23696832/pexels-photo-23696832.jpeg?auto=compress&cs=tinysrgb&w=500" alt="App" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0, paddingBottom: 70 }}>
        <div className="container">
          <div className="newsletter">
            <div>
              <h3>Get Travel Deals First ✈️</h3>
              <p>Subscribe for exclusive offers, member rates and week-ahead price alerts.</p>
            </div>
            <form className="news-form" onSubmit={(e) => { e.preventDefault(); alert('Subscribed! Watch your inbox for deals.'); }}>
              <input type="email" placeholder="Enter your email address" required />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>
      </section>

      <footer className="footer" id="contact">
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="brand">
                <div className="logo-badge"><Building2 size={22} /></div>
                Stay<em>Ease</em>
              </div>
              <p className="footer-about">
                StayEase connects travelers to verified properties with best-price guarantees, instant confirmation and 24/7 support.
              </p>
              <div className="footer-social">
                <a href="#" aria-label="Facebook"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M13 10h3l.5-3H13V5.5c0-.9.3-1.5 1.6-1.5H17V1.2C16.6 1.1 15.6 1 14.6 1 12 1 10.3 2.5 10.3 5.2V7H7v3h3.3v9H13v-9z"/></svg></a>
                <a href="#" aria-label="Instagram"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg></a>
                <a href="#" aria-label="Twitter"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22 5.9c-.7.3-1.5.5-2.3.6.8-.5 1.4-1.3 1.7-2.2-.8.5-1.7.8-2.6 1a4 4 0 0 0-6.9 3.6A11.4 11.4 0 0 1 3.8 4.6a4 4 0 0 0 1.2 5.3c-.6 0-1.2-.2-1.7-.5v.1a4 4 0 0 0 3.2 3.9c-.6.2-1.2.2-1.8.1a4 4 0 0 0 3.7 2.8A8 8 0 0 1 2 18.6a11.3 11.3 0 0 0 6.1 1.8c7.4 0 11.4-6.1 11.4-11.4v-.5c.8-.6 1.5-1.3 2-2.2z"/></svg></a>
              </div>
            </div>

            <div>
              <h5>Company</h5>
              <ul className="footer-links">
                {footerLinks.company.map((l) => <li key={l}><a href="#">{l}</a></li>)}
              </ul>
            </div>

            <div>
              <h5>Explore</h5>
              <ul className="footer-links">
                {footerLinks.products.map((l) => <li key={l}><a href="#">{l}</a></li>)}
              </ul>
            </div>

            <div>
              <h5>Get in Touch</h5>
              <ul className="footer-contact">
                <li><Phone size={16} /> +91 80055 50199</li>
                <li><Mail size={16} /> support@stayease.com</li>
                <li><Pin size={16} /> 100 Harbor Point, Suite 500<br />Bengaluru, India</li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} StayEase Travel Ltd. All rights reserved.</span>
            <div className="pay">
              We accept
              <span className="pay-chip">VISA</span>
              <span className="pay-chip">Mastercard</span>
              <span className="pay-chip">UPI</span>
              <span className="pay-chip">PayPal</span>
            </div>
          </div>
        </div>
      </footer>
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
