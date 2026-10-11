// src/pages/HotelDetailPage.jsx

import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  MapPin,
  Leaf,
  ShieldCheck,
  Banknote,
  Check,
  ChevronRight,
  ChevronLeft,
  X,
  Sparkles,
  BedDouble,
  Users,
  Maximize,
  ThumbsUp,
  CalendarDays,
  Clock,
  ArrowLeft,
  Heart,
  Baby,
  CreditCard,
  Info,
  Wifi,
  Dog,
} from 'lucide-react';

import {
  HOTELS,
  Stars,
  AMENITY_ICONS,
  CURRENCY,
} from './HotelList';

import './HotelDetailPage.css';

const API_BASE =
  import.meta.env.VITE_API_URL || 'http://localhost:5000';

const DAY = 86400000;

/* ============================================================
   DATE HELPERS
============================================================ */

const formatDate = (date) =>
  new Date(date).toISOString().slice(0, 10);

const formatDisplayDate = (isoDate) => {
  if (!isoDate) return '';

  const [year, month, day] = isoDate.split('-');

  return `${day}-${month}-${year}`;
};

/* ============================================================
   RATING
============================================================ */

const ratingLabel = (rating = 0) => {
  if (rating >= 9.2) return 'Exceptional';
  if (rating >= 8.8) return 'Wonderful';
  if (rating >= 8.2) return 'Excellent';
  if (rating >= 7.5) return 'Very good';

  return 'Good';
};

/* ============================================================
   FALLBACK ROOM
============================================================ */

const createFallbackRoom = (hotel, index = 0) => {
  const roomNames = [
    'Deluxe King Room',
    'Premium Family Room',
    'Executive Suite',
  ];

  const multipliers = [1, 1.35, 1.8];

  const price =
    Math.round(
      ((Number(hotel.price) || 0) * multipliers[index]) / 100,
    ) * 100;

  return {
    name: roomNames[index],
    bed:
      index === 1
        ? '1 king bed + sofa bed'
        : '1 king bed',

    guests: index === 1 ? 4 : 2,

    size: 32 + index * 18,

    price,

    img:
      hotel.gallery?.[index + 1] ||
      hotel.gallery?.[0] ||
      hotel.image ||
      '',

    benefits: [
      hotel.freeCancel
        ? 'Free cancellation before 24 hours'
        : 'Non-refundable rate',

      hotel.breakfast
        ? 'Breakfast included'
        : 'Breakfast available',

      hotel.payLater
        ? 'Pay at the property'
        : 'Secure online payment',
    ],
  };
};

/* ============================================================
   NORMALIZE HOTEL
============================================================ */

const normalizeHotel = (rawHotel) => {
  if (!rawHotel) return null;

  const gallery = Array.isArray(rawHotel.gallery)
    ? rawHotel.gallery.filter(Boolean)
    : [];

  const image =
    rawHotel.image ||
    gallery[0] ||
    '';

  const finalGallery =
    gallery.length > 0
      ? gallery
      : image
        ? [image]
        : [];

  const rooms =
    Array.isArray(rawHotel.rooms) &&
    rawHotel.rooms.length > 0
      ? rawHotel.rooms.map((room, index) => ({
          ...room,

          price:
            Number(room.price) ||
            Number(rawHotel.price) ||
            0,

          img:
            room.img ||
            finalGallery[
              index % Math.max(finalGallery.length, 1)
            ] ||
            image,

          benefits: Array.isArray(room.benefits)
            ? room.benefits
            : [],
        }))
      : [0, 1, 2].map((index) =>
          createFallbackRoom(
            {
              ...rawHotel,
              gallery: finalGallery,
              image,
            },
            index,
          ),
        );

  return {
    ...rawHotel,

    id: String(
      rawHotel.id ||
      rawHotel._id ||
      '',
    ),

    name:
      rawHotel.name ||
      'Unnamed property',

    city:
      rawHotel.city ||
      rawHotel.location ||
      'India',

    area:
      rawHotel.area ||
      '',

    type:
      rawHotel.type ||
      'Hotel',

    stars:
      Number(rawHotel.stars) ||
      3,

    rating:
      Number(rawHotel.rating) ||
      8,

    reviews:
      Number(rawHotel.reviews) ||
      0,

    price:
      Number(rawHotel.price) ||
      0,

    taxes:
      Number(rawHotel.taxes) ||
      Math.round(
        (Number(rawHotel.price) || 0) * 0.12,
      ),

    distance:
      Number(rawHotel.distance) ||
      0,

    address:
      rawHotel.address ||
      `${rawHotel.area || ''}, India`,

    desc:
      rawHotel.desc ||
      'Enjoy a comfortable stay with modern facilities, convenient surroundings and attentive service.',

    image,

    gallery: finalGallery,

    highlights:
      Array.isArray(rawHotel.highlights)
        ? rawHotel.highlights
        : [],

    amenities:
      Array.isArray(rawHotel.amenities)
        ? rawHotel.amenities
        : [],

    landmarks:
      Array.isArray(rawHotel.landmarks)
        ? rawHotel.landmarks
        : [],

    rooms,

    cats:
      rawHotel.cats ||
      {},

    guestReviews:
      Array.isArray(rawHotel.guestReviews)
        ? rawHotel.guestReviews
        : [],

    checkIn:
      rawHotel.checkIn ||
      '14:00 – 23:30',

    checkOut:
      rawHotel.checkOut ||
      '06:00 – 11:00',

    freeCancel:
      Boolean(rawHotel.freeCancel),

    noPrepay:
      Boolean(rawHotel.noPrepay),

    breakfast:
      Boolean(rawHotel.breakfast),

    payLater:
      Boolean(rawHotel.payLater),

    sustainable:
      Boolean(rawHotel.sustainable),
  };
};

