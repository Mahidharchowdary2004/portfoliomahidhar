import { useResource } from '../hooks/useResource';
import { useSectionTracking } from '../hooks/useSectionTracking';
import { defaultProfile, defaultEducation } from '../data/defaults';
import Reveal from './Reveal';
import { CertIcon } from './icons';

export default function About() {
  const profile = useResource('/profile', defaultProfile);
  const education = useResource('/education', defaultEducation);
  const ref = useSectionTracking('about');

  return (
    <section id="about" ref={ref}>
      <div className="container">
        <Reveal className="section-head">
          <span className="section-tag">About</span>
          <h2 className="section-title">A little about how I work</h2>
        </Reveal>

        <div className="about-grid">
          <Reveal className="glass about-card">
            {profile.bioParagraphs.map((para, i) => <p key={i}>{para}</p>)}
          </Reveal>
          <Reveal className="glass facts">
            <div className="fact">
              <span className="fact-label">Based in</span>
              <span className="fact-value">{profile.location}</span>
            </div>
            <div className="fact">
              <span className="fact-label">Experience</span>
              <span className="fact-value">{profile.experienceLabel}</span>
            </div>
            <div className="fact">
              <span className="fact-label">Focus</span>
              <span className="fact-value">{profile.focus}</span>
            </div>
            <div className="fact">
              <span className="fact-label">Currently</span>
              <span className="fact-value">{profile.availability}</span>
            </div>
          </Reveal>
        </div>

        <div className="education-block">
          <h3 className="education-heading">Education</h3>
          <div className="education-list">
            {education.map((item, i) => (
              <div className="glass education-card" key={item._id ?? i}>
                <div className="education-icon">{item.icon || '🎓'}</div>
                <div className="education-info">
                  <div className="education-top">
                    <h4>{item.degree}</h4>
                    <span className="timeline-date">{item.duration}</span>
                  </div>
                  <p className="education-org">
                    {item.institution}
                    {item.cgpaOrMarks && <span className="education-score"> — {item.cgpaOrMarks}</span>}
                  </p>
                  {item.detail && <p className="education-detail">{item.detail}</p>}

                  {item.certificateUrl && (
                    <a className="cert-link" href={item.certificateUrl} target="_blank" rel="noopener noreferrer">
                      <CertIcon /> View certificate
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
