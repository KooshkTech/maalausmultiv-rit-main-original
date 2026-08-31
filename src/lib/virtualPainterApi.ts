import { createProject, createQuoteRequest, requireSession, updateProject } from '@/lib/customerAppApi';

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.replace(/\/$/, '');
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export type PainterOrderCustomer = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
};

export type PainterOrderPayload = {
  customer: PainterOrderCustomer;
  category: 'interior' | 'exterior';
  polygons: Array<Record<string, unknown>>;
  totalAreaM2: number;
  totalPaintLitres: number;
  summaryText: string;
  originalFile: File;
  beforeBlob: Blob;
  afterBlob: Blob;
  pdfBlob: Blob;
};

export type AdminPainterOrder = {
  id: string;
  project_id: string;
  project_title: string;
  city: string | null;
  name: string;
  email: string;
  phone: string;
  message: string | null;
  status: string;
  created_at: string;
  summary_pdf_path?: string | null;
  before_image_path?: string | null;
  after_image_path?: string | null;
  design_data?: Record<string, unknown>;
  paint_projects?: {
    id: string;
    design_data: Record<string, unknown>;
    photo_path: string | null;
  } | null;
};

function configured() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

function authHeaders(accessToken: string) {
  if (!configured()) throw new Error('Supabase-yhteyttä ei ole määritetty.');
  return {
    apikey: SUPABASE_ANON_KEY!,
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };
}

async function uploadProjectArtifact(projectId: string, file: Blob, filename: string) {
  if (!configured()) throw new Error('Supabase-yhteyttä ei ole määritetty.');
  const session = await requireSession();
  const safeName = filename.toLowerCase().replace(/[^a-z0-9._-]+/g, '-').slice(-100);
  const path = `${session.user.id}/${projectId}/${Date.now()}-${safeName}`;
  const response = await fetch(`${SUPABASE_URL}/storage/v1/object/paint-planner/${path}`, {
    method: 'POST',
    headers: {
      ...authHeaders(session.access_token),
      'Content-Type': file.type || 'application/octet-stream',
      'x-upsert': 'false',
    },
    body: file,
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload?.message || payload?.error || 'Tiedoston tallennus epäonnistui.');
  }
  return path;
}

async function sendContractorEmail(payload: PainterOrderPayload) {
  const form = new FormData();
  form.append('formType', 'quote');
  form.append('name', payload.customer.name);
  form.append('email', payload.customer.email);
  form.append('phone', payload.customer.phone);
  form.append('address', payload.customer.address);
  form.append('city', payload.customer.city);
  form.append('propertyType', payload.category === 'exterior' ? 'Ulkokohde' : 'Sisäkohde');
  form.append('service', 'VäriKamu Virtual House Painter');
  form.append('surfaceArea', payload.totalAreaM2 ? `${payload.totalAreaM2.toFixed(1)} m²` : 'Ei ilmoitettu');
  form.append('timeline', 'Ei määritetty');
  form.append('budget', 'Ei määritetty');
  form.append('message', payload.summaryText);
  form.append('website', '');
  form.append('files[]', new File([payload.beforeBlob], 'varikamu-before.jpg', { type: 'image/jpeg' }));
  form.append('files[]', new File([payload.afterBlob], 'varikamu-after.jpg', { type: 'image/jpeg' }));

  const response = await fetch('/send-mail.php', { method: 'POST', body: form });
  if (!response.ok) throw new Error('Tilaus tallennettiin, mutta sähköposti urakoitsijalle epäonnistui.');
}

export async function submitPainterOrder(payload: PainterOrderPayload) {
  const project = await createProject({
    title: `VäriKamu · ${payload.customer.address || payload.customer.city || 'maalaussuunnitelma'}`,
    category: payload.category,
    city: payload.customer.city || null,
    status: 'draft',
    design_data: {
      app: 'virtual-house-painter',
      version: 1,
      polygons: payload.polygons,
      coverage: { areaM2: payload.totalAreaM2, estimatedPaintLitres: payload.totalPaintLitres },
      customer: payload.customer,
    },
  });

  const [beforePath, afterPath, pdfPath] = await Promise.all([
    uploadProjectArtifact(project.id, payload.beforeBlob, 'before.jpg'),
    uploadProjectArtifact(project.id, payload.afterBlob, 'after.jpg'),
    uploadProjectArtifact(project.id, payload.pdfBlob, 'order-summary.pdf'),
  ]);

  const designData = {
    app: 'virtual-house-painter',
    version: 1,
    polygons: payload.polygons,
    coverage: { areaM2: payload.totalAreaM2, estimatedPaintLitres: payload.totalPaintLitres },
    customer: payload.customer,
    artifacts: { beforePath, afterPath, pdfPath },
  };

  await updateProject(project.id, {
    status: 'quote_requested',
    photo_path: afterPath,
    design_data: designData,
  });

  const baseQuote = {
    project_id: project.id,
    project_title: project.title,
    city: payload.customer.city,
    estimate_low: null,
    estimate_high: null,
    name: payload.customer.name,
    email: payload.customer.email,
    phone: payload.customer.phone,
    message: payload.summaryText,
    status: 'received',
  };

  try {
    await createQuoteRequest({
      ...baseQuote,
      summary_pdf_path: pdfPath,
      before_image_path: beforePath,
      after_image_path: afterPath,
      design_data: designData,
    });
  } catch {
    await createQuoteRequest(baseQuote);
  }

  let emailDelivered = true;
  try {
    await sendContractorEmail(payload);
  } catch {
    emailDelivered = false;
  }

  return { projectId: project.id, beforePath, afterPath, pdfPath, emailDelivered };
}

export async function listPainterOrdersForAdmin() {
  const session = await requireSession();
  if (!configured()) throw new Error('Supabase-yhteyttä ei ole määritetty.');
  const select = encodeURIComponent('*,paint_projects(id,design_data,photo_path)');
  const response = await fetch(`${SUPABASE_URL}/rest/v1/quote_requests?select=${select}&order=created_at.desc`, {
    headers: authHeaders(session.access_token),
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload?.message || payload?.error || 'Admin-tilausten lataus epäonnistui.');
  }
  return response.json() as Promise<AdminPainterOrder[]>;
}

export async function getPainterArtifactUrl(path: string | null | undefined) {
  if (!path) return null;
  const session = await requireSession();
  if (!configured()) throw new Error('Supabase-yhteyttä ei ole määritetty.');
  const response = await fetch(`${SUPABASE_URL}/storage/v1/object/sign/paint-planner/${path}`, {
    method: 'POST',
    headers: authHeaders(session.access_token),
    body: JSON.stringify({ expiresIn: 900 }),
  });
  if (!response.ok) return null;
  const payload = await response.json() as { signedURL?: string; signedUrl?: string };
  const signed = payload.signedURL || payload.signedUrl;
  if (!signed) return null;
  return signed.startsWith('http') ? signed : `${SUPABASE_URL}/storage/v1${signed}`;
}
