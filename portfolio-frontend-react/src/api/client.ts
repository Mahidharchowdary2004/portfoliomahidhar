export const API_BASE = import.meta.env.VITE_API_BASE || 'https://portfoliomahidhar-8qlf.onrender.com/api';


export async function fetchJSON<T>(path: string): Promise<T> {
  if (!API_BASE) throw new Error('API_BASE not set');
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`Failed: ${path}`);
  return res.json() as Promise<T>;
}

function getSessionId(): string {
  const KEY = 'portfolio_session_id';
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(KEY, id);
  }
  return id;
}

// Fire-and-forget analytics event. Never throws, never blocks the UI —
// a tracking failure should never be visible to the visitor.
export function track(type: 'pageview' | 'click', path: string, label = ''): void {
  if (!API_BASE) return;
  fetch(`${API_BASE}/track`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, path, label, sessionId: getSessionId() })
  }).catch(() => { /* never surface tracking failures */ });
}

// Derives the admin panel URL from API_BASE (…/api -> …/admin).
// Returns null if no backend is configured — callers should hide the
// admin link entirely in that case.
export function getAdminUrl(): string | null {
  if (!API_BASE) return null;
  return API_BASE.replace(/\/api\/?$/, '/admin');
}
