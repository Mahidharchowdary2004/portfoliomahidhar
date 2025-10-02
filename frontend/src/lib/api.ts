const isLocalhost = typeof window !== 'undefined' && /^(localhost|127\.0\.0\.1|\[::1\])$/.test(window.location.hostname);
const API_BASE = isLocalhost ? 'http://localhost:4000' : 'https://portfoliomahidhar-backend.onrender.com';

export const fetchContactInfo = async () => {
  const res = await fetch(`${API_BASE}/contact-info`);
  if (!res.ok) {
    throw new Error('Failed to fetch contact info');
  }
  return res.json();
};

export const fetchSkills = async () => {
  const res = await fetch(`${API_BASE}/skills`);
  if (!res.ok) {
    throw new Error('Failed to fetch skills');
  }
  return res.json();
};

export const fetchProjects = async () => {
  const res = await fetch(`${API_BASE}/projects`);
  if (!res.ok) {
    throw new Error('Failed to fetch projects');
  }
  return res.json();
};

export const fetchCertifications = async () => {
  const res = await fetch(`${API_BASE}/certifications`);
  if (!res.ok) {
    throw new Error('Failed to fetch certifications');
  }
  return res.json();
};

export const fetchExperiences = async () => {
  const res = await fetch(`${API_BASE}/experiences`);
  if (!res.ok) {
    throw new Error('Failed to fetch experiences');
  }
  return res.json();
};

export const saveExperiences = async (experiences, token) => {
  const res = await fetch(`${API_BASE}/experiences`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(experiences),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to save experiences');
  }
  return res.json();
};

export const fetchAbout = async () => {
  const res = await fetch(`${API_BASE}/about`);
  if (!res.ok) {
    throw new Error('Failed to fetch about info');
  }
  return res.json();
};

export const saveAbout = async (about, token) => {
  const res = await fetch(`${API_BASE}/about`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(about),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to save about info');
  }
  return res.json();
};

export const fetchAchievements = async () => {
  const res = await fetch(`${API_BASE}/achievements`);
  if (res.status === 404) {
    // Endpoint not deployed yet on prod; treat as empty
    return [];
  }
  if (!res.ok) {
    throw new Error('Failed to fetch achievements');
  }
  // Some hosts may return HTML error pages; guard JSON parse
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return [];
  }
};

export const fetchServices = async () => {
  const res = await fetch(`${API_BASE}/services`);
  if (!res.ok) {
    throw new Error('Failed to fetch services');
  }
  return res.json();
};

export const saveServices = async (services, token) => {
  const res = await fetch(`${API_BASE}/services`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(services),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to save services');
  }
  return res.json();
};

export const saveAchievements = async (achievements, token) => {
  const res = await fetch(`${API_BASE}/achievements`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(achievements),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to save achievements');
  }
  return res.json();
};

export const uploadImage = async (file: File, token: string) => {
  const form = new FormData();
  form.append('image', file);
  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Image upload failed');
  }
  return res.json();
};
