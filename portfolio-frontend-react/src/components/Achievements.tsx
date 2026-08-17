import { useResource } from '../hooks/useResource';
import { useSectionTracking } from '../hooks/useSectionTracking';
import { defaultAchievements } from '../data/defaults';
import Reveal from './Reveal';

export default function Achievements() {
  const achievements = useResource('/achievements', defaultAchievements);
  const ref = useSectionTracking('achievements');

  if (achievements.length === 0) return null;

  return (
    <section id="achievements" ref={ref}>
      <div className="container">
        <Reveal className="section-head">
          <span className="section-tag">Achievements</span>
          <h2 className="section-title">Milestones worth mentioning</h2>
        </Reveal>
        <div className="skills-groups cert-grid">
          {achievements.map((item, i) => (
            <Reveal className="glass cert-card" key={item._id ?? i}>
              <div className="cert-top">
                <div className="project-icon">{item.icon || '★'}</div>
              </div>
              <h3>{item.title}</h3>
              <p className="cert-org">{item.description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
