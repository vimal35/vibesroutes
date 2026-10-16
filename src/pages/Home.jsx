// src/pages/Home.jsx

import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AboutFooter } from "./About";
import { BrandMark, BrandName } from "../components/BrandLogo";
import "./Home.css";

import {
  MapPin,
  CalendarDays,
  Search,
  ChevronDown,
  Users,
  ShieldCheck,
  Headphones,
  Wallet,
  Plane,
  Globe,
  CreditCard,
  Sparkles,
  ArrowRight,
  Bell,
  Ticket,
  Banknote,
  Clock,
  UserRound,
  MessageCircle,
} from "lucide-react";

const HOTEL_LIST_PATH = "/HotelList";
const ALL_LOCATIONS = "All locations";

const SEARCH_LOCATIONS = [
  { city: "Pondicherry", state: "Tamil Nadu", stays: 15 },
  { city: "Munnar", state: "Kerala", stays: 17 },
  { city: "Ooty", state: "Tamil Nadu", stays: 15 },
  { city: "Coimbatore", state: "Tamil Nadu", stays: 15 },
  { city: "Bangalore", state: "Karnataka", stays: 15 },
  { city: "Hyderabad", state: "Telangana", stays: 15 },
];

const HOME_DESTINATIONS = [
  {
    city: "Pondicherry",
    state: "Tamil Nadu",
    hotels: 15,
    description: "Seaside promenades and colorful heritage lanes.",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/French%20Quarter%20in%20Pondicherry%20%285%29%20%2823662220798%29.jpg?width=960",
  },
  {
    city: "Munnar",
    state: "Kerala",
    hotels: 17,
    description: "Tea-covered hills and cool mountain air.",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Tea%20Estate%20in%20Munnar.jpg?width=960",
  },
  {
    city: "Ooty",
    state: "Tamil Nadu",
    hotels: 15,
    description: "Highland gardens, winding roads, and misty views.",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Ooty%20Th%C3%A9%20Plantation.JPG?width=960",
  },
  {
    city: "Coimbatore",
    state: "Tamil Nadu",
    hotels: 15,
    description: "A lively city with the Western Ghats nearby.",
    image:
      "https://r2imghtlak.mmtcdn.com/r2-mmt-htl-image/htl-imgs/201111221336068199-2f814bec41e211e7be9702755708f0b3.jpg",
  },
  {
    city: "Bangalore",
    state: "Karnataka",
    hotels: 15,
    description: "Garden spaces, local cafés, and city energy.",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
  },
  {
    city: "Hyderabad",
    state: "Telangana",
    hotels: 15,
    description: "Historic landmarks and a vibrant food scene.",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Panoramic%20View%20of%20the%20Charminar%2C%20Hyderabad.jpg?width=960",
  },
];

const steps = [
  {
    title: "Pick a place",
    desc: "Start with a destination that fits your mood, from quiet hill towns and backwaters to lively city streets.",
    dur: "Explore destinations",
    img: "https://images.pexels.com/photos/7368269/pexels-photo-7368269.jpeg?auto=compress&cs=tinysrgb&w=800",
    icon: Search,
    to: "/explore-destinations",
    linkLabel: "Find a destination",
  },
  {
    title: "Explore stays",
    desc: "Browse accommodation details, locations, amenities, and listed prices as you shape your plans.",
    dur: "Compare your options",
    img: "https://images.pexels.com/photos/7368277/pexels-photo-7368277.jpeg?auto=compress&cs=tinysrgb&w=800",
    icon: CreditCard,
    to: HOTEL_LIST_PATH,
    linkLabel: "Browse stays",
  },
  {
    title: "Make your next move",
    desc: "Have a question about your plans or a property? Send an enquiry and share what you need to know.",
    dur: "Take the next step",
    img: "https://images.pexels.com/photos/7368290/pexels-photo-7368290.jpeg?auto=compress&cs=tinysrgb&w=800",
    icon: Plane,
    to: "/contact",
    linkLabel: "Send an enquiry",
  },
];

