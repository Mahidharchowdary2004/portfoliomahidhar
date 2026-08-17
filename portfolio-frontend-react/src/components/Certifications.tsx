import { useResource } from '../hooks/useResource';
import { useSectionTracking } from '../hooks/useSectionTracking';
import { defaultCertifications } from '../data/defaults';
import { track } from '../api/client';
import Reveal from './Reveal';
import { CertIcon } from './icons';

export default function Certifications() {
  const certifications = useResource('/certifications', defaultCertifications);
  const ref = useSectionTracking('certifications');

  return (
    <section id="certifications" ref={ref}>
      <div className="container">
        <Reveal className="section-head">
          <span className="section-tag">Certifications</span>
          <h2 className="section-title">Credentials I've earned</h2>
        </Reveal>
        <div className="skills-groups cert-grid">
          {certifications.map((cert, i) => (
            <Reveal className="glass cert-card" key={cert._id ?? i}>
              <div className="cert-top">
                <div className="project-icon">{cert.icon || '📜'}</div>
                <span className="timeline-date">{cert.year}</span>
              </div>
              <h3>{cert.title}</h3>
              <p className="cert-org">{cert.org}</p>
              {cert.certificateUrl && (
                <a
                  className="cert-link"
                  href={cert.certificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track('click', 'certificate', `certificate-view:${cert.title}`)}
                >
                  <CertIcon /> View certificate
                </a>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