/* ============================================================
   COMPONENT
============================================================ */

export default function HotelDetailPage() {
  const { id: rawId } = useParams();

  const id = decodeURIComponent(
    rawId || '',
  );

  /* ============================================================
     INITIAL HOTEL LOOKUP
     
     1. Search local HOTELS first.
     2. If not found, API lookup happens inside useEffect.
  ============================================================ */

  const [hotel, setHotel] = useState(() => {
    const localHotel = HOTELS.find(
      (item) =>
        String(item.id) === String(id),
    );

    return normalizeHotel(localHotel);
  });

  const [loading, setLoading] = useState(
    !hotel,
  );

  const [error, setError] = useState('');

  /* ============================================================
     BOOKING STATE
  ============================================================ */

  const [checkIn, setCheckIn] = useState(
    formatDate(Date.now() + DAY),
  );

  const [checkOut, setCheckOut] = useState(
    formatDate(Date.now() + DAY * 3),
  );

  const [adults, setAdults] = useState(2);

  const [rooms, setRooms] = useState(1);

  const [photo, setPhoto] = useState(0);

  const [lightbox, setLightbox] = useState(false);

  const [confirm, setConfirm] = useState(null);

  const [done, setDone] = useState(false);

  const [wish, setWish] = useState(false);

  /* ============================================================
     NIGHTS
  ============================================================ */

  const nights = Math.max(
    1,
    Math.round(
      (new Date(checkOut) -
        new Date(checkIn)) /
        DAY,
    ) || 1,
  );

  /* ============================================================
     UPDATED HOTEL LOOKUP
     
     Local hotel:
       HOTELS.find(...)
     
     API hotel:
       GET /api/hotels/:id
     
     API is called ONLY if the hotel
     doesn't exist in local HOTELS.
  ============================================================ */

  useEffect(() => {
    let cancelled = false;

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    const localHotel = HOTELS.find(
      (item) =>
        String(item.id) === String(id),
    );

    /* ----------------------------------------------------------
       LOCAL HOTEL FOUND
    ---------------------------------------------------------- */

    if (localHotel) {
      const normalizedLocalHotel =
        normalizeHotel(localHotel);

      setHotel(normalizedLocalHotel);
      setLoading(false);
      setError('');

      return undefined;
    }

    /* ----------------------------------------------------------
       LOCAL HOTEL NOT FOUND
       → FETCH FROM API
    ---------------------------------------------------------- */

    setLoading(true);
    setError('');
    setHotel(null);

    fetch(
      `${API_BASE}/api/hotels/${encodeURIComponent(id)}`,
    )
      .then(async (response) => {
        const data =
          await response
            .json()
            .catch(() => ({}));

        if (
          !response.ok ||
          !data.success ||
          !data.hotel
        ) {
          throw new Error(
            data.message ||
              'Property not found',
          );
        }

        return data.hotel;
      })

      .then((data) => {
        if (cancelled) return;

        setHotel(
          normalizeHotel(data),
        );

        setError('');
      })

      .catch((requestError) => {
        if (cancelled) return;

        setHotel(null);

        setError(
          requestError.message ||
            'Property not found',
        );
      })

      .finally(() => {
        if (cancelled) return;

        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  /* ============================================================
     WISHLIST
  ============================================================ */

  useEffect(() => {
    try {
      const wishlist = JSON.parse(
        localStorage.getItem(
          'tn_wishlist',
        ) || '[]',
      );

      setWish(
        wishlist.some(
          (item) =>
            String(item) ===
            String(id),
        ),
      );
    } catch {
      setWish(false);
    }
  }, [id]);

  /* ============================================================
     BODY LOCK
  ============================================================ */

  useEffect(() => {
    document.body.style.overflow =
      lightbox || confirm
        ? 'hidden'
        : '';

    return () => {
      document.body.style.overflow =
        '';
    };
  }, [lightbox, confirm]);

  /* ============================================================
     LIGHTBOX KEYBOARD CONTROL
  ============================================================ */

  useEffect(() => {
    if (
      !lightbox ||
      !hotel?.gallery?.length
    ) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setLightbox(false);
      }

      if (event.key === 'ArrowRight') {
        setPhoto(
          (current) =>
            (current + 1) %
            hotel.gallery.length,
        );
      }

      if (event.key === 'ArrowLeft') {
        setPhoto(
          (current) =>
            (current -
              1 +
              hotel.gallery.length) %
            hotel.gallery.length,
        );
      }
    };

    window.addEventListener(
      'keydown',
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        'keydown',
        handleKeyDown,
      );
    };
  }, [lightbox, hotel]);

  /* ============================================================
     SIMILAR HOTELS
  ============================================================ */

  const similarHotels = useMemo(() => {
    if (!hotel) return [];

    return HOTELS
      .filter((item) => {
        return (
          String(item.id) !==
            String(hotel.id) &&
          (
            item.city === hotel.city ||
            item.type === hotel.type ||
            item.area === hotel.area
          )
        );
      })
      .sort(
        (a, b) =>
          Number(b.rating || 0) -
          Number(a.rating || 0),
      )
      .slice(0, 3)
      .map(normalizeHotel);
  }, [hotel]);

  /* ============================================================
     PRICE HELPERS
  ============================================================ */

  const taxesForRoom = (price) =>
    Math.round(
      Number(price || 0) * 0.12,
    );

  const total =
    (
      Number(hotel?.price) +
      Number(hotel?.taxes || 0)
    ) * nights;

  /* ============================================================
     WISHLIST TOGGLE
  ============================================================ */

  const toggleWish = () => {
    if (!hotel) return;

    setWish((current) => {
      const nextValue = !current;

      let wishlist = [];

      try {
        wishlist = JSON.parse(
          localStorage.getItem(
            'tn_wishlist',
          ) || '[]',
        );
      } catch {
        wishlist = [];
      }

      const nextWishlist = nextValue
        ? [
            ...new Set([
              ...wishlist.map(String),
              String(hotel.id),
            ]),
          ]
        : wishlist.filter(
            (item) =>
              String(item) !==
              String(hotel.id),
          );

      localStorage.setItem(
        'tn_wishlist',
        JSON.stringify(nextWishlist),
      );

      return nextValue;
    });
  };

  /* ============================================================
     RESERVATION
  ============================================================ */

  const reserve = (roomName) => {
    setConfirm(roomName);
    setDone(false);
  };

  /* ============================================================
     PHOTO
  ============================================================ */

  const openPhoto = (index) => {
    setPhoto(index);
    setLightbox(true);
  };

  /* ============================================================
     SCROLL TO ROOMS
  ============================================================ */

  const scrollToRooms = () => {
    document
      .getElementById('dp-rooms')
      ?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
  };

  /* ============================================================
     CHECK-IN CHANGE
  ============================================================ */

  const handleCheckInChange = (
    value,
  ) => {
    setCheckIn(value);

    if (
      new Date(checkOut) <=
      new Date(value)
    ) {
      setCheckOut(
        formatDate(
          new Date(value).getTime() +
            DAY,
        ),
      );
    }
  };

  /* ============================================================
     LOADING
  ============================================================ */

  if (loading) {
    return (
      <div className="dp-404">
        <h1>Loading property...</h1>

        <p>
          Please wait while we load
          the hotel details.
        </p>
      </div>
    );
  }

  /* ============================================================
     NOT FOUND
  ============================================================ */

  if (!hotel) {
    return (
      <div className="dp-404">
        <h1>Property not found</h1>

        <p>
          {error ||
            'The selected property is no longer available.'}
        </p>

        <Link
          to="/"
          className="dp-404-btn"
        >
          Back to hotels
        </Link>
      </div>
    );
  }

  /* ============================================================
     GALLERY
  ============================================================ */

  const gallery =
    hotel.gallery.length > 0
      ? hotel.gallery
      : [hotel.image];

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <div className="dp-app">

      {/* ======================================================
          SUB NAV
      ====================================================== */}

      <nav className="dp-subnav">
        <div className="dp-subnav-inner">

          <Link
            to="/"
            className="dp-back"
          >
            <ArrowLeft size={15} />
            <span>
              Back to hotels
            </span>
          </Link>

          <div className="dp-subnav-links">
            <a href="#dp-overview">
              Overview
            </a>

            <a href="#dp-rooms">
              Rooms
            </a>

            <a href="#dp-amenities">
              Facilities
            </a>

            <a href="#dp-reviews">
              Reviews
            </a>

            <a href="#dp-location">
              Location
            </a>

            <a href="#dp-policies">
              Policies
            </a>
          </div>

          <div className="dp-subnav-cta">
            <span>
              from{' '}
              <b>
                {CURRENCY}
                {hotel.price.toLocaleString()}
              </b>{' '}
              / night
            </span>

            <button
              type="button"
              onClick={scrollToRooms}
            >
              View rooms
            </button>
          </div>
        </div>
      </nav>

      {/* ======================================================
          MAIN
      ====================================================== */}

      <main className="dp-main">

        {/* ====================================================
            GALLERY
        ==================================================== */}

        <div className="dp-gallery">

          <button
            className="dp-g-main"
            onClick={() =>
              openPhoto(0)
            }
          >
            <img
              src={gallery[0]}
              alt={hotel.name}
            />

            <span className="dp-g-all">
              View all photos
            </span>
          </button>

          <div className="dp-g-side">
            {gallery
              .slice(1, 5)
              .map(
                (
                  image,
                  index,
                ) => (
                  <button
                    key={`${image}-${index}`}
                    onClick={() =>
                      openPhoto(
                        index + 1,
                      )
                    }
                  >
                    <img
                      src={image}
                      alt={`${hotel.name} ${
                        index + 2
                      }`}
                      loading="lazy"
                    />
                  </button>
                ),
              )}
          </div>
        </div>

        {/* ====================================================
            TITLE BAR
        ==================================================== */}

        <div className="dp-titlebar">

          <div className="dp-title-left">

            <div className="dp-crumb">
              <Link to="/">
                {hotel.city}
              </Link>

              <ChevronRight size={12} />

              <span>
                {hotel.area}
              </span>
            </div>

            <h1>{hotel.name}</h1>

            <div className="dp-subline">

              <Stars
                n={hotel.stars}
                size={15}
              />

              <span className="dp-ptype">
                {hotel.type}
              </span>

              <span className="dp-addr">
                <MapPin size={14} />
                {hotel.address}
              </span>

            </div>

            <div className="dp-usps">

              {hotel.sustainable && (
                <span className="dp-usp green">
                  <Leaf size={13} />
                  Sustainable property
                </span>
              )}

              {hotel.freeCancel && (
                <span className="dp-usp green">
                  <ShieldCheck size={13} />
                  Free cancellation
                </span>
              )}

              {hotel.noPrepay && (
                <span className="dp-usp">
                  <Banknote size={13} />
                  No prepayment
                </span>
              )}

              {hotel.breakfast && (
                <span className="dp-usp">
                  <Sparkles size={13} />
                  Breakfast included
                </span>
              )}

            </div>
          </div>

          <div className="dp-title-actions">

            <div className="dp-title-rating">

              <span className="dp-score">
                {hotel.rating.toFixed(1)}
              </span>

              <div className="dp-score-txt">
                <b>
                  {ratingLabel(
                    hotel.rating,
                  )}
                </b>

                <span>
                  {hotel.reviews.toLocaleString()}{' '}
                  verified reviews
                </span>
              </div>

            </div>

            <button
              className={`dp-wish-button ${
                wish ? 'on' : ''
              }`}
              onClick={toggleWish}
              aria-label="Save hotel"
            >
              <Heart
                size={18}
                fill={
                  wish
                    ? 'currentColor'
                    : 'none'
                }
              />
            </button>

          </div>
        </div>

        {/* ====================================================
            CONTENT LAYOUT
        ==================================================== */}

        <div className="dp-layout">

          <div className="dp-content">

            {/* ==================================================
                OVERVIEW
            ================================================== */}

            <section
              id="dp-overview"
              className="dp-sec"
            >
              <h2>
                Property overview
              </h2>

              <p className="dp-desc">
                {hotel.desc}
              </p>

              <div className="dp-highlights">
                {hotel.highlights.map(
                  (highlight) => (
                    <div
                      key={highlight}
                    >
                      <Sparkles size={14} />
                      <span>
                        {highlight}
                      </span>
                    </div>
                  ),
                )}
              </div>

              <div className="dp-facts">

                <div>
                  <CalendarDays size={17} />
                  <b>Check-in</b>
                  <span>
                    {hotel.checkIn}
                  </span>
                </div>

                <div>
                  <CalendarDays size={17} />
                  <b>Check-out</b>
                  <span>
                    {hotel.checkOut}
                  </span>
                </div>

                <div>
                  <MapPin size={17} />
                  <b>
                    Distance from centre
                  </b>
                  <span>
                    {hotel.distance} km
                  </span>
                </div>

                <div>
                  <Wifi size={17} />
                  <b>WiFi</b>
                  <span>
                    Free throughout
                  </span>
                </div>

              </div>
            </section>

            {/* ==================================================
                ROOMS
            ================================================== */}

            <section
              id="dp-rooms"
              className="dp-sec"
            >
              <h2>
                Choose your room
              </h2>

              <p className="dp-sec-sub">
                Prices shown for {nights}{' '}
                night
                {nights > 1
                  ? 's'
                  : ''}
                , {adults}{' '}
                adult
                {adults > 1
                  ? 's'
                  : ''}
                , {rooms}{' '}
                room
                {rooms > 1
                  ? 's'
                  : ''}
                .
              </p>

              <div className="dp-rooms">

                {hotel.rooms.map(
                  (room) => {
                    const roomTaxes =
                      taxesForRoom(
                        room.price,
                      );

                    const roomTotal =
                      (
                        Number(
                          room.price,
                        ) +
                        roomTaxes
                      ) * nights;

                    return (
                      <div
                        className="dp-room"
                        key={
                          room.name
                        }
                      >

                        <div className="dp-room-media">
                          <img
                            src={
                              room.img ||
                              hotel.image
                            }
                            alt={
                              room.name
                            }
                            loading="lazy"
                          />
                        </div>

                        <div className="dp-room-info">

                          <h3>
                            {room.name}
                          </h3>

                          <div className="dp-room-meta">

                            <span>
                              <BedDouble
                                size={15}
                              />
                              {room.bed}
                            </span>

                            <span>
                              <Users
                                size={15}
                              />
                              Sleeps{' '}
                              {
                                room.guests
                              }
                            </span>

                            <span>
                              <Maximize
                                size={15}
                              />
                              {
                                room.size
                              }{' '}
                              m²
                            </span>

                          </div>

                          <ul className="dp-room-benefits">

                            {(
                              room.benefits ||
                              []
                            ).map(
                              (
                                benefit,
                              ) => {

                                const isFree =
                                  benefit
                                    .toLowerCase()
                                    .includes(
                                      'free',
                                    );

                                return (
                                  <li
                                    key={
                                      benefit
                                    }
                                    className={
                                      isFree
                                        ? 'ok'
                                        : ''
                                    }
                                  >
                                    {isFree ? (
                                      <ShieldCheck
                                        size={
                                          13
                                        }
                                      />
                                    ) : (
                                      <Info
                                        size={
                                          13
                                        }
                                      />
                                    )}

                                    {
                                      benefit
                                    }
                                  </li>
                                );
                              },
                            )}

                          </ul>
                        </div>

                        <div className="dp-room-price">

                          <span className="dp-room-p">
                            {CURRENCY}
                            {Number(
                              room.price,
                            ).toLocaleString()}

                            <em>
                              {' '}
                              / night
                            </em>
                          </span>

                          <span className="dp-room-tax">
                            + {CURRENCY}
                            {roomTaxes.toLocaleString()}{' '}
                            taxes & fees
                          </span>

                          <span className="dp-room-total">
                            {CURRENCY}
                            {roomTotal.toLocaleString()}{' '}
                            total
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              reserve(
                                room.name,
                              )
                            }
                          >
                            Reserve
                          </button>

                        </div>
                      </div>
                    );
                  },
                )}

              </div>
            </section>

            {/* ==================================================
                AMENITIES
            ================================================== */}

            <section
              id="dp-amenities"
              className="dp-sec"
            >
              <h2>
                Facilities & amenities
              </h2>

              <div className="dp-amen-grid">

                {hotel.amenities.map(
                  (amenity) => {
                    const Icon =
                      AMENITY_ICONS[
                        amenity
                      ] || Check;

                    return (
                      <div
                        key={amenity}
                      >
                        <Icon size={16} />
                        {amenity}
                      </div>
                    );
                  },
                )}

              </div>
            </section>

            {/* ==================================================
                REVIEWS
            ================================================== */}

            <section
              id="dp-reviews"
              className="dp-sec"
            >
              <h2>
                Guest reviews
              </h2>

              <div className="dp-reviews-top">

                <div className="dp-score-big">

                  <span className="dp-score-big-num">
                    {hotel.rating.toFixed(
                      1,
                    )}
                  </span>

                  <b>
                    {ratingLabel(
                      hotel.rating,
                    )}
                  </b>

                  <span className="dp-score-big-rev">
                    {hotel.reviews.toLocaleString()}{' '}
                    reviews
                  </span>

                </div>

                <div className="dp-cats">

                  {Object.entries(
                    hotel.cats || {},
                  ).map(
                    ([key, value]) => (
                      <div
                        className="dp-cat"
                        key={key}
                      >

                        <span className="dp-cat-name">
                          {key}
                        </span>

                        <div className="dp-cat-bar">
                          <i
                            style={{
                              width: `${
                                Number(
                                  value,
                                ) * 10
                              }%`,
                            }}
                          />
                        </div>

                        <b>
                          {Number(
                            value,
                          ).toFixed(1)}
                        </b>

                      </div>
                    ),
                  )}

                </div>
              </div>

              <div className="dp-review-list">

                {hotel.guestReviews.map(
                  (
                    review,
                    index,
                  ) => (
                    <div
                      className="dp-review"
                      key={`${review.name}-${index}`}
                    >

                      <div className="dp-review-head">

                        <span className="dp-avatar">
                          {review.name?.[0] ||
                            'G'}
                        </span>

                        <div className="dp-review-who">
                          <b>
                            {
                              review.name
                            }
                          </b>

                          <span>
                            {
                              review.country
                            }
                          </span>
                        </div>

                        <span className="dp-review-score">
                          {Number(
                            review.score,
                          ).toFixed(1)}
                        </span>

                      </div>

                      <div className="dp-review-title">
                        <ThumbsUp size={13} />
                        {
                          review.title
                        }
                      </div>

                      <p>
                        {
                          review.comment
                        }
                      </p>

                      <span className="dp-review-date">
                        {review.date} ·
                        Verified stay
                      </span>

                    </div>
                  ),
                )}

              </div>
            </section>

            {/* ==================================================
                LOCATION
            ================================================== */}

            <section
              id="dp-location"
              className="dp-sec"
            >
              <h2>
                Location & surroundings
              </h2>

              <div className="dp-loc">

                <div className="dp-loc-map">

                  <span className="dp-loc-pin">
                    <MapPin size={22} />
                  </span>

                  <span className="dp-loc-name">
                    {hotel.city}
                  </span>

                </div>

                <ul className="dp-landmarks">

                  {hotel.landmarks.map(
                    (landmark) => (
                      <li
                        key={
                          landmark.name
                        }
                      >
                        <MapPin
                          size={14}
                        />

                        <span>
                          {
                            landmark.name
                          }
                        </span>

                        <b>
                          {
                            landmark.d
                          }
                        </b>
                      </li>
                    ),
                  )}

                  <li>
                    <MapPin
                      size={14}
                    />

                    <span>
                      City centre
                    </span>

                    <b>
                      {hotel.distance}{' '}
                      km
                    </b>
                  </li>

                </ul>
              </div>
            </section>

            {/* ==================================================
                POLICIES
            ================================================== */}

            <section
              id="dp-policies"
              className="dp-sec"
            >
              <h2>
                House rules
              </h2>

              <div className="dp-pol-grid">

                <div>
                  <Clock size={16} />
                  <b>Check-in</b>
                  <span>
                    {hotel.checkIn}
                  </span>
                </div>

                <div>
                  <Clock size={16} />
                  <b>Check-out</b>
                  <span>
                    {hotel.checkOut}
                  </span>
                </div>

                <div>
                  <ShieldCheck size={16} />
                  <b>
                    Cancellation
                  </b>
                  <span>
                    {hotel.freeCancel
                      ? 'Free cancellation before 24 hours'
                      : 'Cancellation rules vary by room'}
                  </span>
                </div>

                <div>
                  <Baby size={16} />
                  <b>
                    Children
                  </b>
                  <span>
                    Children of all ages
                    are welcome.
                  </span>
                </div>

                <div>
                  <Dog size={16} />
                  <b>Pets</b>
                  <span>
                    Pets are allowed only
                    on request.
                  </span>
                </div>

                <div>
                  <CreditCard size={16} />
                  <b>
                    Payment
                  </b>
                  <span>
                    Cards, UPI and cash
                    accepted.
                  </span>
                </div>

              </div>
            </section>

          </div>

          {/* ====================================================
              BOOKING WIDGET
          ==================================================== */}

          <aside className="dp-widget">

            <div className="dp-widget-card">

              <div className="dp-widget-head">

                <span className="dp-widget-price">
                  <em>from</em>

                  <b>
                    {CURRENCY}
                    {hotel.price.toLocaleString()}
                  </b>

                  <em>
                    / night
                  </em>
                </span>

                <span className="dp-widget-rating">

                  <span className="dp-widget-score">
                    {hotel.rating.toFixed(
                      1,
                    )}
                  </span>

                  {ratingLabel(
                    hotel.rating,
                  )}

                </span>

              </div>

              {/* ==================================================
                  DATES
              ================================================== */}

              <div className="dp-widget-dates">

                <label className="dp-date-field">

                  <em>
                    Check-in
                  </em>

                  <div className="dp-date-box">

                    <span>
                      {formatDisplayDate(
                        checkIn,
                      )}
                    </span>

                    <CalendarDays
                      size={16}
                    />

                    <input
                      type="date"
                      value={checkIn}
                      min={formatDate(
                        Date.now(),
                      )}
                      onChange={(event) =>
                        handleCheckInChange(
                          event.target
                            .value,
                        )
                      }
                      aria-label="Check-in date"
                    />

                  </div>
                </label>

                <label className="dp-date-field">

                  <em>
                    Check-out
                  </em>

                  <div className="dp-date-box">

                    <span>
                      {formatDisplayDate(
                        checkOut,
                      )}
                    </span>

                    <CalendarDays
                      size={16}
                    />

                    <input
                      type="date"
                      value={checkOut}
                      min={formatDate(
                        new Date(
                          checkIn,
                        ).getTime() +
                          DAY,
                      )}
                      onChange={(event) =>
                        setCheckOut(
                          event.target
                            .value,
                        )
                      }
                      aria-label="Check-out date"
                    />

                  </div>
                </label>

                {/* ==================================================
                    GUESTS
                ================================================== */}

                <label className="dp-guests-field">

                  <em>
                    Guests
                  </em>

                  <div className="dp-guests-box">

                    <div className="dp-guest-select">

                      <select
                        value={adults}
                        onChange={(event) =>
                          setAdults(
                            Number(
                              event.target
                                .value,
                            ),
                          )
                        }
                        aria-label="Number of adults"
                      >
                        {[1, 2, 3, 4, 5, 6].map(
                          (value) => (
                            <option
                              key={value}
                              value={
                                value
                              }
                            >
                              {value}{' '}
                              adult
                              {value >
                              1
                                ? 's'
                                : ''}
                            </option>
                          ),
                        )}
                      </select>

                    </div>

                    <div className="dp-guest-select">

                      <select
                        value={rooms}
                        onChange={(event) =>
                          setRooms(
                            Number(
                              event.target
                                .value,
                            ),
                          )
                        }
                        aria-label="Number of rooms"
                      >
                        {[1, 2, 3, 4].map(
                          (value) => (
                            <option
                              key={value}
                              value={
                                value
                              }
                            >
                              {value}{' '}
                              room
                              {value >
                              1
                                ? 's'
                                : ''}
                            </option>
                          ),
                        )}
                      </select>

                    </div>

                  </div>
                </label>

              </div>

              {/* ==================================================
                  BILL
              ================================================== */}

              <div className="dp-widget-bill">

                <div>
                  <span>
                    {CURRENCY}
                    {hotel.price.toLocaleString()}{' '}
                    × {nights}{' '}
                    night
                    {nights >
                    1
                      ? 's'
                      : ''}
                  </span>

                  <span>
                    {CURRENCY}
                    {(
                      hotel.price *
                      nights
                    ).toLocaleString()}
                  </span>
                </div>

                <div>
                  <span>
                    Taxes & fees
                  </span>

                  <span>
                    {CURRENCY}
                    {(
                      hotel.taxes *
                      nights
                    ).toLocaleString()}
                  </span>
                </div>

                <div className="dp-widget-total">

                  <span>
                    Total
                  </span>

                  <span>
                    {CURRENCY}
                    {total.toLocaleString()}
                  </span>

                </div>

              </div>

              {/* ==================================================
                  RESERVE
              ================================================== */}

              <button
                type="button"
                className="dp-widget-btn"
                onClick={() =>
                  reserve(
                    'Best available room',
                  )
                }
              >
                Reserve now
              </button>

              <p className="dp-widget-note">

                <ShieldCheck size={14} />

                {hotel.freeCancel
                  ? 'Free cancellation before 24 hours'
                  : 'Cancellation rules vary by room'}

              </p>

              <p className="dp-widget-note">

                <Banknote size={14} />

                {hotel.payLater
                  ? 'Pay at the property'
                  : 'Secure online payment'}

              </p>

            </div>
          </aside>
        </div>

        {/* ======================================================
            SIMILAR HOTELS
        ====================================================== */}

        {similarHotels.length >
          0 && (
          <section className="dp-similar">

            <h2>
              Guests also considered
            </h2>

            <div className="dp-similar-grid">

              {similarHotels.map(
                (item) => (
                  <Link
                    to={`/hotel/${encodeURIComponent(
                      String(item.id),
                    )}`}
                    className="dp-sim-card"
                    key={item.id}
                  >

                    <div className="dp-sim-media">

                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                      />

                    </div>

                    <div className="dp-sim-body">

                      <h3>
                        {item.name}
                      </h3>

                      <Stars
                        n={item.stars}
                        size={12}
                      />

                      <span className="dp-sim-loc">

                        <MapPin size={12} />

                        {item.area} ·{' '}
                        {
                          item.distance
                        }{' '}
                        km from centre

                      </span>

                      <div className="dp-sim-foot">

                        <span className="dp-sim-score">

                          {item.rating.toFixed(
                            1,
                          )}{' '}

                          <em>
                            {ratingLabel(
                              item.rating,
                            )}
                          </em>

                        </span>

                        <span className="dp-sim-price">

                          {CURRENCY}
                          {item.price.toLocaleString()}{' '}

                          <em>
                            / night
                          </em>

                        </span>

                      </div>
                    </div>
                  </Link>
                ),
              )}

            </div>
          </section>
        )}

      </main>

      {/* ========================================================
          MOBILE BAR
      ======================================================== */}

      <div className="dp-mbar">

        <div className="dp-mbar-price">

          <b>
            {CURRENCY}
            {hotel.price.toLocaleString()}
          </b>{' '}
          / night

          <span>
            + {CURRENCY}
            {hotel.taxes.toLocaleString()}{' '}
            taxes · {CURRENCY}
            {total.toLocaleString()}{' '}
            total
          </span>

        </div>

        <button
          type="button"
          onClick={scrollToRooms}
        >
          Choose a room
        </button>

      </div>

      {/* ========================================================
          LIGHTBOX
      ======================================================== */}

      {lightbox && (
        <div
          className="dp-lightbox"
          onClick={() =>
            setLightbox(false)
          }
        >

          <button
            className="dp-lb-close"
            onClick={() =>
              setLightbox(false)
            }
            aria-label="Close gallery"
          >
            <X size={20} />
          </button>

          <button
            className="dp-lb-prev"
            onClick={(event) => {
              event.stopPropagation();

              setPhoto(
                (current) =>
                  (current -
                    1 +
                    gallery.length) %
                  gallery.length,
              );
            }}
            aria-label="Previous photo"
          >
            <ChevronLeft size={26} />
          </button>

          <img
            src={gallery[photo]}
            alt={hotel.name}
            onClick={(event) =>
              event.stopPropagation()
            }
          />

          <button
            className="dp-lb-next"
            onClick={(event) => {
              event.stopPropagation();

              setPhoto(
                (current) =>
                  (current + 1) %
                  gallery.length,
              );
            }}
            aria-label="Next photo"
          >
            <ChevronRight size={26} />
          </button>

          <div className="dp-lb-count">
            {photo + 1} /{' '}
            {gallery.length}
          </div>

          <div
            className="dp-lb-thumbs"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {gallery.map(
              (
                image,
                index,
              ) => (
                <button
                  key={`${image}-${index}`}
                  className={
                    index === photo
                      ? 'on'
                      : ''
                  }
                  onClick={() =>
                    setPhoto(index)
                  }
                >
                  <img
                    src={image}
                    alt=""
                  />
                </button>
              ),
            )}
          </div>

        </div>
      )}

      {/* ========================================================
          BOOKING MODAL
      ======================================================== */}

      {confirm && (
        <div
          className="dp-modal"
          onClick={() =>
            setConfirm(null)
          }
        >

          <div
            className="dp-modal-card"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {!done ? (
              <>
                <div className="dp-modal-head">

                  <h3>
                    Confirm your booking
                  </h3>

                  <button
                    onClick={() =>
                      setConfirm(null)
                    }
                    aria-label="Close"
                  >
                    <X size={18} />
                  </button>

                </div>

                <div className="dp-modal-body">

                  <div className="dp-modal-hotel">

                    <img
                      src={hotel.image}
                      alt={hotel.name}
                    />

                    <div>

                      <b>
                        {hotel.name}
                      </b>

                      <span>
                        {hotel.city} ·{' '}
                        {hotel.type} ·{' '}
                        {hotel.stars}{' '}
                        stars
                      </span>

                    </div>
                  </div>

                  <dl className="dp-modal-rows">

                    <div>
                      <dt>
                        Room
                      </dt>

                      <dd>
                        {confirm}
                      </dd>
                    </div>

                    <div>
                      <dt>
                        Check-in
                      </dt>

                      <dd>
                        {formatDisplayDate(
                          checkIn,
                        )}
                      </dd>
                    </div>

                    <div>
                      <dt>
                        Check-out
                      </dt>

                      <dd>
                        {formatDisplayDate(
                          checkOut,
                        )}
                      </dd>
                    </div>

                    <div>
                      <dt>
                        Guests
                      </dt>

                      <dd>
                        {adults}{' '}
                        adult
                        {adults >
                        1
                          ? 's'
                          : ''}
                        , {rooms}{' '}
                        room
                        {rooms >
                        1
                          ? 's'
                          : ''}
                      </dd>
                    </div>

                    <div>
                      <dt>
                        Stay
                      </dt>

                      <dd>
                        {nights}{' '}
                        night
                        {nights >
                        1
                          ? 's'
                          : ''}
                      </dd>
                    </div>

                  </dl>

                  <div className="dp-modal-total">

                    <span>
                      Total incl. taxes
                    </span>

                    <b>
                      {CURRENCY}
                      {total.toLocaleString()}
                    </b>

                  </div>

                </div>

                <div className="dp-modal-foot">

                  <button
                    className="ghost"
                    onClick={() =>
                      setConfirm(null)
                    }
                  >
                    Keep browsing
                  </button>

                  <button
                    className="solid"
                    onClick={() =>
                      setDone(true)
                    }
                  >
                    Confirm booking
                  </button>

                </div>
              </>
            ) : (
              <div className="dp-modal-done">

                <span className="dp-done-ic">
                  <Check
                    size={44}
                    strokeWidth={2.5}
                  />
                </span>

                <h3>
                  Booking confirmed!
                </h3>

                <p>
                  {hotel.name}
                </p>

                <div className="dp-done-row">

                  <span>
                    Check-in
                  </span>

                  <b>
                    {formatDisplayDate(
                      checkIn,
                    )}
                  </b>

                </div>

                <div className="dp-done-row">

                  <span>
                    Check-out
                  </span>

                  <b>
                    {formatDisplayDate(
                      checkOut,
                    )}
                  </b>

                </div>

                <div className="dp-done-row">

                  <span>
                    Confirmation number
                  </span>

                  <b>
                    TN-
                    {hotel.id
                      .slice(0, 6)
                      .toUpperCase()}
                  </b>

                </div>

                <div className="dp-modal-foot center">

                  <button
                    className="ghost"
                    onClick={() =>
                      setConfirm(null)
                    }
                  >
                    Close
                  </button>

                  <Link
                    className="solid"
                    to="/"
                    onClick={() =>
                      setConfirm(null)
                    }
                  >
                    Back to search
                  </Link>

                </div>

              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}