const hotels = [
  {
    name: "Palais de Mahe",
    city: "Pondicherry",
    country: "Tamil Nadu",
    img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80",
    price: 12500,
    amenities: ["Heritage Stay", "Pool", "Breakfast"],
    badge: "Heritage",
    description: "A heritage-style stay for an unhurried Puducherry escape.",
  },
  {
    name: "The Leela Palace Bengaluru",
    city: "Bangalore",
    country: "Karnataka",
    img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
    price: 18900,
    amenities: ["Luxury Palace", "Spa", "Pool", "Breakfast"],
    badge: "Luxury",
    description: "A city retreat for a change of pace in Bengaluru.",
  },
  {
    name: "Vivanta Coimbatore",
    city: "Coimbatore",
    country: "Tamil Nadu",
    img: "https://r2imghtlak.mmtcdn.com/r2-mmt-htl-image/htl-imgs/201111221336068199-2f814bec41e211e7be9702755708f0b3.jpg",
    price: 6800,
    amenities: ["City Centre", "Pool", "Wi-Fi", "Breakfast"],
    badge: "City stay",
    description: "A convenient city base for exploring Coimbatore.",
  },
  {
    name: "Taj Madikeri Resort & Spa",
    city: "Coorg",
    country: "Karnataka",
    img: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=900&q=80",
    price: 16400,
    amenities: ["Mountain View", "Spa", "Villa", "Breakfast"],
    badge: "Hill retreat",
    description: "A green hillside setting for a slower Coorg getaway.",
  },
  {
    name: "Taj Fort Aguada Resort & Spa",
    city: "Goa",
    country: "West Coast",
    img: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=900&q=80",
    price: 17800,
    amenities: ["Beachfront", "Infinity Pool", "Spa", "Breakfast"],
    badge: "Coastal stay",
    description: "A coastal backdrop for days by the Arabian Sea.",
  },
  {
    name: "Savoy – IHCL SeleQtions",
    city: "Ooty",
    country: "Tamil Nadu",
    img: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=900&q=80",
    price: 11200,
    amenities: ["Colonial Heritage", "Garden", "Fireplace", "Breakfast"],
    badge: "Heritage",
    description: "A heritage-inspired stay among Ooty’s cool highlands.",
  },
];

const offers = [
  {
    tag: "TRAVEL INSPIRATION",
    title: "A change of scenery",
    desc: "Browse coastal stays and cool-climate escapes, then explore the details that fit your plans.",
    img: "https://images.pexels.com/photos/29766360/pexels-photo-29766360.jpeg?auto=compress&cs=tinysrgb&w=900",
    btn: "Explore stays",
    source: "coastal-and-hills",
  },
  {
    tag: "PLAN YOUR WAY",
    title: "Start with what matters",
    desc: "Share your destination, dates, and questions in a travel enquiry to get the conversation started.",
    img: "https://images.pexels.com/photos/5577693/pexels-photo-5577693.jpeg?auto=compress&cs=tinysrgb&w=900",
    btn: "Plan a trip",
    source: "trip-planning",
  },
];

const features = [
  {
    icon: ShieldCheck,
    title: "Search by your plans",
    desc: "Choose a destination, dates, and group size to explore matching stays.",
  },
  {
    icon: Wallet,
    title: "Compare stay details",
    desc: "Review listed prices, locations, and amenities as you consider your options.",
  },
  {
    icon: Headphones,
    title: "Ask a question",
    desc: "Use the contact form to get in touch about your plans or the website.",
  },
  {
    icon: Bell,
    title: "Discover destinations",
    desc: "Explore city, coast, and hill-station ideas across South India.",
  },
  {
    icon: Ticket,
    title: "Save places to revisit",
    desc: "Keep hotel options in your browser wishlist while you continue browsing.",
  },
  {
    icon: Banknote,
    title: "Enquire about a stay",
    desc: "Share your travel preferences through the customer enquiry form.",
  },
  {
    icon: Globe,
    title: "A range of travel moods",
    desc: "Find ideas for a slower break, a coastal trip, or a few days in the city.",
  },
  {
    icon: Sparkles,
    title: "Property enquiries",
    desc: "Property owners can use the listing enquiry form to share details with the team.",
  },
];

