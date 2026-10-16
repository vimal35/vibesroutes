import { ArrowRight, ArrowUpRight, Mountain, Waves, Umbrella, Landmark } from 'lucide-react';
import { useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { AboutFooter, SitePageHeader } from './About';
import './Home.css';
import './ExploreDestinations.css';

const destinations = [
  {
    id: 'ooty', city: 'Ooty', region: 'Tamil Nadu', listingLocation: 'Ooty',
    description: 'Misty hills, tea gardens, and scenic mountain views.',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ooty%20Th%C3%A9%20Plantation.JPG?width=960',
    alt: 'Tea gardens spread across the misty hills of Ooty',
    source: 'https://commons.wikimedia.org/wiki/File:Ooty_Th%C3%A9_Plantation.JPG', credit: 'Harrieta171', license: 'CC BY-SA',
  },
  {
    id: 'kodaikanal', city: 'Kodaikanal', region: 'Tamil Nadu',
    description: 'Quiet lakes, forest trails, and refreshing hill-station escapes.',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kodaikanal-lake.jpg?width=960',
    alt: 'Kodaikanal Lake surrounded by green hills',
    source: 'https://commons.wikimedia.org/wiki/File:Kodaikanal-lake.jpg', credit: 'युकेश', license: 'Public domain',
  },
  {
    id: 'munnar', city: 'Munnar', region: 'Kerala', listingLocation: 'Munnar',
    description: 'Rolling tea plantations, green valleys, and winding mountain roads.',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Tea%20Estate%20in%20Munnar.jpg?width=960',
    alt: 'Green tea estate covering the hills around Munnar',
    source: 'https://commons.wikimedia.org/wiki/File:Tea_Estate_in_Munnar.jpg', credit: 'Kps', license: 'Public domain',
  },
  {
    id: 'alleppey', city: 'Alleppey', region: 'Kerala',
    description: 'Serene backwaters, houseboats, and relaxed waterfront experiences.',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Alleppey_backwaters.1.jpg?width=960',
    alt: 'A boat traveling through Alleppey’s palm-lined backwaters',
    source: 'https://commons.wikimedia.org/wiki/File:Alleppey_backwaters.1.jpg', credit: 'Sravanbaddi', license: 'CC BY-SA 4.0',
  },
  {
    id: 'coorg', city: 'Coorg', region: 'Karnataka',
    description: 'Coffee plantations, forested hills, and peaceful nature retreats.',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Coffee%20Plantation%20in%20Coorg..jpg?width=960',
    alt: 'A lush coffee plantation in the hills of Coorg',
    source: 'https://commons.wikimedia.org/wiki/File:Coffee_Plantation_in_Coorg..jpg', credit: 'Rudolph A. Furtado', license: 'CC0',
  },
  {
    id: 'mysuru', city: 'Mysuru', region: 'Karnataka',
    description: 'Royal heritage, magnificent architecture, and rich cultural traditions.',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mysore%20palace%20front%20view%20001.jpg?width=960',
    alt: 'The illuminated front façade of Mysore Palace in Mysuru',
    source: 'https://commons.wikimedia.org/wiki/File:Mysore_palace_front_view_001.jpg', credit: 'Rijin S', license: 'CC BY-SA 4.0',
  },
  {
    id: 'puducherry', city: 'Puducherry', region: 'Union Territory of Puducherry', listingLocation: 'Pondicherry',
    description: 'Coastal promenades, distinctive French-inspired architecture, and relaxed seaside streets.',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/French%20Quarter%20in%20Pondicherry%20%285%29%20%2823662220798%29.jpg?width=960',
    alt: 'Colorful French-inspired street in Puducherry’s historic quarter',
    source: 'https://commons.wikimedia.org/wiki/File:French_Quarter_in_Pondicherry_(5)_(23662220798).jpg', credit: 'Richard Mortel', license: 'CC BY 2.0',
  },
  {
    id: 'hyderabad', city: 'Hyderabad', region: 'Telangana', listingLocation: 'Hyderabad',
    description: 'Historic landmarks, vibrant city life, and memorable local cuisine.',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Panoramic%20View%20of%20the%20Charminar%2C%20Hyderabad.jpg?width=960',
    alt: 'A panoramic view of Charminar, Hyderabad',
    source: 'https://commons.wikimedia.org/wiki/File:Panoramic_View_of_the_Charminar,_Hyderabad.jpg', credit: 'Preeti Prajapati', license: 'CC BY-SA 4.0',
  },
  {
    id: 'wayanad', city: 'Wayanad', region: 'Kerala',
    description: 'Lush forests, waterfalls, wildlife, and scenic nature escapes.',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Tea%20plantations%20at%20Wayanad.jpg?width=960',
    alt: 'Lush green tea plantations and silver oak trees in Wayanad',
    source: 'https://commons.wikimedia.org/wiki/File:Tea_plantations_at_Wayanad.jpg', credit: 'Suchith mendon', license: 'CC BY-SA 4.0',
  },
];

const themes = [
  { title: 'Mountain Retreats', text: 'Find a refreshing escape among hills, tea gardens, and forest trails.', icon: Mountain, image: destinations[0].image, target: '#ooty' },
  { title: 'Backwater Getaways', text: 'Slow down beside tranquil waterways and scenic lakes.', icon: Waves, image: destinations[3].image, target: '#alleppey' },
  { title: 'Coastal Escapes', text: 'Discover seaside destinations, relaxed promenades, and beachside stays.', icon: Umbrella, image: destinations[6].image, target: '#puducherry' },
  { title: 'Culture & City Life', text: 'Explore heritage landmarks, local food, architecture, and vibrant cities.', icon: Landmark, image: destinations[5].image, target: '#mysuru' },
];

const HOTEL_LIST_PATH = '/HotelList';

function stayPath(destination) {
  return destination.listingLocation
    ? `${HOTEL_LIST_PATH}?location=${encodeURIComponent(destination.listingLocation)}`
    : HOTEL_LIST_PATH;
}

export default function ExploreDestinations() {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="explore-destinations-page">
      <SitePageHeader activePage="destinations" />
      <main>
        <section className="explore-hero" aria-labelledby="explore-hero-title">
          <img src={destinations[0].image} alt="Tea gardens across the hills of Ooty, South India" fetchPriority="high" />
          <div className="explore-hero-shade" />
          <div className="container explore-hero-content">
            <span className="explore-hero-label">Find your vibe. Follow your route.</span>
            <h1 id="explore-hero-title">Find a place that<br />sets your pace</h1>
            <p>From tea-covered hills and palm-lined backwaters to heritage streets and lively cities, explore South Indian destinations and the stay options listed for your plans.</p>
            <a href="#explore-destinations" className="btn-signup explore-hero-cta">Explore destinations <ArrowRight size={17} /></a>
          </div>
          <a className="explore-hero-credit" href={destinations[0].source} target="_blank" rel="noreferrer">
            Photo: {destinations[0].credit} · {destinations[0].license}
          </a>
        </section>

        <section className="section explore-destinations-section" id="explore-destinations" aria-labelledby="destinations-title">
          <div className="container">
            <div className="section-head">
              <span className="section-tag">Take the scenic route</span>
              <h2 className="section-title" id="destinations-title">A new place, <span className="hl">a different feeling</span></h2>
              <p className="section-desc">Browse nine destinations, from hill-country mornings to days by the water and city streets worth exploring.</p>
            </div>
            <p className="destination-listing-note">
              Explore Stays opens location-filtered results for Ooty, Munnar, Puducherry, and Hyderabad. For Kodaikanal, Alleppey, Coorg, Mysuru, and Wayanad, it opens the current hotel list because destination-specific filters are not available for those places yet.
            </p>
            <div className="dest-grid explore-dest-grid">
              {destinations.map((destination) => (
                <article className="dest-card explore-dest-card" id={destination.id} key={destination.id}>
                  <img src={destination.image} alt={destination.alt} loading="lazy" decoding="async" />
                  <div className="overlay" />
                  <div className="info">
                    <div className="city">{destination.city}</div>
                    <div className="country">{destination.region}</div>
                    <p className="dest-description">{destination.description}</p>
                    <Link className="dest-explore" to={stayPath(destination)}>Explore Stays <ArrowUpRight size={16} /></Link>
                  </div>
                  <div className="dest-credit" aria-label={`Photo by ${destination.credit}`}>
                    <a href={destination.source} target="_blank" rel="noreferrer">Photo: {destination.credit}</a>
                    <span aria-hidden="true"> | </span><a href={destination.source} target="_blank" rel="noreferrer">{destination.license}</a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section explore-story-section" aria-labelledby="explore-story-title">
          <div className="container explore-story-layout">
            <div className="explore-story-image">
              <img src={destinations[3].image} alt="Peaceful Kerala backwaters framed by tropical greenery" loading="lazy" decoding="async" />
              <span>THE BEAUTY OF SOUTH INDIA</span>
              <a className="explore-story-credit" href={destinations[3].source} target="_blank" rel="noreferrer">Photo: {destinations[3].credit} · {destinations[3].license}</a>
            </div>
            <div className="explore-story-copy">
              <span className="section-tag">The beauty of South India</span>
              <h2 id="explore-story-title">Every Destination Has a <span className="hl">Story to Tell</span></h2>
              <p>Some days call for mountain air and tea gardens. Others are better spent beside the backwaters, along a quiet shore, or wandering a city with no fixed plan.</p>
              <p>Follow the green roads around Munnar, take in the waterways of Alleppey, wander Puducherry’s seaside streets, or spend a day among Mysuru’s heritage. Each destination brings a different pace and a different way to spend your time.</p>
              <p>VibezRoutes brings these places and stay options together, so you can explore what catches your eye and compare the details that matter to your trip.</p>
              <strong className="explore-story-closing">Choose a direction. Make it your own.</strong>
            </div>
          </div>
        </section>

        <section className="section explore-themes-section" aria-labelledby="escape-title">
          <div className="container">
            <div className="section-head">
              <span className="section-tag">Choose your pace</span>
              <h2 className="section-title" id="escape-title">Find Your Kind of <span className="hl">Escape</span></h2>
            </div>
            <div className="escape-grid">
              {themes.map(({ title, text, icon: Icon, image, target }) => (
                <a className="escape-card" href={target} key={title} style={{ '--escape-image': `url("${image}")` }}>
                  <span className="escape-icon"><Icon size={21} /></span>
                  <div><h3>{title}</h3><p>{text}</p><span className="escape-link">See destinations <ArrowRight size={15} /></span></div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <AboutFooter activePage="destinations" />
    </div>
  );
}
