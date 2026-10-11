// src/pages/AdminPanel.jsx

import React, { useRef, useState } from 'react';
import {
  Hotel as HotelIcon, MapPin, Star, DollarSign, Image as ImageIcon, Plus, Trash2,
  Sparkles, BedDouble, ListChecks, ShieldCheck, Landmark, CheckCircle2, AlertCircle,
  Loader2, Building2, FileText, Video, UploadCloud, Compass,
} from 'lucide-react';
import './AdminPanel.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const LOCATIONS = [
  { city: 'Pondicherry', state: 'Tamil Nadu' },
  { city: 'Munnar', state: 'Kerala' },
  { city: 'Ooty', state: 'Tamil Nadu' },
  { city: 'Coimbatore', state: 'Tamil Nadu' },
  { city: 'Bangalore', state: 'Karnataka' },
  { city: 'Hyderabad', state: 'Telangana' },
];

const AMENITY_LIST = [
  'Free WiFi', 'Swimming pool', 'Spa & wellness centre', 'Free parking', 'Fitness centre',
  'Restaurant', 'Bar', 'Room service', 'Airport shuttle', 'Family rooms', 'Pet friendly',
  'Beachfront', '24-hour front desk', 'Business centre', 'Terrace', 'Laundry',
  'EV charging station', 'Kitchenette', 'Private pool', 'Non-smoking rooms',
  'Water park access', 'Air conditioning', 'Shared lounge', 'Garden',
];

const PROPERTY_TYPES = ['Hotel', 'Resort', 'Apartment', 'Villa', 'Hostel'];

const DEAL_OPTIONS = [
  { v: '', label: 'No badge' },
  { v: 'limited', label: 'Limited-time deal' },
  { v: 'genius', label: '10% Genius deal' },
  { v: 'new', label: 'Newly opened' },
];

const MAX_GALLERY = 10;
const MAX_VIDEOS = 2;

const emptyRoom = () => ({
  name: '',
  bed: '',
  guests: 2,
  size: 30,
  price: '',
  img: '',
  benefits: '',
});

const emptyLandmark = () => ({
  name: '',
  d: '',
});

const initialForm = {
  name: '',
  city: 'Pondicherry',
  area: '',
  type: 'Hotel',
  stars: 5,
  rating: 8.5,
  price: '',
  oldPrice: '',
  taxes: '',
  distance: '',
  deal: '',
  breakfast: false,
  freeCancel: true,
  payLater: false,
  noPrepay: false,
  sustainable: false,
  address: '',
  checkIn: '14:00 – 23:30',
  checkOut: '06:00 – 11:00',
  desc: '',
};

const STEPS = [
  { id: 'basic', label: 'Basic information', icon: FileText },
  { id: 'pricing', label: 'Pricing & distance', icon: DollarSign },
  { id: 'policies', label: 'Policies', icon: ShieldCheck },
  { id: 'highlights', label: 'Highlights', icon: Sparkles },
  { id: 'amenities', label: 'Amenities', icon: ListChecks },
  { id: 'landmarks', label: 'Nearby landmarks', icon: Landmark },
  { id: 'media', label: 'Photos & videos', icon: ImageIcon },
  { id: 'rooms', label: 'Room types', icon: BedDouble },
];

const revoke = (item) => item?.preview && URL.revokeObjectURL(item.preview);

