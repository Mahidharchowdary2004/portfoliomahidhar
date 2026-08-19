import { useState } from 'react';
import { useResource } from '../hooks/useResource';
import { useSectionTracking } from '../hooks/useSectionTracking';
import { defaultProfile } from '../data/defaults';
import { track, API_BASE } from '../api/client';
import Reveal from './Reveal';

export default function Contact() {
  const profile = useResource('/profile', defaultProfile);
  const ref = useSectionTracking('contact');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    track('click', 'contact', 'contact-form-submit');

    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });

      if (!res.ok) {
        throw new Error('Failed to send');
      }

      setStatus('success');
      setName('');
      setEmail('');
      setMessage('');
    } catch {
      setStatus('error');
    }
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
                <input type="text" value={name} onChange={e => setName(e.target.value)} required disabled={status === 'sending'} />
              </label>
              <label>
                Email
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required disabled={status === 'sending'} />
              </label>
            </div>
            <label>
              Message
              <textarea rows={4} value={message} onChange={e => setMessage(e.target.value)} required disabled={status === 'sending'} />
            </label>
            <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending...' : 'Send message'}
            </button>
            {status === 'success' && (
              <p style={{ color: 'var(--accent)', fontSize: '14px', marginTop: '12px', fontWeight: 'bold' }}>
                ✓ Message sent successfully! I will get back to you soon.
              </p>
            )}
            {status === 'error' && (
              <p style={{ color: 'var(--danger)', fontSize: '14px', marginTop: '12px', fontWeight: 'bold' }}>
                ✗ Failed to send message. Please try again.
              </p>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  );
}
