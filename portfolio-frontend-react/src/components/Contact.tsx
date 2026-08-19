import { useState } from 'react';
import { useResource } from '../hooks/useResource';
import { useSectionTracking } from '../hooks/useSectionTracking';
import { defaultProfile } from '../data/defaults';
import { track, API_BASE } from '../api/client';
import Reveal from './Reveal';

interface FieldErrors {
  name?: string;
  email?: string;
  message?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(name: string, email: string, message: string): FieldErrors {
  const errors: FieldErrors = {};
  const trimmedName = name.trim();
  const trimmedEmail = email.trim();
  const trimmedMessage = message.trim();

  if (!trimmedName) {
    errors.name = 'Name is required';
  } else if (trimmedName.length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (!trimmedEmail) {
    errors.email = 'Email is required';
  } else if (!EMAIL_REGEX.test(trimmedEmail)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!trimmedMessage) {
    errors.message = 'Message is required';
  } else if (trimmedMessage.length < 10) {
    errors.message = 'Message must be at least 10 characters';
  }

  return errors;
}

const errorStyle: React.CSSProperties = {
  color: '#e05a5a',
  fontSize: '12px',
  marginTop: '4px',
  fontWeight: 600,
  letterSpacing: '0.3px'
};

export default function Contact() {
  const profile = useResource('/profile', defaultProfile);
  const ref = useSectionTracking('contact');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  function handleBlur(field: string) {
    setTouched(prev => ({ ...prev, [field]: true }));
    setErrors(validate(name, email, message));
  }

  function handleChange(field: 'name' | 'email' | 'message', value: string) {
    if (field === 'name') setName(value);
    else if (field === 'email') setEmail(value);
    else setMessage(value);

    // Clear error for this field while typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validate all fields
    const validationErrors = validate(name, email, message);
    setErrors(validationErrors);
    setTouched({ name: true, email: true, message: true });

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setStatus('sending');
    track('click', 'contact', 'contact-form-submit');

    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), message: message.trim() })
      });

      if (!res.ok) {
        throw new Error('Failed to send');
      }

      setStatus('success');
      setName('');
      setEmail('');
      setMessage('');
      setErrors({});
      setTouched({});
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

          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <div className="form-row">
              <label>
                Name
                <input
                  type="text"
                  value={name}
                  onChange={e => handleChange('name', e.target.value)}
                  onBlur={() => handleBlur('name')}
                  disabled={status === 'sending'}
                  placeholder="Your full name"
                  style={touched.name && errors.name ? { boxShadow: 'inset 2px 2px 5px #e05a5a33, inset -2px -2px 5px #e05a5a11' } : {}}
                />
                {touched.name && errors.name && <span style={errorStyle}>{errors.name}</span>}
              </label>
              <label>
                Email
                <input
                  type="email"
                  value={email}
                  onChange={e => handleChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  disabled={status === 'sending'}
                  placeholder="you@example.com"
                  style={touched.email && errors.email ? { boxShadow: 'inset 2px 2px 5px #e05a5a33, inset -2px -2px 5px #e05a5a11' } : {}}
                />
                {touched.email && errors.email && <span style={errorStyle}>{errors.email}</span>}
              </label>
            </div>
            <label>
              Message
              <textarea
                rows={4}
                value={message}
                onChange={e => handleChange('message', e.target.value)}
                onBlur={() => handleBlur('message')}
                disabled={status === 'sending'}
                placeholder="Write your message here (at least 10 characters)"
                style={touched.message && errors.message ? { boxShadow: 'inset 2px 2px 5px #e05a5a33, inset -2px -2px 5px #e05a5a11' } : {}}
              />
              {touched.message && errors.message && <span style={errorStyle}>{errors.message}</span>}
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
              <p style={{ color: '#e05a5a', fontSize: '14px', marginTop: '12px', fontWeight: 'bold' }}>
                ✗ Failed to send message. Please try again.
              </p>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  );
}

