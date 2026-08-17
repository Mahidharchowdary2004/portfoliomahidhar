import { useResource } from '../hooks/useResource';
import { useSectionTracking } from '../hooks/useSectionTracking';
import { defaultProfile } from '../data/defaults';

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Hero() {
  const profile = useResource('/profile', defaultProfile);
  const ref = useSectionTracking('home');

  return (
    <section className="hero" id="home" ref={ref}>
      <div className="container">
        <div className="hero-grid">
          <div>
            <span className="eyebrow">Available: {profile.availability}</span>
            <h1>Building clean, fast<br />software as <span className="accent">{profile.name}</span></h1>
            <p className="hero-desc">{profile.tagline}</p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#projects">View my work</a>
              <a className="btn btn-ghost" href="#contact">Get in touch</a>
            </div>
          </div>
          <div className="glass hero-photo-card">
            {profile.photoUrl
              ? <img src={profile.photoUrl} alt={profile.name} />
              : <span className="hero-photo-initials">{getInitials(profile.name)}</span>}
          </div>
        </div>
      </div>
    </section>
  );
}
