const API_BASE = 'https://portfoliomahidhar-backend.onrender.com';

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