export default function AdminPanel() {
  const [form, setForm] = useState(initialForm);
  const [highlights, setHighlights] = useState(['']);
  const [amenities, setAmenities] = useState([]);
  const [landmarks, setLandmarks] = useState([emptyLandmark()]);
  const [rooms, setRooms] = useState([emptyRoom()]);

  const [cover, setCover] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [videos, setVideos] = useState([]);
  const [dragTarget, setDragTarget] = useState('');

  const [status, setStatus] = useState({
    state: 'idle',
    message: '',
  });

  const coverInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const selectedLocation = LOCATIONS.find((item) => item.city === form.city);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const toggleAmenity = (a) =>
    setAmenities((cur) => (cur.includes(a) ? cur.filter((x) => x !== a) : [...cur, a]));

  const updateList = (list, setList, i, key, val) => {
    const next = [...list];
    next[i] = key ? { ...next[i], [key]: val } : val;
    setList(next);
  };

  const setCoverFile = (fileList) => {
    const file = Array.from(fileList || []).find((f) => f.type.startsWith('image/'));
    if (!file) return;
    if (cover) revoke(cover);
    setCover({ file, preview: URL.createObjectURL(file) });
  };

  const removeCover = () => {
    if (cover) revoke(cover);
    setCover(null);
  };

  const addGalleryFiles = (fileList) => {
    const incoming = Array.from(fileList || []).filter((f) => f.type.startsWith('image/'));
    if (!incoming.length) return;

    setGallery((cur) => {
      const room = MAX_GALLERY - cur.length;
      if (room <= 0) return cur;
      const toAdd = incoming.slice(0, room).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      return [...cur, ...toAdd];
    });
  };

  const removeGalleryFile = (i) => {
    setGallery((cur) => {
      revoke(cur[i]);
      return cur.filter((_, x) => x !== i);
    });
  };

  const addVideoFiles = (fileList) => {
    const incoming = Array.from(fileList || []).filter((f) => f.type.startsWith('video/'));
    if (!incoming.length) return;

    setVideos((cur) => {
      const room = MAX_VIDEOS - cur.length;
      if (room <= 0) return cur;
      const toAdd = incoming.slice(0, room).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      return [...cur, ...toAdd];
    });
  };

  const removeVideoFile = (i) => {
    setVideos((cur) => {
      revoke(cur[i]);
      return cur.filter((_, x) => x !== i);
    });
  };

  const onDrop = (kind, handler) => (e) => {
    e.preventDefault();
    setDragTarget('');
    handler(e.dataTransfer.files);
  };

  const resetForm = () => {
    setForm(initialForm);
    setHighlights(['']);
    setAmenities([]);
    setLandmarks([emptyLandmark()]);
    setRooms([emptyRoom()]);

    if (cover) revoke(cover);
    gallery.forEach(revoke);
    videos.forEach(revoke);

    setCover(null);
    setGallery([]);
    setVideos([]);
  };

  const validate = () => {
    if (!form.name.trim()) return 'Hotel name is required';
    if (!form.city) return 'Location is required';
    if (!form.area.trim()) return 'Area / neighbourhood is required';
    if (!form.address.trim()) return 'Full address is required';
    if (!form.desc.trim()) return 'Description is required';
    if (!form.price || Number(form.price) <= 0) return 'A valid nightly price in rupees is required';
    if (!cover) return 'A cover photo is required';
    if (gallery.length > MAX_GALLERY) return `You can add up to ${MAX_GALLERY} gallery photos`;
    if (videos.length > MAX_VIDEOS) return `You can add up to ${MAX_VIDEOS} videos`;
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const err = validate();
    if (err) {
      setStatus({ state: 'error', message: err });
      return;
    }

    const meta = {
      ...form,
      city: form.city,
      state: selectedLocation?.state || '',
      stars: Number(form.stars),
      rating: Number(form.rating),
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
      taxes: form.taxes ? Number(form.taxes) : 0,
      distance: form.distance ? Number(form.distance) : 0,
      deal: form.deal || null,
      highlights: highlights.map((h) => h.trim()).filter(Boolean),
      amenities,
      landmarks: landmarks
        .filter((l) => l.name.trim() && l.d.trim())
        .map((l) => ({
          name: l.name.trim(),
          d: l.d.trim(),
        })),
      rooms: rooms
        .filter((r) => r.name.trim() && r.price)
        .map((r) => ({
          name: r.name.trim(),
          bed: r.bed.trim() || '1 queen bed',
          guests: Number(r.guests) || 2,
          size: Number(r.size) || 30,
          price: Number(r.price),
          img: r.img.trim(),
          benefits: r.benefits.split(',').map((b) => b.trim()).filter(Boolean),
        })),
    };

    const body = new FormData();
    body.append('data', JSON.stringify(meta));
    if (cover) body.append('image', cover.file);
    gallery.forEach((g) => body.append('gallery', g.file));
    videos.forEach((v) => body.append('videos', v.file));

    try {
      setStatus({ state: 'saving', message: '' });

      const res = await fetch(`${API_BASE}/api/hotels/add`, {
        method: 'POST',
        body,
      });

      const responseText = await res.text();
      let data;

      try {
        data = JSON.parse(responseText);
      } catch (error) {
        throw new Error(responseText || 'Invalid server response');
      }

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to add hotel');
      }

      setStatus({
        state: 'success',
        message: `"${data.hotel.name}" was published in ${form.city}.`,
      });

      resetForm();
    } catch (ex) {
      setStatus({
        state: 'error',
        message: ex.message || 'Something went wrong',
      });
    }
  };

  return (
    <div className="ap-app">
      <header className="ap-header">
        <div className="ap-header-inner">
          <div className="ap-brand">
            <span className="ap-brand-mark">TN</span>
            Property Console
          </div>
          <span className="ap-header-sub">
            <Building2 size={14} />
            Inventory &amp; Content Management
          </span>
        </div>
      </header>

      <div className="ap-shell">
        <aside className="ap-rail">
          <p className="ap-rail-title">Onboard a property</p>
          <nav className="ap-rail-nav">
            {STEPS.map((s, i) => (
              <a key={s.id} href={`#${s.id}`} className="ap-rail-link">
                <span className="ap-rail-num">{String(i + 1).padStart(2, '0')}</span>
                <span>{s.label}</span>
              </a>
            ))}
          </nav>
          <div className="ap-rail-note">
            <Compass size={15} />
            <p>
              Choose a location first. The hotel will appear immediately in that city’s hotel list and detail page.
            </p>
          </div>
        </aside>

        <main className="ap-main">
          <div className="ap-intro">
            <h1>
              <HotelIcon size={24} />
              Add a new property
            </h1>
            <p>
              Publish a hotel, resort, apartment, villa or hostel in Pondicherry, Munnar, Ooty, Coimbatore, Bangalore or Hyderabad.
            </p>
          </div>

          {status.state === 'success' && (
            <div className="ap-alert success">
              <CheckCircle2 size={18} />
              {status.message}
            </div>
          )}

          {status.state === 'error' && (
            <div className="ap-alert error">
              <AlertCircle size={18} />
              {status.message}
            </div>
          )}

          <form className="ap-form" onSubmit={handleSubmit}>
            <section className="ap-card" id="basic">
              <h2>
                <span className="ap-step">01</span>
                <FileText size={17} />
                Basic information
              </h2>

              <div className="ap-grid">
                <label className="ap-field">
                  <span>Hotel name *</span>
                  <input
                    value={form.name}
                    onChange={(e) => set('name', e.target.value)}
                    placeholder="e.g. Palais de Mahe"
                  />
                </label>

                <label className="ap-field">
                  <span>
                    <MapPin size={13} /> Location *
                  </span>
                  <select
                    value={form.city}
                    onChange={(e) => set('city', e.target.value)}
                  >
                    {LOCATIONS.map((item) => (
                      <option key={item.city} value={item.city}>
                        {item.city}, {item.state}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="ap-field">
                  <span>Area / neighbourhood *</span>
                  <input
                    value={form.area}
                    onChange={(e) => set('area', e.target.value)}
                    placeholder="e.g. White Town"
                  />
                </label>

                <label className="ap-field">
                  <span>Property type</span>
                  <select value={form.type} onChange={(e) => set('type', e.target.value)}>
                    {PROPERTY_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </label>

                <label className="ap-field">
                  <span>
                    <Star size={13} /> Star rating
                  </span>
                  <select value={form.stars} onChange={(e) => set('stars', e.target.value)}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <option key={s} value={s}>
                        {s} star{s > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="ap-field">
                  <span>Guest rating (0–10)</span>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={form.rating}
                    onChange={(e) => set('rating', e.target.value)}
                  />
                </label>

                <label className="ap-field">
                  <span>Promotional badge</span>
                  <select value={form.deal} onChange={(e) => set('deal', e.target.value)}>
                    {DEAL_OPTIONS.map((d) => (
                      <option key={d.v} value={d.v}>{d.label}</option>
                    ))}
                  </select>
                </label>

                <label className="ap-field span2">
                  <span>
                    <MapPin size={13} /> Full address *
                  </span>
                  <input
                    value={form.address}
                    onChange={(e) => set('address', e.target.value)}
                    placeholder={`Street, ${form.city}, ${selectedLocation?.state || 'India'}`}
                  />
                </label>

                <label className="ap-field span2">
                  <span>Description *</span>
                  <textarea
                    rows={3}
                    value={form.desc}
                    onChange={(e) => set('desc', e.target.value)}
                    placeholder="A short, appealing overview of the property..."
                  />
                </label>
              </div>
            </section>

            <section className="ap-card" id="pricing">
              <h2>
                <span className="ap-step">02</span>
                <DollarSign size={17} />
                Pricing &amp; distance
              </h2>

              <div className="ap-grid">
                <label className="ap-field">
                  <span>Price / night (INR) *</span>
                  <input
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={(e) => set('price', e.target.value)}
                    placeholder="4500"
                  />
                </label>

                <label className="ap-field">
                  <span>Old / strike-through price (INR)</span>
                  <input
                    type="number"
                    min="0"
                    value={form.oldPrice}
                    onChange={(e) => set('oldPrice', e.target.value)}
                    placeholder="Optional"
                  />
                </label>

                <label className="ap-field">
                  <span>Taxes &amp; fees (INR)</span>
                  <input
                    type="number"
                    min="0"
                    value={form.taxes}
                    onChange={(e) => set('taxes', e.target.value)}
                    placeholder="540"
                  />
                </label>

                <label className="ap-field">
                  <span>Distance from centre (km)</span>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={form.distance}
                    onChange={(e) => set('distance', e.target.value)}
                    placeholder="2.4"
                  />
                </label>

                <label className="ap-field">
                  <span>Check-in window</span>
                  <input
                    value={form.checkIn}
                    onChange={(e) => set('checkIn', e.target.value)}
                  />
                </label>

                <label className="ap-field">
                  <span>Check-out window</span>
                  <input
                    value={form.checkOut}
                    onChange={(e) => set('checkOut', e.target.value)}
                  />
                </label>
              </div>
            </section>

            <section className="ap-card" id="policies">
              <h2>
                <span className="ap-step">03</span>
                <ShieldCheck size={17} />
                Policies
              </h2>

              <div className="ap-toggles">
                {[
                  ['breakfast', 'Breakfast included'],
                  ['freeCancel', 'Free cancellation'],
                  ['payLater', 'Pay at the property'],
                  ['noPrepay', 'No prepayment needed'],
                  ['sustainable', 'Sustainable property'],
                ].map(([key, label]) => (
                  <label key={key} className={`ap-switch ${form[key] ? 'on' : ''}`}>
                    <input
                      type="checkbox"
                      checked={form[key]}
                      onChange={(e) => set(key, e.target.checked)}
                    />
                    <span className="ap-switch-track">
                      <span className="ap-switch-dot" />
                    </span>
                    {label}
                  </label>
                ))}
              </div>
            </section>

            <section className="ap-card" id="highlights">
              <h2>
                <span className="ap-step">04</span>
                <Sparkles size={17} />
                Highlights
              </h2>

              {highlights.map((h, i) => (
                <div className="ap-row" key={i}>
                  <input
                    value={h}
                    placeholder={`Highlight ${i + 1}`}
                    onChange={(e) => updateList(highlights, setHighlights, i, null, e.target.value)}
                  />
                  <button
                    type="button"
                    className="ap-icon-btn danger"
                    onClick={() => setHighlights(highlights.filter((_, x) => x !== i))}
                    disabled={highlights.length === 1}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}

              <button
                type="button"
                className="ap-add-btn"
                onClick={() => setHighlights([...highlights, ''])}
              >
                <Plus size={14} /> Add highlight
              </button>
            </section>

            <section className="ap-card" id="amenities">
              <h2>
                <span className="ap-step">05</span>
                <ListChecks size={17} />
                Amenities &amp; facilities
              </h2>

              <div className="ap-amen-grid">
                {AMENITY_LIST.map((a) => (
                  <label key={a} className={`ap-check ${amenities.includes(a) ? 'on' : ''}`}>
                    <input
                      type="checkbox"
                      checked={amenities.includes(a)}
                      onChange={() => toggleAmenity(a)}
                    />
                    <span className="ap-box">
                      <CheckCircle2 size={13} />
                    </span>
                    {a}
                  </label>
                ))}
              </div>
            </section>

            <section className="ap-card" id="landmarks">
              <h2>
                <span className="ap-step">06</span>
                <Landmark size={17} />
                Nearby landmarks
              </h2>

              {landmarks.map((l, i) => (
                <div className="ap-row triple" key={i}>
                  <input
                    value={l.name}
                    placeholder="Landmark name"
                    onChange={(e) => updateList(landmarks, setLandmarks, i, 'name', e.target.value)}
                  />
                  <input
                    value={l.d}
                    placeholder="Distance e.g. 1.2 km"
                    onChange={(e) => updateList(landmarks, setLandmarks, i, 'd', e.target.value)}
                  />
                  <button
                    type="button"
                    className="ap-icon-btn danger"
                    onClick={() => setLandmarks(landmarks.filter((_, x) => x !== i))}
                    disabled={landmarks.length === 1}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}

              <button
                type="button"
                className="ap-add-btn"
                onClick={() => setLandmarks([...landmarks, emptyLandmark()])}
              >
                <Plus size={14} /> Add landmark
              </button>
            </section>

            <section className="ap-card" id="media">
              <h2>
                <span className="ap-step">07</span>
                <ImageIcon size={17} />
                Photos &amp; videos
              </h2>

              <h3 className="ap-media-label">Cover photo *</h3>

              {cover ? (
                <div className="ap-cover-preview">
                  <img src={cover.preview} alt="Cover preview" />
                  <span className="ap-cover-tag">Cover photo</span>
                  <button type="button" className="ap-media-remove" onClick={removeCover}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ) : (
                <div
                  className={`ap-dropzone ${dragTarget === 'cover' ? 'drag' : ''}`}
                  onClick={() => coverInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragTarget('cover'); }}
                  onDragLeave={() => setDragTarget('')}
                  onDrop={onDrop('cover', setCoverFile)}
                >
                  <UploadCloud size={22} />
                  <p>
                    <strong>Drag &amp; drop</strong> a cover photo here, or <span>browse files</span>
                  </p>
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => setCoverFile(e.target.files)}
                  />
                </div>
              )}

              <div className="ap-media-head ap-media-head-spaced">
                <h3>
                  <ImageIcon size={14} /> Gallery photos
                </h3>
                <span className={`ap-media-count ${gallery.length >= MAX_GALLERY ? 'full' : ''}`}>
                  {gallery.length} / {MAX_GALLERY}
                </span>
              </div>

              {gallery.length > 0 && (
                <div className="ap-media-grid">
                  {gallery.map((g, i) => (
                    <div className="ap-media-thumb-card" key={g.preview}>
                      <img src={g.preview} alt={`Gallery ${i + 1}`} />
                      <button type="button" className="ap-media-remove" onClick={() => removeGalleryFile(i)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {gallery.length < MAX_GALLERY && (
                <div
                  className={`ap-dropzone ${dragTarget === 'gallery' ? 'drag' : ''}`}
                  onClick={() => galleryInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragTarget('gallery'); }}
                  onDragLeave={() => setDragTarget('')}
                  onDrop={onDrop('gallery', addGalleryFiles)}
                >
                  <UploadCloud size={22} />
                  <p>
                    <strong>Drag &amp; drop</strong> photos here, or <span>browse files</span>
                  </p>
                  <span className="ap-dropzone-hint">
                    Up to {MAX_GALLERY} photos total · JPG, PNG or WEBP
                  </span>
                  <input
                    ref={galleryInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    hidden
                    onChange={(e) => addGalleryFiles(e.target.files)}
                  />
                </div>
              )}

              <div className="ap-media-head ap-media-head-spaced">
                <h3>
                  <Video size={14} /> Videos
                </h3>
                <span className={`ap-media-count ${videos.length >= MAX_VIDEOS ? 'full' : ''}`}>
                  {videos.length} / {MAX_VIDEOS}
                </span>
              </div>

              {videos.length > 0 && (
                <div className="ap-media-grid">
                  {videos.map((v, i) => (
                    <div className="ap-media-thumb-card video" key={v.preview}>
                      <video src={v.preview} controls />
                      <button type="button" className="ap-media-remove" onClick={() => removeVideoFile(i)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {videos.length < MAX_VIDEOS && (
                <div
                  className={`ap-dropzone ${dragTarget === 'video' ? 'drag' : ''}`}
                  onClick={() => videoInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragTarget('video'); }}
                  onDragLeave={() => setDragTarget('')}
                  onDrop={onDrop('video', addVideoFiles)}
                >
                  <UploadCloud size={22} />
                  <p>
                    <strong>Drag &amp; drop</strong> videos here, or <span>browse files</span>
                  </p>
                  <span className="ap-dropzone-hint">
                    Up to {MAX_VIDEOS} videos total · MP4, WEBM or MOV
                  </span>
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    multiple
                    hidden
                    onChange={(e) => addVideoFiles(e.target.files)}
                  />
                </div>
              )}
            </section>

            <section className="ap-card" id="rooms">
              <h2>
                <span className="ap-step">08</span>
                <BedDouble size={17} />
                Room types
              </h2>

              {rooms.map((r, i) => (
                <div className="ap-room-card" key={i}>
                  <div className="ap-room-grid">
                    <input
                      placeholder="Room name"
                      value={r.name}
                      onChange={(e) => updateList(rooms, setRooms, i, 'name', e.target.value)}
                    />
                    <input
                      placeholder="Bed type e.g. 1 king bed"
                      value={r.bed}
                      onChange={(e) => updateList(rooms, setRooms, i, 'bed', e.target.value)}
                    />
                    <input
                      type="number"
                      min="1"
                      placeholder="Guests"
                      value={r.guests}
                      onChange={(e) => updateList(rooms, setRooms, i, 'guests', e.target.value)}
                    />
                    <input
                      type="number"
                      min="1"
                      placeholder="Size (m2)"
                      value={r.size}
                      onChange={(e) => updateList(rooms, setRooms, i, 'size', e.target.value)}
                    />
                    <input
                      type="number"
                      min="0"
                      placeholder="Price / night (INR)"
                      value={r.price}
                      onChange={(e) => updateList(rooms, setRooms, i, 'price', e.target.value)}
                    />
                    <input
                      placeholder="Room image URL"
                      value={r.img}
                      onChange={(e) => updateList(rooms, setRooms, i, 'img', e.target.value)}
                    />
                    <input
                      className="span2"
                      placeholder="Benefits, comma separated"
                      value={r.benefits}
                      onChange={(e) => updateList(rooms, setRooms, i, 'benefits', e.target.value)}
                    />
                  </div>

                  <button
                    type="button"
                    className="ap-icon-btn danger"
                    onClick={() => setRooms(rooms.filter((_, x) => x !== i))}
                    disabled={rooms.length === 1}
                  >
                    <Trash2 size={15} /> Remove room
                  </button>
                </div>
              ))}

              <button
                type="button"
                className="ap-add-btn"
                onClick={() => setRooms([...rooms, emptyRoom()])}
              >
                <Plus size={14} /> Add room type
              </button>
            </section>

            <div className="ap-submit-bar">
              <button
                type="button"
                className="ap-btn ghost"
                onClick={resetForm}
                disabled={status.state === 'saving'}
              >
                Clear form
              </button>

              <button
                type="submit"
                className="ap-btn solid"
                disabled={status.state === 'saving'}
              >
                {status.state === 'saving' ? (
                  <>
                    <Loader2 size={16} className="ap-spin" />
                    Publishing...
                  </>
                ) : (
                  <>Publish hotel in {form.city}</>
                )}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}