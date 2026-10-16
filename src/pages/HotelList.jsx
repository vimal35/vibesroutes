// src/pages/HotelList.jsx

import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AboutFooter, SitePageHeader } from "./About";
import {
  Search,
  MapPin,
  CalendarDays,
  Users,
  ChevronRight,
  ChevronDown,
  Heart,
  Star,
  X,
  SlidersHorizontal,
  Wifi,
  Waves,
  Car,
  Dumbbell,
  UtensilsCrossed,
  Coffee,
  Dog,
  Plane,
  Sparkles,
  Leaf,
  ArrowRight,
  LayoutGrid,
  Map as MapIcon,
  Clock,
  Check,
  ShieldCheck,
  BadgeCheck,
  Briefcase,
  Sun,
  Shirt,
  Zap,
  ChefHat,
  Wind,
  Droplets,
  Umbrella,
  Wine,
  Soup,
} from "lucide-react";
import "./Home.css";
import "./HotelList.css";

/* ================================ API ================================= */

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* ================================ constants ================================ */

export const CURRENCY = "₹";

const ALL = "All locations";
const PRICE_MAX = 10000;
const DAY = 86400000;

const LOCATIONS = [
  "Pondicherry",
  "Munnar",
  "Ooty",
  "Coimbatore",
  "Bangalore",
  "Hyderabad",
];

const CITY_STATE = {
  Pondicherry: "Tamil Nadu",
  Munnar: "Kerala",
  Ooty: "Tamil Nadu",
  Coimbatore: "Tamil Nadu",
  Bangalore: "Karnataka",
  Hyderabad: "Telangana",
};

const U = (id) => `https://images.unsplash.com/${id}`;

/* ================================ images ================================ */

/* Hotel exterior / lobby / pool photos */
const HOTEL_EXTERIORS = [
  U("photo-1566073771259-6a8506099945"),
  U("photo-1551882547-ff40c63fe5fa"),
  U("photo-1542314831-068cd1dbfeeb"),
  U("photo-1571896349842-33c89424de2d"),
  U("photo-1540541338287-41700207dee6"),
  U("photo-1564501049412-61c2a3083791"),
  U("photo-1520250497591-112f2f40a3f4"),
  U("photo-1445019980597-93fa8acb246c"),
];

/* Room interior photos */
const INTERIOR_IMAGES = [
  U("photo-1582719478250-c89cae4dc85b"),
  U("photo-1631049307264-da0ec9d70304"),
  U("photo-1618773928121-c32242e63f39"),
  U("photo-1596394516093-501ba68a0ba6"),
  U("photo-1590490360182-c33d57733427"),
  U("photo-1566665797739-1674de7a421a"),
];

/* ================================ city data ================================ */

const CITY_DATA = {
  Pondicherry: {
    state: "Tamil Nadu",
    areas: [
      "White Town",
      "Promenade Beach",
      "Auroville",
      "Heritage Town",
      "Serenity Beach",
    ],
    landmarks: [
      "Promenade Beach",
      "Sri Aurobindo Ashram",
      "Paradise Beach",
      "Auroville",
    ],
    images: [
      U("photo-1593693397690-362cb9666fc2"),
      U("photo-1582510003544-4d00b7f74220"),
      U("photo-1507525428034-b723cf961d3e"),
    ],
  },

  Munnar: {
    state: "Kerala",
    areas: [
      "Chithirapuram",
      "Mattupetty",
      "Old Munnar",
      "Pallivasal",
      "Devikulam",
    ],
    landmarks: [
      "Tea Museum",
      "Mattupetty Dam",
      "Eravikulam National Park",
      "Echo Point",
    ],
    images: [
      U("photo-1602216056096-3b40cc0c9944"),
      U("photo-1593693397690-362cb9666fc2"),
      U("photo-1500534623283-312aade485b7"),
    ],
  },

  Ooty: {
    state: "Tamil Nadu",
    areas: [
      "Charing Cross",
      "Lovedale",
      "Coonoor Road",
      "Fern Hill",
      "Avalanche",
    ],
    landmarks: [
      "Ooty Lake",
      "Botanical Garden",
      "Doddabetta Peak",
      "Rose Garden",
    ],
    images: [
      U("photo-1597074866923-dc0589150358"),
      U("photo-1500534623283-312aade485b7"),
      U("photo-1511497584788-876760111969"),
    ],
  },

  Coimbatore: {
    state: "Tamil Nadu",
    areas: [
      "RS Puram",
      "Gandhipuram",
      "Race Course",
      "Avinashi Road",
      "Saibaba Colony",
    ],
    landmarks: [
      "Marudamalai Temple",
      "VOC Park",
      "Isha Yoga Centre",
      "Gedee Car Museum",
    ],
    images: [
      U("photo-1564501049412-61c2a3083791"),
      U("photo-1551882547-ff40c63fe5fa"),
      U("photo-1566073771259-6a8506099945"),
    ],
  },

  Bangalore: {
    state: "Karnataka",
    areas: [
      "MG Road",
      "Koramangala",
      "Whitefield",
      "Indiranagar",
      "Electronic City",
    ],
    landmarks: [
      "Cubbon Park",
      "Lalbagh Botanical Garden",
      "Bangalore Palace",
      "UB City",
    ],
    images: [
      U("photo-1566073771259-6a8506099945"),
      U("photo-1551882547-ff40c63fe5fa"),
      U("photo-1542314831-068cd1dbfeeb"),
    ],
  },

  Hyderabad: {
    state: "Telangana",
    areas: [
      "Banjara Hills",
      "Hitech City",
      "Gachibowli",
      "Jubilee Hills",
      "Abids",
    ],
    landmarks: [
      "Charminar",
      "Golconda Fort",
      "Hussain Sagar Lake",
      "Ramoji Film City",
    ],
    images: [
      U("photo-1564501049412-61c2a3083791"),
      U("photo-1540541338287-41700207dee6"),
      U("photo-1571896349842-33c89424de2d"),
    ],
  },
};

