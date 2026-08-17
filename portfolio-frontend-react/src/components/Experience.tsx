import { useResource } from '../hooks/useResource';
import { useSectionTracking } from '../hooks/useSectionTracking';
import { defaultExperience } from '../data/defaults';
import Reveal from './Reveal';

export default function Experience() {
  const experience = useResource('/experience', defaultExperience);
  const ref = useSectionTracking('experience');

  return (
    <section id="experience" ref={ref}>
      <div className="container">
        <Reveal className="section-head">
          <span className="section-tag">Experience</span>
          <h2 className="section-title">Where I've worked</h2>
        </Reveal>
        <div className="timeline">
          {experience.map((item, i) => (
            <Reveal as="div" className="timeline-item" key={item._id ?? i}>
              <div className="timeline-dot"></div>
              <div className="glass timeline-card">
                <div className="timeline-meta">
                  <span className="timeline-role">{item.role}</span>
                  <span className="timeline-date">{item.duration}</span>
                </div>
                <div className="timeline-org">{item.company}</div>
                <p className="desc">{item.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
