const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.replace(/\/$/, '');
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const SESSION_KEY = 'mvv_customer_session';

export type CustomerSession = {
  access_token: string;
  refresh_token: string;
  expires_at?: number;
  user: { id: string; email?: string };
};

export type PaintProjectRecord = {
  id: string;
  user_id: string;
  title: string;
  category: string;
  city: string | null;
  status: string;
  photo_path: string | null;
  design_data: Record<string, unknown>;
  estimate_low: number | null;
  estimate_high: number | null;
  pricing_version: string | null;
  created_at: string;
  updated_at: string;
};

function assertConfigured() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Asiakassovelluksen tietokantayhteyttä ei ole vielä määritetty.');
  }
}

function baseHeaders(accessToken?: string) {
  assertConfigured();
  return {
    apikey: SUPABASE_ANON_KEY!,
    Authorization: `Bearer ${accessToken || SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
  };
}

function storeSession(session: CustomerSession | null) {
  if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  else localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event('mvv-auth-change'));
}

export function getStoredSession(): CustomerSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as CustomerSession) : null;
  } catch {
    return null;
  }
}

async function parseError(response: Response) {
  const payload = await response.json().catch(() => ({}));
  return payload?.msg || payload?.message || payload?.error_description || payload?.error || 'Pyyntö epäonnistui.';
}

export async function signUp(email: string, password: string, name: string, phone: string) {
  assertConfigured();
  const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
    method: 'POST',
    headers: baseHeaders(),
    body: JSON.stringify({ email, password, data: { name, phone } }),
  });
  if (!response.ok) throw new Error(await parseError(response));
  const payload = await response.json();
  if (payload.access_token) storeSession(payload as CustomerSession);
  return payload;
}

export async function signIn(email: string, password: string) {
  assertConfigured();
  const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: baseHeaders(),
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error(await parseError(response));
  const session = (await response.json()) as CustomerSession;
  storeSession(session);
  return session;
}

export async function requestPasswordReset(email: string) {
  assertConfigured();
  const response = await fetch(`${SUPABASE_URL}/auth/v1/recover`, {
    method: 'POST',
    headers: baseHeaders(),
    body: JSON.stringify({ email, redirect_to: `${window.location.origin}/app/login?reset=1` }),
  });
  if (!response.ok) throw new Error(await parseError(response));
}

export async function refreshSession(session: CustomerSession) {
  assertConfigured();
  const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
    method: 'POST',
    headers: baseHeaders(),
    body: JSON.stringify({ refresh_token: session.refresh_token }),
  });
  if (!response.ok) {
    storeSession(null);
    throw new Error('Istunto on vanhentunut. Kirjaudu uudelleen.');
  }
  const refreshed = (await response.json()) as CustomerSession;
  storeSession(refreshed);
  return refreshed;
}

export async function requireSession() {
  const session = getStoredSession();
  if (!session) throw new Error('Kirjaudu sisään jatkaaksesi.');
  const expiresAt = session.expires_at ?? 0;
  if (expiresAt && expiresAt * 1000 < Date.now() + 60_000) return refreshSession(session);
  return session;
}

export function signOut() {
  const session = getStoredSession();
  storeSession(null);
  if (session && SUPABASE_URL && SUPABASE_ANON_KEY) {
    void fetch(`${SUPABASE_URL}/auth/v1/logout`, { method: 'POST', headers: baseHeaders(session.access_token) }).catch(() => undefined);
  }
}

async function restRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const session = await requireSession();
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: {
      ...baseHeaders(session.access_token),
      Prefer: 'return=representation',
      ...(init.headers ?? {}),
    },
  });
  if (!response.ok) throw new Error(await parseError(response));
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export async function listProjects() {
  return restRequest<PaintProjectRecord[]>('paint_projects?select=*&order=updated_at.desc');
}

export async function getProject(id: string) {
  const rows = await restRequest<PaintProjectRecord[]>(`paint_projects?id=eq.${encodeURIComponent(id)}&select=*`);
  return rows[0] ?? null;
}

export async function createProject(payload: Partial<PaintProjectRecord>) {
  const session = await requireSession();
  const rows = await restRequest<PaintProjectRecord[]>('paint_projects', {
    method: 'POST',
    body: JSON.stringify({ ...payload, user_id: session.user.id }),
  });
  return rows[0];
}

export async function updateProject(id: string, payload: Partial<PaintProjectRecord>) {
  const rows = await restRequest<PaintProjectRecord[]>(`paint_projects?id=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  return rows[0];
}

export async function createQuoteRequest(payload: Record<string, unknown>) {
  const session = await requireSession();
  return restRequest('quote_requests', {
    method: 'POST',
    body: JSON.stringify({ ...payload, user_id: session.user.id }),
  });
}

export async function listQuoteRequests() {
  return restRequest<Array<Record<string, unknown>>>('quote_requests?select=*&order=created_at.desc');
}

export async function uploadProjectImage(projectId: string, file: File) {
  const session = await requireSession();
  assertConfigured();
  const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, '-').slice(-80);
  const path = `${session.user.id}/${projectId}/${Date.now()}-${safeName || 'project-image.jpg'}`;
  const response = await fetch(`${SUPABASE_URL}/storage/v1/object/paint-planner/${path}`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON_KEY!,
      Authorization: `Bearer ${session.access_token}`,
      'Content-Type': file.type || 'application/octet-stream',
      'x-upsert': 'false',
    },
    body: file,
  });
  if (!response.ok) throw new Error(await parseError(response));
  return path;
}

export function getProjectImageUrl(path: string | null) {
  if (!path || !SUPABASE_URL) return null;
  return `${SUPABASE_URL}/storage/v1/object/public/paint-planner/${path}`;
}

export const customerAppConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