const travelMoods = [
  {
    text: "Take the scenic route: tea-covered slopes, misty mornings, and time to slow down.",
    name: "Hill country",
    role: "For a quieter escape",
    initials: "H",
  },
  {
    text: "Follow the water through palm-lined canals, lakeside villages, and unhurried afternoons.",
    name: "Backwater days",
    role: "For a change of pace",
    initials: "B",
  },
  {
    text: "Find a different rhythm in heritage lanes, local cafés, and streets full of character.",
    name: "City wandering",
    role: "For curious explorers",
    initials: "C",
  },
];

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DOW = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

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
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

function fromISODate(value) {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatDate(d) {
  if (!d) return "Add date";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
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
    ...Array.from(
      { length: daysInMonth },
      (_, i) => new Date(year, month, i + 1),
    ),
  ];

  return (
    <div>
      <div className="cal-title">
        {MONTHS[month]} {year}
      </div>
      <div className="cal-grid">
        {DOW.map((d) => (
          <div key={d} className="dow">
            {d}
          </div>
        ))}
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;
          const disabled = d < today;
          const isSelected = selected.some((s) => isSameDay(s, d));
          const cls = [
            "cal-day",
            disabled ? "disabled" : "",
            isSelected ? "selected" : "",
          ]
            .join(" ")
            .trim();

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
  const [quickDestination, setQuickDestination] = useState("");
  const [quickMessage, setQuickMessage] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest(".search-field")) setOpenField(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
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
    : "All South India";

  const goToHotels = (cityName = location) => {
    setOpenField(null);

    const start = checkIn || startOfDay(1);
    let end = checkOut;
    if (!end || end <= start) {
      end = new Date(start);
      end.setDate(end.getDate() + 1);
    }

    const matchedCity = SEARCH_LOCATIONS.find(
      (item) =>
        item.city.toLowerCase() ===
        String(cityName || "")
          .trim()
          .toLowerCase(),
    )?.city;
    const params = new URLSearchParams();
    if (matchedCity) {
      params.set("location", matchedCity);
    } else if (cityName && cityName !== ALL_LOCATIONS) {
      params.set("query", String(cityName).trim());
    }
    params.set("checkIn", toISODate(start));
    params.set("checkOut", toISODate(end));
    params.set("adults", String(Math.min(adults, 6)));
    params.set("children", String(Math.min(kids, 6)));
    params.set("rooms", String(Math.min(rooms, 4)));

    navigate({ pathname: HOTEL_LIST_PATH, search: `?${params.toString()}` });
  };

  const handleSearch = (event) => {
    if (event) event.preventDefault();
    goToHotels(location);
  };
  const handleQuickSearch = (event) => {
    event.preventDefault();
    goToHotels(quickDestination.trim() || location);
  };
  return (
    <div className="home-page">
      <header className={`header ${scrolled || menuOpen ? "scrolled" : ""}`}>
        <div className="container header-inner">
          <Link to="/" className="brand">
            <BrandMark />
            <BrandName />
          </Link>

          <nav className="nav-links" aria-label="Main navigation">
            <a href="#home" className="active">
              Home
            </a>
            <Link to="/about">About Us</Link>
            <Link to="/explore-destinations">Explore Destinations</Link>
            <Link to={HOTEL_LIST_PATH}>Hotels</Link>
            <Link to="/contact">Contact Us</Link>
          </nav>

          <div className="header-actions">
            <Link to="/list-your-property" className="btn-signup property-cta">
              List your property
            </Link>
            <button
              className="hamburger"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
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
            id="mobile-navigation"
            aria-label="Mobile navigation"
          >
            <a href="#home" onClick={() => setMenuOpen(false)}>
              Home
            </a>
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
            <Link
              to="/sign-in"
              className="mobile-signin-link"
              onClick={() => setMenuOpen(false)}
            >
              <UserRound size={16} aria-hidden="true" /> Sign In
            </Link>
          </nav>
        )}
      </header>

      <section className="hero" id="home">
        <div className="container hero-content">
          <span className="hero-eyebrow">
            <span className="dot" /> Find your vibe. Follow your route.
          </span>
          <h1>
            Your next trip,{" "}
            <span className="accent">your kind of stay.</span>
          </h1>
          <p className="sub">
            Explore destinations across South India, compare stay details, and
            find options that fit the way you want to travel.
          </p>

          <div className="hero-trust">
            <div className="trust-item">
              <span className="num">
                Explore
              </span>
              <span className="lbl">places across South India</span>
            </div>
            <div className="trust-item">
              <span className="num">Compare</span>
              <span className="lbl">stays by the details</span>
            </div>
            <div className="trust-item">
              <span className="num">
                Plan
              </span>
              <span className="lbl">with your dates in mind</span>
            </div>
            <div className="trust-item">
              <span className="num">Enquire</span>
              <span className="lbl">when you have questions</span>
            </div>
          </div>

          <div className="search-wrap">
            <form className="search-bar" onSubmit={handleSearch}>
              <div
                className={`search-field ${openField === "location" ? "open" : ""}`}
                onClick={() =>
                  setOpenField(openField === "location" ? null : "location")
                }
              >
                <div className="field-icon">
                  <MapPin size={20} />
                </div>
                <div className="field-body">
                  <div className="field-label">Where to?</div>
                  <div className="field-value">{locationLabel}</div>
                </div>
                <ChevronDown className="chev" size={18} />
                {openField === "location" && (
                  <div
                    className="search-dropdown"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div
                      className="dropdown-city"
                      style={
                        location === ALL_LOCATIONS
                          ? { background: "#E8F1E9" }
                          : undefined
                      }
                      onClick={() => {
                        setLocation(ALL_LOCATIONS);
                        setOpenField(null);
                      }}
                    >
                      <div
                        className="flag"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Globe size={16} />
                      </div>
                      <div>
                        <div className="cname">All South India</div>
                        <div className="cinfo">
                          {SEARCH_LOCATIONS.length} destinations ·{" "}
                          {SEARCH_LOCATIONS.length * 15} stays
                        </div>
                      </div>
                    </div>

                    {SEARCH_LOCATIONS.map((c) => (
                      <div
                        key={c.city}
                        className="dropdown-city"
                        style={
                          location === c.city
                            ? { background: "#E8F1E9" }
                            : undefined
                        }
                        onClick={() => {
                          setLocation(c.city);
                          setOpenField(null);
                        }}
                      >
                        <div
                          className="flag"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <MapPin size={16} />
                        </div>
                        <div>
                          <div className="cname">{c.city}</div>
                          <div className="cinfo">
                            {c.state} · {c.stays} stays
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div
                className={`search-field ${openField === "date" ? "open" : ""}`}
                onClick={() =>
                  setOpenField(openField === "date" ? null : "date")
                }
              >
                <div className="field-icon">
                  <CalendarDays size={20} />
                </div>
                <div className="field-body">
                  <div className="field-label">When are you going?</div>
                  <div className="field-value">
                    {formatDate(checkIn)}{" "}
                    {checkOut && `→ ${formatDate(checkOut)}`}{" "}
                    {nights > 0 && ` · ${nights}n`}
                  </div>
                </div>
                <ChevronDown className="chev" size={18} />
                {openField === "date" && (
                  <div
                    className="date-pop"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="date-months">
                      <MonthGrid
                        offset={0}
                        selected={selectedDates}
                        setSelected={handleDateClick}
                      />
                      <MonthGrid
                        offset={1}
                        selected={selectedDates}
                        setSelected={handleDateClick}
                      />
                    </div>
                    <div className="cal-foot">
                      <span>Add your travel dates for exact pricing</span>
                      <button
                        style={{ color: "var(--blue)", fontWeight: 700 }}
                        onClick={() => setOpenField(null)}
                      >
                        Apply ✓
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div
                className={`search-field ${openField === "guests" ? "open" : ""}`}
                onClick={() =>
                  setOpenField(openField === "guests" ? null : "guests")
                }
              >
                <div className="field-icon">
                  <Users size={20} />
                </div>
                <div className="field-body">
                  <div className="field-label">Who’s coming?</div>
                  <div className="field-value">
                    {totalGuests} {totalGuests === 1 ? "Guest" : "Guests"} ·{" "}
                    {rooms} Room{rooms > 1 ? "s" : ""}
                  </div>
                </div>
                <ChevronDown className="chev" size={18} />
                {openField === "guests" && (
                  <div
                    className="guests-pop"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="guests-row">
                      <div className="guests-info">
                        <div className="g-title">Adults</div>
                        <div className="g-sub">Age 13+</div>
                      </div>
                      <div className="stepper">
                        <button
                          disabled={adults <= 1}
                          onClick={() => setAdults((a) => a - 1)}
                        >
                          −
                        </button>
                        <span className="val">{adults}</span>
                        <button
                          disabled={adults >= 6}
                          onClick={() => setAdults((a) => a + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="guests-row">
                      <div className="guests-info">
                        <div className="g-title">Children</div>
                        <div className="g-sub">Age 0–12</div>
                      </div>
                      <div className="stepper">
                        <button
                          disabled={kids <= 0}
                          onClick={() => setKids((k) => k - 1)}
                        >
                          −
                        </button>
                        <span className="val">{kids}</span>
                        <button onClick={() => setKids((k) => k + 1)}>+</button>
                      </div>
                    </div>
                    <div className="guests-row">
                      <div className="guests-info">
                        <div className="g-title">Rooms</div>
                        <div className="g-sub">Max 4 rooms</div>
                      </div>
                      <div className="stepper">
                        <button
                          disabled={rooms <= 1}
                          onClick={() => setRooms((r) => r - 1)}
                        >
                          −
                        </button>
                        <span className="val">{rooms}</span>
                        <button
                          disabled={rooms >= 4}
                          onClick={() => setRooms((r) => r + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button type="submit" className="search-btn">
                <Search size={20} /> Search
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="trip-zone" id="planner">
        <div className="container">
          <div className="section-head">
            <span className="section-tag">A good place to begin</span>
            <h2 className="section-title">
              From daydream to{" "}
              <span style={{ color: "var(--gold-2)" }}>next steps</span>
            </h2>
            <p className="section-desc">
              Pick a place, explore available stay details, and reach out when
              you’re ready to ask a question.
            </p>
          </div>

          <div className="trip-steps">
            {steps.map((s, i) => (
              <div className="step-card" key={s.title}>
                <Link
                  className="step-img-link"
                  to={s.to}
                  aria-label={`${s.linkLabel}: ${s.title}`}
                >
                  <div className="step-img">
                    <img src={s.img} alt="" />
                    <div className="step-num">0{i + 1}</div>
                  </div>
                </Link>
                <div className="step-body">
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                  <div className="step-dur">
                    <Clock size={15} /> {s.dur}
                  </div>
                  <Link className="step-link" to={s.to}>
                    {s.linkLabel} <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="section home-destinations-section"
        aria-labelledby="home-destinations-title"
      >
        <div className="container">
          <div className="section-head">
            <span className="section-tag">Where could you go?</span>
            <h2 className="section-title" id="home-destinations-title">
              Explore by <span className="hl">destination</span>
            </h2>
            <p className="section-desc">
              From heritage streets to green hills, start with a destination
              that feels like your kind of trip.
            </p>
          </div>
          <div className="home-destinations-grid">
            {HOME_DESTINATIONS.map((destination) => (
              <Link
                className="home-destination-card"
                key={destination.city}
                to={`${HOTEL_LIST_PATH}?location=${encodeURIComponent(destination.city)}`}
              >
                <img
                  src={destination.image}
                  alt={`${destination.city}, ${destination.state}`}
                  loading="lazy"
                  decoding="async"
                />
                <span className="home-destination-count">
                  Explore
                </span>
                <div className="home-destination-overlay" />
                <div className="home-destination-info">
                  <span>{destination.state}</span>
                  <h3>{destination.city}</h3>
                  <p className="home-destination-description">
                    {destination.description}
                  </p>
                  <span className="home-destination-link">
                    Explore stays <ArrowRight size={15} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section home-trending-section" id="hotels">
        <div className="container">
          <div className="section-head">
            <span className="section-tag">A few places to start</span>
            <h2 className="section-title">
              Stays with a <span className="hl">sense of place</span>
            </h2>
            <p className="section-desc">
              Explore a mix of city, coast, and highland stays. Review each
              listing’s details to see what suits your plans.
            </p>
          </div>

          <div className="hotels-grid">
            {hotels.map((h) => (
              <article className="hotel-card" key={h.name}>
                <div className="hotel-img">
                  <img
                    src={h.img}
                    alt={h.name}
                    onError={
                      h.city === "Coimbatore"
                        ? (event) => {
                            event.currentTarget.onerror = null;
                            event.currentTarget.src = hotels[1].img;
                          }
                        : undefined
                    }
                  />
                  <span className="hotel-badge">{h.badge}</span>
                  <div className="hotel-fav">
                    <HeartIcon />
                  </div>
                </div>
                <div className="hotel-body">
                  <div className="hotel-top">
                    <div>
                      <div className="hotel-name">{h.name}</div>
                      <div className="hotel-loc">
                        <MapPin size={13} /> {h.city}, {h.country}
                      </div>
                      <p className="hotel-description">{h.description}</p>
                    </div>
                  </div>
                  <div className="hotel-amenities">
                    {h.amenities.map((a) => (
                      <span className="amen" key={a}>
                        {a}
                      </span>
                    ))}
                  </div>
                  <div className="hotel-foot">
                    <div className="hotel-price">
                      <div className="from">per night</div>
                      <div className="price">
                        ₹{h.price.toLocaleString("en-IN")} <small>INR</small>
                      </div>
                    </div>
                    <button
                      className="btn-ghost"
                      onClick={() => goToHotels(h.city)}
                    >
                      View Deal
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="section home-offers-section"
        id="offers"
      >
        <div className="container">
          <div className="section-head">
            <span className="section-tag">Find your travel mood</span>
            <h2 className="section-title">
              A little <span className="hl">travel inspiration</span>
            </h2>
            <p className="section-desc">
              Get ideas for a change of scenery, then explore destinations and
              stay options at your own pace.
            </p>
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
                  <Link
                    className="obtn"
                    to={`/customer-enquiry?source=${o.source}&offer=${encodeURIComponent(o.title)}`}
                  >
                    {o.btn}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section home-benefits-section">
        <div className="container">
          <div className="section-head">
            <span className="section-tag">A clearer way to explore</span>
            <h2 className="section-title">
              Make space for <span className="hl">your kind of trip</span>
            </h2>
            <p className="section-desc">
              Browse destinations, compare the details that matter to you, and
              use the available enquiry forms when you need to get in touch.
            </p>
          </div>

          <div className="why-us">
            <div className="features-grid">
              {features.map((f) => (
                <div className="feature" key={f.title}>
                  <div className="ficon">
                    <f.icon size={30} />
                  </div>
                  <h4>{f.title}</h4>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section home-testimonials-section">
        <div className="container">
          <div className="section-head">
            <span className="section-tag">Take a moment to imagine</span>
            <h2 className="section-title">
              Which way will <span className="hl">you wander?</span>
            </h2>
            <p className="section-desc">
              A hill-country pause, backwater calm, or a day exploring the city
              — choose the rhythm that sounds right.
            </p>
          </div>

          <div className="testi-grid">
            {travelMoods.map((t) => (
              <div className="testi-card" key={t.name}>
                <span className="mood-mark">
                  <Sparkles />
                </span>
                <p className="testi-text">{t.text}</p>
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

      <section
        className="home-search-cta-section"
        aria-labelledby="home-search-cta-title"
      >
        <div className="container">
          <div className="home-search-cta">
            <div className="home-search-cta-copy">
              <span className="section-tag">Your next route starts here</span>
              <h2 id="home-search-cta-title">Where would you like to wake up?</h2>
              <p>Explore destinations and accommodation options across South India.</p>
            </div>
            <form className="home-quick-search" onSubmit={handleQuickSearch}>
              <label
                className="home-quick-search-input"
                htmlFor="home-quick-destination"
              >
                <MapPin size={19} aria-hidden="true" />
                <input
                  id="home-quick-destination"
                  type="search"
                  list="home-quick-destinations"
                  placeholder="Where to?"
                  value={quickDestination}
                  onChange={(event) => setQuickDestination(event.target.value)}
                />
                <datalist id="home-quick-destinations">
                  {SEARCH_LOCATIONS.map((item) => (
                    <option key={item.city} value={item.city} />
                  ))}
                </datalist>
              </label>
              <label className="home-quick-date" htmlFor="home-quick-checkin">
                <span>Check-in</span>
                <input
                  id="home-quick-checkin"
                  type="date"
                  min={toISODate(startOfDay())}
                  value={checkIn ? toISODate(checkIn) : ""}
                  onChange={(event) => {
                    const date = fromISODate(event.target.value);
                    setCheckIn(date);
                    if (date && checkOut && checkOut <= date) {
                      const next = new Date(date);
                      next.setDate(next.getDate() + 1);
                      setCheckOut(next);
                    }
                  }}
                />
              </label>
              <label className="home-quick-date" htmlFor="home-quick-checkout">
                <span>Check-out</span>
                <input
                  id="home-quick-checkout"
                  type="date"
                  min={
                    checkIn
                      ? toISODate(
                          new Date(
                            checkIn.getFullYear(),
                            checkIn.getMonth(),
                            checkIn.getDate() + 1,
                          ),
                        )
                      : toISODate(startOfDay(1))
                  }
                  value={checkOut ? toISODate(checkOut) : ""}
                  onChange={(event) =>
                    setCheckOut(fromISODate(event.target.value))
                  }
                />
              </label>
              <label className="home-quick-guests" htmlFor="home-quick-guests">
                <Users size={17} aria-hidden="true" />
                <select
                  id="home-quick-guests"
                  value={Math.min(totalGuests, 6)}
                  onChange={(event) => {
                    setAdults(Number(event.target.value));
                    setKids(0);
                  }}
                >
                  {[1, 2, 3, 4, 5, 6].map((count) => (
                    <option key={count} value={count}>
                      {count} {count === 1 ? "Guest" : "Guests"}
                    </option>
                  ))}
                </select>
              </label>
              <label className="home-quick-rooms" htmlFor="home-quick-rooms">
                <select
                  id="home-quick-rooms"
                  aria-label="Rooms"
                  value={rooms}
                  onChange={(event) => setRooms(Number(event.target.value))}
                >
                  {[1, 2, 3, 4].map((count) => (
                    <option key={count} value={count}>
                      {count} {count === 1 ? "Room" : "Rooms"}
                    </option>
                  ))}
                </select>
              </label>
              <label
                className="home-quick-message"
                htmlFor="home-quick-message"
              >
                <span>Your message</span>
                <textarea
                  id="home-quick-message"
                  rows="3"
                  placeholder="Tell us what you have in mind..."
                  value={quickMessage}
                  onChange={(event) => setQuickMessage(event.target.value)}
                />
              </label>
              <div className="home-quick-actions">
                <button className="home-quick-search-button" type="submit">
                  <Search size={17} /> Search
                </button>
                <a
                  className="home-whatsapp-cta"
                  href={`https://wa.me/918005550199?text=${encodeURIComponent(
                    quickMessage.trim() ||
                      "Hi VibezRoutes, I have a question about a stay.",
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Contact VibezRoutes on WhatsApp"
                >
                  <MessageCircle size={19} aria-hidden="true" />{" "}
                  <span>Open WhatsApp</span>
                </a>
              </div>
            </form>
          </div>
        </div>
      </section>

      <AboutFooter activePage="home" />
    </div>
  );
}

function HeartIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}
