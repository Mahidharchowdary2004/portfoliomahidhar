import { useMemo, useState } from 'react';
import { useResource } from '../hooks/useResource';
import { useSectionTracking } from '../hooks/useSectionTracking';
import { defaultProjects } from '../data/defaults';
import { track } from '../api/client';
import Reveal from './Reveal';
import { CodeIcon, LiveIcon } from './icons';

export default function Projects() {
  const projects = useResource('/projects', defaultProjects);
  const ref = useSectionTracking('projects');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = useMemo(() => {
    const set = new Set(projects.map(p => p.category).filter(Boolean));
    return Array.from(set);
  }, [projects]);

  const visibleProjects = activeCategory === 'All'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  return (
    <section id="projects" ref={ref}>
      <div className="container">
        <Reveal className="section-head">
          <span className="section-tag">Selected work</span>
          <h2 className="section-title">Things I've built recently</h2>
        </Reveal>

        {categories.length > 1 && (
          <div className="filter-pills">
            {['All', ...categories].map(cat => (
              <button
                key={cat}
                type="button"
                className={`filter-pill ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        <div className="projects-grid">
          {visibleProjects.map((project, i) => (
            <Reveal className="glass project-card" key={project._id ?? i}>
              <div className="project-preview">
                {project.imageUrl
                  ? <img src={project.imageUrl} alt={`${project.name} preview`} />
                  : <span className="preview-glyph">{project.icon || '⌁'}</span>}
              </div>
              <div className="project-body">
                {project.category && <span className="project-category">{project.category}</span>}
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                <div className="tag-row">
                  {project.tags.map(tag => <span className="tag" key={tag}>{tag}</span>)}
                </div>
                <div className="project-links">
                  {project.codeUrl && (
                    <a
                      className="project-link-btn code"
                      href={project.codeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => track('click', 'projects', `project-code:${project.name}`)}
                    >
                      <CodeIcon /> Code
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      className="project-link-btn live"
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => track('click', 'projects', `project-live:${project.name}`)}
                    >
                      <LiveIcon /> Live
                    </a>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
