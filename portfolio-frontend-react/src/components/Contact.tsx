import { useState } from 'react';
import { useResource } from '../hooks/useResource';
import { useSectionTracking } from '../hooks/useSectionTracking';
import { defaultProfile } from '../data/defaults';
import { track } from '../api/client';
import Reveal from './Reveal';

export default function Contact() {
  const profile = useResource('/profile', defaultProfile);
  const ref = useSectionTracking('contact');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    track('click', 'contact', 'contact-form-submit');

    const subject = `Portfolio contact from ${name || 'a visitor'}`;
    const body = `${message}\n\n— ${name}${email ? ` (${email})` : ''}`;
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <section id="contact" ref={ref}>
      <div className="container">
        <Reveal className="glass contact-card">
          <div className="contact-top-links">
            <a
              className="contact-top-link"
              href={`mailto:${profile.email}`}
              onClick={() => track('click', 'contact', 'contact-email')}
            >
              Email
            </a>
            <a
              className="contact-top-link"
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track('click', 'contact', 'social-github')}
            >
              GitHub
            </a>
            <a
              className="contact-top-link"
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track('click', 'contact', 'social-linkedin')}
            >
              LinkedIn
            </a>
            <a
              className="contact-top-link"
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track('click', 'contact', 'resume-download')}
            >
              Résumé
            </a>
          </div>

          <h2>Let's build something worth shipping</h2>
          <p>I'm currently open to senior backend and infrastructure roles. Send a message below, or use one of the links above — either way I read everything.</p>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <label>
                Name
                <input type="text" value={name} onChange={e => setName(e.target.value)} required />
              </label>
              <label>
                Email
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              </label>
            </div>
            <label>
              Message
              <textarea rows={4} value={message} onChange={e => setMessage(e.target.value)} required />
            </label>
            <button type="submit" className="btn btn-primary">Send message</button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