/* ================================ amenities ================================ */

export const AMENITY_ICONS = {
  "Free WiFi": Wifi,
  "Swimming pool": Waves,
  "Free parking": Car,
  "Fitness centre": Dumbbell,
  Restaurant: UtensilsCrossed,
  Bar: Wine,
  "Room service": Soup,
  "Airport shuttle": Plane,
  "Family rooms": Users,
  "Pet friendly": Dog,
  Beachfront: Umbrella,
  "24-hour front desk": Clock,
  "Business centre": Briefcase,
  Terrace: Sun,
  Laundry: Shirt,
  "EV charging station": Zap,
  Kitchenette: ChefHat,
  "Private pool": Waves,
  "Air conditioning": Wind,
  "Water park access": Droplets,
  Garden: Leaf,
};

const PROPERTY_TYPES = ["Hotel", "Resort", "Apartment", "Villa", "Hostel"];

const AMENITIES = [
  "Free WiFi",
  "Swimming pool",
  "Free parking",
  "Fitness centre",
  "Restaurant",
  "Bar",
  "Room service",
  "Airport shuttle",
  "Family rooms",
  "24-hour front desk",
  "Air conditioning",
  "Laundry",
  "Garden",
  "Terrace",
];

const PERKS = [
  {
    key: "Free cancellation",
    icon: ShieldCheck,
    test: (h) => h.freeCancel,
  },
  {
    key: "Breakfast included",
    icon: Coffee,
    test: (h) => h.breakfast,
  },
  {
    key: "Pay at property",
    icon: BadgeCheck,
    test: (h) => h.payLater,
  },
  {
    key: "Sustainable",
    icon: Leaf,
    test: (h) => h.sustainable,
  },
];

const RATING_OPTIONS = [
  { value: 9, label: "Exceptional 9+" },
  { value: 8, label: "Excellent 8+" },
  { value: 7, label: "Very good 7+" },
];

const SORTS = [
  { id: "recommended", label: "Recommended" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "rating", label: "Guest rating" },
  { id: "stars", label: "Star rating" },
  { id: "distance", label: "Distance" },
];

/* ================================ sample hotel data ================================ */

const HOTEL_PREFIXES = [
  "The Grand",
  "Royal",
  "Green Valley",
  "Heritage",
  "Lake View",
  "Crown Plaza",
  "The Fern",
  "Silver Oak",
  "Regency",
  "Blue Orchid",
  "Urban Nest",
  "Hilltop",
  "Marigold",
  "Palm Grove",
  "Golden Stay",
];

const HOTEL_SUFFIXES = [
  "Resort",
  "Hotel",
  "Retreat",
  "Suites",
  "Residency",
  "Lodge",
  "Palace",
  "Inn",
];

const REVIEWS = [
  {
    name: "Aarav",
    country: "India",
    date: "Reviewed 3 days ago",
    score: 9.2,
    title: "Excellent stay",
    comment:
      "The room was clean, comfortable and beautifully maintained. The staff were very helpful.",
  },
  {
    name: "Ananya",
    country: "India",
    date: "Reviewed 1 week ago",
    score: 8.8,
    title: "Great location",
    comment:
      "The hotel was close to the main attractions and the breakfast had plenty of choices.",
  },
  {
    name: "Rahul",
    country: "India",
    date: "Reviewed 2 weeks ago",
    score: 9.0,
    title: "Very comfortable",
    comment:
      "The property was peaceful, modern and perfect for a short family holiday.",
  },
];

const FALLBACK_IMG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800"><rect width="1200" height="800" fill="#e5ebf2"/><text x="50%" y="50%" fill="#8a97a8" font-family="Arial, sans-serif" font-size="36" text-anchor="middle" dominant-baseline="middle">Image unavailable</text></svg>',
  );

/* ================================ helpers ================================ */

const onImgError = (event) => {
  event.currentTarget.onerror = null;
  event.currentTarget.src = FALLBACK_IMG;
};

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const imageUrl = (url) => `${url}?auto=format&fit=crop&w=1200&q=80`;

export const ratingLabel = (rating = 0) => {
  if (rating >= 9.2) return "Exceptional";
  if (rating >= 8.8) return "Wonderful";
  if (rating >= 8.2) return "Excellent";
  if (rating >= 7.5) return "Very good";
  return "Good";
};

/* ================================ DB hotel normalizer ================================ */

const normalizeDbHotel = (h) => {
  if (!h) return null;

  const city = h.city || "";

  const gallery = Array.isArray(h.gallery) ? h.gallery.filter(Boolean) : [];

  const image = h.image || gallery[0] || "";

  return {
    ...h,

    id: String(h.id || h._id || ""),

    name: h.name || "Unnamed property",

    city,

    state: h.state || CITY_STATE[city] || "",

    area: h.area || "",

    type: h.type || "Hotel",

    stars: Number(h.stars) || 3,

    rating: Number(h.rating) || 8,

    reviews: Number(h.reviews) || 0,

    price: Number(h.price) || 0,

    oldPrice: h.oldPrice ? Number(h.oldPrice) : null,

    taxes: Number(h.taxes) || Math.round((Number(h.price) || 0) * 0.12),

    distance: Number(h.distance) || 0,

    breakfast: Boolean(h.breakfast),

    freeCancel: Boolean(h.freeCancel),

    payLater: Boolean(h.payLater),

    noPrepay: Boolean(h.noPrepay),

    sustainable: Boolean(h.sustainable),

    address: h.address || `${h.area || ""}, ${city}`,

    checkIn: h.checkIn || "14:00 – 23:30",

    checkOut: h.checkOut || "06:00 – 11:00",

    desc: h.desc || "",

    highlights: Array.isArray(h.highlights) ? h.highlights : [],

    amenities: Array.isArray(h.amenities) ? h.amenities : [],

    landmarks: Array.isArray(h.landmarks) ? h.landmarks : [],

    image,

    // The cover photo always leads the gallery.
    gallery: image ? [image, ...gallery.filter((src) => src !== image)] : gallery,

    rooms: Array.isArray(h.rooms) ? h.rooms : [],

    cats: h.cats || {},

    guestReviews: Array.isArray(h.guestReviews) ? h.guestReviews : [],

    mapX: Number(h.mapX) || 18,

    mapY: Number(h.mapY) || 22,

    source: h.source || "admin",
  };
};

