import { useResource } from '../hooks/useResource';
import { useSectionTracking } from '../hooks/useSectionTracking';
import { defaultSkills } from '../data/defaults';
import Reveal from './Reveal';

export default function Skills() {
  const skills = useResource('/skills', defaultSkills);
  const ref = useSectionTracking('skills');

  return (
    <section id="skills" ref={ref}>
      <div className="container">
        <Reveal className="section-head">
          <span className="section-tag">Skills</span>
          <h2 className="section-title">Tools I reach for</h2>
        </Reveal>
        <div className="skills-groups">
          {skills.map((group, i) => (
            <Reveal className="glass skill-group" key={group._id ?? i}>
              <h3>{group.category}</h3>
              <div className="chips">
                {group.items.map(item => <span className="chip" key={item}>{item}</span>)}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