/* ================================ dates ================================ */

const pad = (n) => String(n).padStart(2, "0");

const toInputDate = (value) => {
  const d = new Date(value);

  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const parseInputDate = (str) => {
  const [y, m, d] = str.split("-").map(Number);

  return new Date(y, m - 1, d);
};

const addDays = (str, amount) => {
  const d = parseInputDate(str);

  d.setDate(d.getDate() + amount);

  return toInputDate(d);
};

const isValidDate = (str) =>
  typeof str === "string" &&
  /^\d{4}-\d{2}-\d{2}$/.test(str) &&
  toInputDate(parseInputDate(str)) === str;

const nightsBetween = (from, to) => {
  const [y1, m1, d1] = from.split("-").map(Number);
  const [y2, m2, d2] = to.split("-").map(Number);

  const diff = Math.round(
    (Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / DAY,
  );

  return Number.isFinite(diff) && diff > 0 ? diff : 1;
};

const clampInt = (value, min, max, fallback) => {
  const n = parseInt(value, 10);

  if (Number.isNaN(n)) return fallback;

  return Math.min(max, Math.max(min, n));
};

/* ================================ search ================================ */

const resolveLocation = (value) => {
  if (!value) return ALL;

  const match = LOCATIONS.find(
    (city) => city.toLowerCase() === String(value).trim().toLowerCase(),
  );

  return match || ALL;
};

const readSearch = (params) => {
  const today = toInputDate(new Date());

  const rawIn = params.get("checkIn");

  const checkIn =
    isValidDate(rawIn) && rawIn >= today ? rawIn : addDays(today, 1);

  const rawOut = params.get("checkOut");

  const checkOut =
    isValidDate(rawOut) && rawOut > checkIn ? rawOut : addDays(checkIn, 2);

  return {
    location: resolveLocation(params.get("location")),
    checkIn,
    checkOut,
    adults: clampInt(params.get("adults"), 1, 6, 2),
    children: clampInt(params.get("children"), 0, 6, 0),
    rooms: clampInt(params.get("rooms"), 1, 4, 1),
  };
};

/* ================================ hotel generator ================================ */

const roundCat = (value) =>
  Math.round(Math.min(9.8, Math.max(5, value)) * 10) / 10;

export const Stars = ({ n, size = 14 }) => (
  <span className="hl-stars">
    {[1, 2, 3, 4, 5].map((item) => (
      <Star
        key={item}
        size={size}
        className={item <= n ? "on" : "off"}
        fill={item <= n ? "currentColor" : "none"}
      />
    ))}
  </span>
);

/* ================================ location picker ================================ */

const LOCATION_OPTIONS = [ALL, ...LOCATIONS];

function LocationPicker({ value, onChange, counts, total }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [open]);

  useEffect(() => {
    if (open) listRef.current?.children[active]?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const openList = () => {
    setActive(Math.max(0, LOCATION_OPTIONS.indexOf(value)));
    setOpen(true);
  };

  const choose = (option) => {
    onChange(option);
    setOpen(false);
  };

  const handleKeyDown = (event) => {
    const last = LOCATION_OPTIONS.length - 1;

    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
        event.preventDefault();
        openList();
      }
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => Math.min(last, index + 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => Math.max(0, index - 1));
    } else if (event.key === "Home") {
      event.preventDefault();
      setActive(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setActive(last);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      choose(LOCATION_OPTIONS[active]);
    } else if (event.key === "Escape" || event.key === "Tab") {
      setOpen(false);
    }
  };

  return (
    <div className={`hl-loc ${open ? "open" : ""}`} ref={rootRef}>
      <button
        type="button"
        className="hl-loc-trigger"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="hl-loc-list"
        aria-activedescendant={open ? `hl-loc-opt-${active}` : undefined}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={handleKeyDown}
      >
        <span>{value}</span>
        <ChevronDown size={17} aria-hidden="true" />
      </button>

      {open && (
        <ul className="hl-loc-list" id="hl-loc-list" role="listbox" ref={listRef}>
          {LOCATION_OPTIONS.map((option, index) => {
            const selected = option === value;

            return (
              <li
                key={option}
                id={`hl-loc-opt-${index}`}
                role="option"
                aria-selected={selected}
                className={`hl-loc-opt ${index === active ? "active" : ""} ${
                  selected ? "selected" : ""
                }`}
                onMouseEnter={() => setActive(index)}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => choose(option)}
              >
                <span className="hl-loc-icon" aria-hidden="true">
                  {option === ALL ? <LayoutGrid size={15} /> : <MapPin size={15} />}
                </span>
                <span className="hl-loc-text">
                  <strong>{option}</strong>
                  <small>
                    {option === ALL ? "Across South India" : CITY_STATE[option]}
                  </small>
                </span>
                <span className="hl-loc-count">
                  {option === ALL ? total : counts[option] ?? 0}
                </span>
                {selected && <Check size={15} className="hl-loc-check" aria-hidden="true" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

const createRooms = (hotel, index) => [
  {
    name: "Deluxe King Room",
    bed: "1 king bed",
    guests: 2,
    size: 32 + (index % 8),
    price: hotel.price,
    img: hotel.gallery[1],
    benefits: [
      hotel.freeCancel
        ? "Free cancellation before 24 hours"
        : "Non-refundable rate",
      hotel.breakfast ? "Breakfast included" : "Breakfast available",
      "Pay at the property",
    ],
  },

  {
    name: "Premium Family Room",
    bed: "1 king bed + sofa bed",
    guests: 4,
    size: 48 + (index % 12),
    price: Math.round((hotel.price * 1.35) / 100) * 100,
    img: hotel.gallery[2],
    benefits: [
      "Free cancellation",
      "Breakfast included",
      "Extra beds available",
    ],
  },

  {
    name: "Executive Suite",
    bed: "1 king bed",
    guests: 3,
    size: 64 + (index % 15),
    price: Math.round((hotel.price * 1.8) / 100) * 100,
    img: hotel.gallery[4],
    benefits: [
      "Free cancellation",
      "Welcome drink included",
      "Complimentary airport transfer",
    ],
  },
];

const BASE_PRICES = {
  Pondicherry: 2800,
  Munnar: 3200,
  Ooty: 3000,
  Coimbatore: 2400,
  Bangalore: 4200,
  Hyderabad: 3600,
};

const createHotel = (city, index) => {
  const config = CITY_DATA[city];

  const cityIndex = LOCATIONS.indexOf(city);

  const prefix = HOTEL_PREFIXES[index % HOTEL_PREFIXES.length];

  const suffix = HOTEL_SUFFIXES[index % HOTEL_SUFFIXES.length];

  const area = config.areas[index % config.areas.length];

  const name = `${prefix} ${city} ${suffix}`;

  const type = PROPERTY_TYPES[index % PROPERTY_TYPES.length];

  const price = BASE_PRICES[city] + (index % 5) * 950;

  const rating = Math.round((7.8 + ((index * 7) % 18) / 10) * 10) / 10;

  const exterior = imageUrl(
    HOTEL_EXTERIORS[(cityIndex * 3 + index) % HOTEL_EXTERIORS.length],
  );

  const interior = (offset) =>
    imageUrl(
      INTERIOR_IMAGES[
        (cityIndex * 2 + index + offset) % INTERIOR_IMAGES.length
      ],
    );

  const scenery = imageUrl(config.images[index % config.images.length]);

  const hotel = {
    id: `${slugify(name)}-${index + 1}`,

    name,

    city,

    state: config.state,

    area,

    type,

    stars: Math.min(5, 3 + (index % 3)),

    rating,

    reviews: 680 + index * 437,

    price,

    oldPrice: index % 3 === 0 ? price + 900 : null,

    taxes: Math.round(price * 0.12),

    distance: Math.round((1.2 + (index % 12) * 0.8) * 10) / 10,

    deal: index % 5 === 0 ? "limited" : index % 4 === 0 ? "genius" : null,

    breakfast: index % 2 === 0,

    freeCancel: index % 4 !== 0,

    payLater: index % 3 !== 0,

    noPrepay: index % 5 !== 0,

    sustainable: index % 3 === 0,

    address: `${area}, ${city}, ${config.state}, India`,

    checkIn: "14:00 – 23:30",

    checkOut: "06:00 – 11:00",

    desc: `${name} is a professionally managed ${type.toLowerCase()} in ${area}, ${city}. Enjoy comfortable rooms, attentive service, modern facilities and convenient access to the city's best attractions.`,

    highlights: [
      `Prime location in ${area}`,
      "Comfortable rooms with modern facilities",
      "Highly rated service and cleanliness",
    ],

    amenities: AMENITIES.slice(0, 8 + (index % 6)),

    landmarks: config.landmarks.slice(0, 3).map((landmark, landmarkIndex) => ({
      name: landmark,
      d: `${landmarkIndex + 1 + (index % 2)}.${landmarkIndex + 2} km`,
    })),

    image: exterior,

    gallery: [exterior, interior(0), interior(1), scenery, interior(2)],

    cats: {
      Cleanliness: roundCat(rating + 0.3),
      Comfort: roundCat(rating + 0.1),
      Location: roundCat(rating - 0.1),
      Facilities: roundCat(rating + 0.2),
      Staff: roundCat(rating + 0.4),
      "Value for money": roundCat(rating - 0.3),
      "Free WiFi": roundCat(rating + 0.1),
    },

    guestReviews: [
      REVIEWS[index % REVIEWS.length],
      REVIEWS[(index + 1) % REVIEWS.length],
      REVIEWS[(index + 2) % REVIEWS.length],
    ],

    mapX: 10 + ((index * 13) % 78),

    mapY: 12 + ((index * 17) % 72),

    source: "sample",
  };

  hotel.rooms = createRooms(hotel, index);

  return hotel;
};

/* 6 locations with Munnar adjusted to 17 properties */
export const HOTELS = LOCATIONS.flatMap((city) =>
  Array.from({ length: city === "Munnar" ? 17 : 15 }, (_, index) =>
    createHotel(city, index),
  ),
);

/* ================================ hotel card ================================ */

function HotelCard({ hotel, nights, adults, rooms, wished, onWish }) {
  const saving = hotel.oldPrice ? hotel.oldPrice - hotel.price : 0;

  const total = (hotel.price + hotel.taxes) * nights * rooms;

  const dealLabelMap = {
    limited: "Limited-time deal",
    "limited-time-deal": "Limited-Time Deal",
    genius: "Genius deal",
    new: "Newly opened",
    "newly-opened": "Newly Opened",
    "popular-stay": "Popular Stay",
    "special-offer": "Special Offer",
    "weekend-escape": "Weekend Escape",
    "guest-favourite": "Guest Favourite",
    "new-listing": "New Listing",
    "exclusive-deal": "Exclusive Deal",
    "best-value": "Best Value",
    "trending-stay": "Trending Stay",
  };

  const dealLabel = dealLabelMap[hotel.deal];

  return (
    <article className="hl-card">
      <div className="hl-card-media">
        <Link to={`/hotel/${hotel.id}`} className="hl-card-img">
          <img
            src={hotel.image}
            alt={hotel.name}
            loading="lazy"
            onError={onImgError}
          />
        </Link>

        {dealLabel && (
          <span
            className={`hl-badge ${hotel.deal === "genius" ? "genius" : "deal"}`}
          >
            {dealLabel}
          </span>
        )}

        <button
          type="button"
          className={`hl-wish ${wished ? "on" : ""}`}
          onClick={() => onWish(hotel.id)}
          aria-label={wished ? "Remove from wishlist" : "Save hotel"}
          aria-pressed={wished}
        >
          <Heart size={18} fill={wished ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="hl-card-body">
        <div className="hl-card-top">
          <div>
            <h3 className="hl-card-name">
              <Link to={`/hotel/${hotel.id}`}>{hotel.name}</Link>
            </h3>

            <Stars n={hotel.stars} size={13} />
          </div>

          <div className="hl-rating">
            <span className="hl-rating-box">{hotel.rating.toFixed(1)}</span>

            <span className="hl-rating-txt">
              <b>{ratingLabel(hotel.rating)}</b>

              <em>{hotel.reviews.toLocaleString("en-IN")} reviews</em>
            </span>
          </div>
        </div>

        <p className="hl-card-loc">
          <MapPin size={13} />
          {hotel.area}, {hotel.city} · {hotel.distance} km from centre
        </p>

        <div className="hl-card-high">
          {hotel.highlights.slice(0, 2).map((highlight) => (
            <span key={highlight}>
              <Sparkles size={12} /> {highlight}
            </span>
          ))}

          {hotel.sustainable && (
            <span className="green">
              <Leaf size={12} /> Sustainable property
            </span>
          )}
        </div>

        <div className="hl-card-amen">
          {hotel.amenities.slice(0, 8).map((amenity) => {
            const Icon = AMENITY_ICONS[amenity] || Check;

            return (
              <span key={amenity} title={amenity}>
                <Icon size={15} />
              </span>
            );
          })}

          <em>+{Math.max(0, hotel.amenities.length - 8)} more</em>
        </div>

        <div className="hl-card-tags">
          {hotel.freeCancel && (
            <span className="t green">
              <ShieldCheck size={12} /> Free cancellation
            </span>
          )}

          {hotel.breakfast && (
            <span className="t">
              <Coffee size={12} /> Breakfast included
            </span>
          )}

          {hotel.payLater && (
            <span className="t">
              <BadgeCheck size={12} /> Pay at property
            </span>
          )}
        </div>
      </div>

      <div className="hl-card-price">
        {saving > 0 && (
          <span className="hl-save">
            Save {CURRENCY}
            {saving.toLocaleString("en-IN")}
          </span>
        )}

        <div className="hl-price-line">
          {hotel.oldPrice && (
            <s>
              {CURRENCY}
              {hotel.oldPrice.toLocaleString("en-IN")}
            </s>
          )}

          <b>
            {CURRENCY}
            {hotel.price.toLocaleString("en-IN")}
          </b>

          <span>/ night</span>
        </div>

        <span className="hl-price-tax">
          + {CURRENCY}
          {hotel.taxes.toLocaleString("en-IN")} taxes and fees
        </span>

        <span className="hl-price-total">
          {CURRENCY}
          {total.toLocaleString("en-IN")} total · {nights} night
          {nights > 1 ? "s" : ""}, {adults} adult
          {adults > 1 ? "s" : ""}
          {rooms > 1 ? `, ${rooms} rooms` : ""}
        </span>

        <Link to={`/hotel/${hotel.id}`} className="hl-card-cta">
          See availability <ArrowRight size={15} />
        </Link>
      </div>
    </article>
  );
}

/* ================================== page =================================== */

export default function HotelList() {
  const [searchParams, setSearchParams] = useSearchParams();

  /* ================================ DB HOTELS ================================ */

  const [dbHotels, setDbHotels] = useState([]);

  useEffect(() => {
    let cancelled = false;

    fetch(`${API_BASE}/api/hotels`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Hotel API failed: ${res.status}`);
        }

        return res.json();
      })
      .then((data) => {
        if (cancelled || !data?.success) {
          return;
        }

        const normalized = (data.hotels || [])
          .map(normalizeDbHotel)
          .filter(Boolean);

        setDbHotels(normalized);
      })
      .catch((error) => {
        console.error("Failed to load hotels:", error);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  /* ================================ ALL HOTELS ================================ */

  const ALL_HOTELS = useMemo(() => {
    const ids = new Set(dbHotels.map((hotel) => String(hotel.id)));

    return [
      ...dbHotels,
      ...HOTELS.filter((hotel) => !ids.has(String(hotel.id))),
    ];
  }, [dbHotels]);

  /* ================================ CITY COUNTS ================================ */

  const cityCounts = useMemo(() => {
    return LOCATIONS.reduce((acc, city) => {
      acc[city] = ALL_HOTELS.filter((hotel) => hotel.city === city).length;

      return acc;
    }, {});
  }, [ALL_HOTELS]);

  /* ================================ SEARCH ================================ */

  const [initial] = useState(() => readSearch(searchParams));

  const today = toInputDate(new Date());

  const [location, setLocation] = useState(initial.location);

  const [checkIn, setCheckIn] = useState(initial.checkIn);

  const [checkOut, setCheckOut] = useState(initial.checkOut);

  const [adults, setAdults] = useState(initial.adults);

  const [children, setChildren] = useState(initial.children);

  const [rooms, setRooms] = useState(initial.rooms);

  /* ================================ FILTERS ================================ */

  const [query, setQuery] = useState(() => searchParams.get("query") || "");

  const [sort, setSort] = useState("recommended");

  const [maxPrice, setMaxPrice] = useState(PRICE_MAX);

  const [starFilter, setStarFilter] = useState([]);

  const [typeFilter, setTypeFilter] = useState([]);

  const [perkFilter, setPerkFilter] = useState([]);

  const [ratingFilter, setRatingFilter] = useState(0);

  const [view, setView] = useState("list");

  const [drawer, setDrawer] = useState(false);

  const [wish, setWish] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("tn_wishlist")) || [];
    } catch {
      return [];
    }
  });

  const resultsRef = useRef(null);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const nights = nightsBetween(checkIn, checkOut);

  const locationTitle = location === ALL ? "South India" : location;

  /* ================================ URL → STATE ================================ */

  const urlLocation = resolveLocation(searchParams.get("location"));

  useEffect(() => {
    setLocation(urlLocation);
  }, [urlLocation]);

  /* ================================ STATE → URL ================================ */

  useEffect(() => {
    const next = new URLSearchParams();

    if (location !== ALL) {
      next.set("location", location);
    }

    if (query.trim()) {
      next.set("query", query.trim());
    }

    next.set("checkIn", checkIn);

    next.set("checkOut", checkOut);

    next.set("adults", String(adults));

    next.set("children", String(children));

    next.set("rooms", String(rooms));

    if (next.toString() !== searchParams.toString()) {
      setSearchParams(next, {
        replace: true,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, checkIn, checkOut, adults, children, rooms, query]);

  /* ================================ SCROLL ================================ */

  const scrollToResults = () => {
    const el = resultsRef.current;

    if (!el) return;

    const searchbarHeight =
      document.querySelector(".hl-searchwrap")?.getBoundingClientRect()
        .height || 0;
    const top =
      el.getBoundingClientRect().top +
      window.scrollY -
      (document.querySelector(".header")?.offsetHeight || 0) -
      searchbarHeight -
      16;

    window.scrollTo({
      top: Math.max(0, top),
      behavior: "smooth",
    });
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    const next = new URLSearchParams();

    if (location !== ALL) {
      next.set("location", location);
    }

    if (query.trim()) {
      next.set("query", query.trim());
    }

    next.set("checkIn", checkIn);
    next.set("checkOut", checkOut);
    next.set("adults", String(adults));
    next.set("children", String(children));
    next.set("rooms", String(rooms));

    if (next.toString() !== searchParams.toString()) {
      setSearchParams(next, { replace: true });
    }

    scrollToResults();
  };

  /* ================================ DRAWER ================================ */

  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [drawer]);

  /* ================================ WISHLIST ================================ */

  const toggleWishlist = (id) => {
    setWish((current) => {
      const next = current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id];

      try {
        localStorage.setItem("tn_wishlist", JSON.stringify(next));
      } catch {
        /* ignore storage errors */
      }

      return next;
    });
  };

  const toggleIn = (setter, value) =>
    setter((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );

  /* ================================ DATE EVENTS ================================ */

  const onCheckIn = (event) => {
    const value = event.target.value;

    if (!value) return;

    setCheckIn(value);

    if (checkOut <= value) {
      setCheckOut(addDays(value, 1));
    }
  };

  const onCheckOut = (event) => {
    const value = event.target.value;

    if (value) {
      setCheckOut(value);
    }
  };

  /* ================================ FILTERING ================================ */

  const filteredHotels = useMemo(() => {
    const search = query.trim().toLowerCase();

    return ALL_HOTELS.filter((hotel) => {
      if (location !== ALL && hotel.city !== location) {
        return false;
      }

      if (
        search &&
        ![hotel.name, hotel.city, hotel.area, hotel.state].some((value) =>
          String(value || "")
            .toLowerCase()
            .includes(search),
        )
      ) {
        return false;
      }

      if (hotel.price > maxPrice) {
        return false;
      }

      if (starFilter.length && !starFilter.includes(hotel.stars)) {
        return false;
      }

      if (typeFilter.length && !typeFilter.includes(hotel.type)) {
        return false;
      }

      if (hotel.rating < ratingFilter) {
        return false;
      }

      return perkFilter.every((key) =>
        PERKS.find((perk) => perk.key === key)?.test(hotel),
      );
    });
  }, [
    ALL_HOTELS,
    query,
    location,
    maxPrice,
    starFilter,
    typeFilter,
    ratingFilter,
    perkFilter,
  ]);

  /* ================================ SORTING ================================ */

  const sortedHotels = useMemo(() => {
    const list = [...filteredHotels];

    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;

      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;

      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;

      case "stars":
        list.sort((a, b) => b.stars - a.stars || b.rating - a.rating);
        break;

      case "distance":
        list.sort((a, b) => a.distance - b.distance);
        break;

      default:
        list.sort(
          (a, b) =>
            (b.deal ? 1 : 0) - (a.deal ? 1 : 0) ||
            b.rating * Math.log(b.reviews + 1) -
              a.rating * Math.log(a.reviews + 1),
        );
    }

    return list;
  }, [filteredHotels, sort]);

  /* ================================ CHIPS ================================ */

  const chips = [];

  if (location !== ALL) {
    chips.push({
      label: location,
      clear: () => setLocation(ALL),
    });
  }

  if (query.trim()) {
    chips.push({
      label: `"${query.trim()}"`,
      clear: () => setQuery(""),
    });
  }

  if (maxPrice < PRICE_MAX) {
    chips.push({
      label: `Up to ${CURRENCY}${maxPrice.toLocaleString("en-IN")}`,
      clear: () => setMaxPrice(PRICE_MAX),
    });
  }

  starFilter.forEach((s) =>
    chips.push({
      label: `${s} star${s > 1 ? "s" : ""}`,
      clear: () => toggleIn(setStarFilter, s),
    }),
  );

  if (ratingFilter) {
    chips.push({
      label: `Rating ${ratingFilter}+`,
      clear: () => setRatingFilter(0),
    });
  }

  typeFilter.forEach((t) =>
    chips.push({
      label: t,
      clear: () => toggleIn(setTypeFilter, t),
    }),
  );

  perkFilter.forEach((p) =>
    chips.push({
      label: p,
      clear: () => toggleIn(setPerkFilter, p),
    }),
  );

  /* ================================ CLEAR FILTERS ================================ */

  const clearFilters = () => {
    setLocation(ALL);
    setQuery("");
    setMaxPrice(PRICE_MAX);
    setStarFilter([]);
    setTypeFilter([]);
    setPerkFilter([]);
    setRatingFilter(0);
  };

  /* ================================ FILTER PANEL ================================ */

  const filterPanel = (
    <div className="hl-filters">
      <div className="hl-sec">
        <h4>Search hotel or area</h4>

        <div className="hl-input">
          <Search size={15} />

          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search hotels, areas..."
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="hl-sec">
        <h4>Destination</h4>

        <div className="hl-chipset">
          {[ALL, ...LOCATIONS].map((city) => (
            <button
              type="button"
              key={city}
              className={`hl-chip ${location === city ? "on" : ""}`}
              onClick={() => setLocation(city)}
            >
              {city}

              {city !== ALL && <em> {cityCounts[city]}</em>}
            </button>
          ))}
        </div>
      </div>

      <div className="hl-sec">
        <h4>Price per night</h4>

        <input
          type="range"
          min="500"
          max={PRICE_MAX}
          step="500"
          value={maxPrice}
          onChange={(event) => setMaxPrice(Number(event.target.value))}
          aria-label="Maximum price per night"
          style={{
            width: "100%",
          }}
        />

        <div className="hl-range-labels">
          <span>{CURRENCY}500</span>

          <span>
            Up to {CURRENCY}
            {maxPrice.toLocaleString("en-IN")}
            {maxPrice === PRICE_MAX ? "+" : ""}
          </span>
        </div>
      </div>

      <div className="hl-sec">
        <h4>Star rating</h4>

        {[5, 4, 3, 2, 1].map((star) => (
          <label
            key={star}
            className={`hl-check ${starFilter.includes(star) ? "on" : ""}`}
          >
            <input
              type="checkbox"
              checked={starFilter.includes(star)}
              onChange={() => toggleIn(setStarFilter, star)}
            />

            <span className="hl-box">
              <Check size={12} strokeWidth={3} />
            </span>

            <Stars n={star} size={13} />

            <span className="hl-count">
              {ALL_HOTELS.filter((h) => h.stars === star).length}
            </span>
          </label>
        ))}
      </div>

      <div className="hl-sec">
        <h4>Guest rating</h4>

        <div className="hl-chipset">
          {RATING_OPTIONS.map((option) => (
            <button
              type="button"
              key={option.value}
              className={`hl-chip ${ratingFilter === option.value ? "on" : ""}`}
              onClick={() =>
                setRatingFilter(
                  ratingFilter === option.value ? 0 : option.value,
                )
              }
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="hl-sec">
        <h4>Property type</h4>

        <div className="hl-chipset">
          {PROPERTY_TYPES.map((type) => (
            <button
              type="button"
              key={type}
              className={`hl-chip ${typeFilter.includes(type) ? "on" : ""}`}
              onClick={() => toggleIn(setTypeFilter, type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="hl-sec">
        <h4>Good to know</h4>

        <div className="hl-chipset">
          {PERKS.map((perk) => {
            const Icon = perk.icon;

            return (
              <button
                type="button"
                key={perk.key}
                className={`hl-chip ${
                  perkFilter.includes(perk.key) ? "on" : ""
                }`}
                onClick={() => toggleIn(setPerkFilter, perk.key)}
              >
                <Icon size={13} /> {perk.key}
              </button>
            );
          })}
        </div>
      </div>

      <button type="button" className="hl-clear-side" onClick={clearFilters}>
        Reset all filters
      </button>
    </div>
  );

  /* ================================ VIEW ================================ */

  return (
    <div className="hl-app">
      <SitePageHeader activePage="hotels" />

      <section className="hl-hero">
        <div className="hl-hero-inner">
          <h1>
            Find your perfect stay in <span>{locationTitle}</span>
          </h1>

          <p>
            Compare {ALL_HOTELS.length} hotels, resorts, villas and apartments
            in six popular destinations.
          </p>
        </div>
      </section>

      <div className="hl-searchwrap">
        <form className="hl-searchbar" onSubmit={handleSearchSubmit}>
          <div className="hl-seg grow hl-seg-location">
            <MapPin size={17} />

            <span className="hl-seg-body">
              <em>Where are you going?</em>

              <LocationPicker
                value={location}
                onChange={setLocation}
                counts={cityCounts}
                total={ALL_HOTELS.length}
              />
            </span>
          </div>

          <label className="hl-seg">
            <CalendarDays size={17} />

            <span className="hl-seg-body">
              <em>Check-in</em>

              <input
                type="date"
                min={today}
                value={checkIn}
                onChange={onCheckIn}
              />
            </span>
          </label>

          <label className="hl-seg">
            <CalendarDays size={17} />

            <span className="hl-seg-body">
              <em>Check-out</em>

              <input
                type="date"
                min={addDays(checkIn, 1)}
                value={checkOut}
                onChange={onCheckOut}
              />
            </span>
          </label>

          <label className="hl-seg hl-guest-seg">
            <Users size={17} />

            <span className="hl-seg-body">
              <em>Guests &amp; rooms</em>

              <span className="hl-seg-selects">
                <select
                  value={adults}
                  onChange={(event) => setAdults(Number(event.target.value))}
                  aria-label="Number of adults"
                >
                  {[1, 2, 3, 4, 5, 6].map((value) => (
                    <option key={value} value={value}>
                      {value} adult
                      {value > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>

                <select
                  value={children}
                  onChange={(event) => setChildren(Number(event.target.value))}
                  aria-label="Number of children"
                >
                  {[0, 1, 2, 3, 4, 5, 6].map((value) => (
                    <option key={value} value={value}>
                      {value} {value === 1 ? "child" : "children"}
                    </option>
                  ))}
                </select>

                <select
                  value={rooms}
                  onChange={(event) => setRooms(Number(event.target.value))}
                  aria-label="Number of rooms"
                >
                  {[1, 2, 3, 4].map((value) => (
                    <option key={value} value={value}>
                      {value} room
                      {value > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </span>
            </span>
          </label>

          <button type="submit" className="hl-search-btn">
            <Search size={17} /> Search
          </button>
        </form>
      </div>

      <main className="hl-main">
        <div className="hl-crumbs">
          <Link to="/">Home</Link>
          <ChevronRight size={12} />
          India
          <ChevronRight size={12} />
          <b>{locationTitle}</b>
        </div>

        <div className="hl-layout">
          <aside className="hl-side">{filterPanel}</aside>

          <section className="hl-results" ref={resultsRef}>
            <div className="hl-results-head">
              <div className="hl-results-title">
                <h1>
                  {locationTitle}: {sortedHotels.length}{" "}
                  {sortedHotels.length === 1 ? "property" : "properties"} found
                </h1>

                <p>
                  {nights} night
                  {nights > 1 ? "s" : ""} · {adults} adult
                  {adults > 1 ? "s" : ""} · {rooms} room
                  {rooms > 1 ? "s" : ""} · prices in Indian rupees
                </p>
              </div>

              <div className="hl-results-tools">
                <select
                  className="hl-sort-btn"
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  aria-label="Sort properties"
                >
                  {SORTS.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <div className="hl-viewseg">
                  <button
                    type="button"
                    className={view === "list" ? "on" : ""}
                    onClick={() => setView("list")}
                  >
                    <LayoutGrid size={14} /> List
                  </button>

                  <button
                    type="button"
                    className={view === "map" ? "on" : ""}
                    onClick={() => setView("map")}
                  >
                    <MapIcon size={14} /> Map
                  </button>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="hl-drawer-open"
              onClick={() => setDrawer(true)}
            >
              <SlidersHorizontal size={16} /> Filters
              {chips.length > 0 && (
                <span className="hl-filter-count">{chips.length}</span>
              )}
            </button>

            {chips.length > 0 && (
              <div className="hl-chips-row">
                {chips.map((chip, index) => (
                  <button
                    type="button"
                    key={`${chip.label}-${index}`}
                    className="hl-chip on"
                    onClick={chip.clear}
                  >
                    {chip.label} <X size={12} />
                  </button>
                ))}

                <button
                  type="button"
                  className="hl-clearall"
                  onClick={clearFilters}
                >
                  Clear all
                </button>
              </div>
            )}

            {view === "list" ? (
              <div className="hl-list">
                {sortedHotels.map((hotel) => (
                  <HotelCard
                    key={hotel.id}
                    hotel={hotel}
                    nights={nights}
                    adults={adults}
                    rooms={rooms}
                    wished={wish.includes(hotel.id)}
                    onWish={toggleWishlist}
                  />
                ))}

                {!sortedHotels.length && (
                  <div className="hl-empty">
                    <Search size={34} />

                    <h3>No properties found</h3>

                    <p>Try changing your destination or filters.</p>

                    <button type="button" onClick={clearFilters}>
                      Clear filters
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hl-map">
                <div className="hl-map-head">
                  <span>
                    <MapIcon size={15} /> {locationTitle} ·{" "}
                    {sortedHotels.length} properties
                  </span>
                </div>

                <div className="hl-map-canvas">
                  {sortedHotels.map((hotel) => (
                    <Link
                      key={hotel.id}
                      to={`/hotel/${hotel.id}`}
                      className="hl-pin"
                      title={hotel.name}
                      style={{
                        left: `${hotel.mapX}%`,
                        top: `${hotel.mapY}%`,
                      }}
                    >
                      {CURRENCY}
                      {hotel.price.toLocaleString("en-IN")}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {sortedHotels.length > 0 && (
              <p className="hl-showing">
                Showing {sortedHotels.length} of {ALL_HOTELS.length} properties
              </p>
            )}
          </section>
        </div>
      </main>

      <div className={`hl-drawer ${drawer ? "open" : ""}`}>
        <div className="hl-drawer-bg" onClick={() => setDrawer(false)} />

        <div className="hl-drawer-panel">
          <div className="hl-drawer-head">
            <strong>
              <SlidersHorizontal size={16} /> Filters
            </strong>

            <button
              type="button"
              onClick={() => setDrawer(false)}
              aria-label="Close filters"
            >
              <X size={18} />
            </button>
          </div>

          {filterPanel}

          <button
            type="button"
            className="hl-drawer-cta"
            onClick={() => setDrawer(false)}
          >
            Show {sortedHotels.length}{" "}
            {sortedHotels.length === 1 ? "property" : "properties"}
          </button>
        </div>
      </div>

      <AboutFooter activePage="hotels" />
    </div>
  );
}
