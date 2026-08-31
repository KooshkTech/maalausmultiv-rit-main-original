import { useEffect, useState } from 'react';
import { Download, FileText, Loader2, RefreshCw } from 'lucide-react';
import { getPainterArtifactUrl, listPainterOrdersForAdmin, type AdminPainterOrder } from '@/lib/virtualPainterApi';

export function VirtualPainterAdminPage() {
  const [orders, setOrders] = useState<AdminPainterOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const rows = await listPainterOrdersForAdmin();
      setOrders(rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Tilausten lataus epäonnistui.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const openArtifact = async (path: string | null | undefined) => {
    const url = await getPainterArtifactUrl(path);
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-orange-600">Admin</p>
            <h1 className="font-display text-2xl font-black text-navy-950">Virtual House Painter -tilaukset</h1>
            <p className="mt-1 text-sm text-slate-500">Asiakkaan värivalinnat, kuvat, PDF-yhteenveto ja tarjouspyyntö yhdessä näkymässä.</p>
          </div>
          <button className="btn-outline" onClick={() => void load()} disabled={loading}><RefreshCw className={`size-4 ${loading ? 'animate-spin' : ''}`} /> Päivitä</button>
        </div>

        {error && <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
        {loading ? <div className="grid min-h-[40vh] place-items-center"><Loader2 className="size-8 animate-spin text-orange-500" /></div> : (
          <div className="mt-4 space-y-3">
            {orders.length === 0 && <div className="card p-8 text-center text-sm text-slate-500">Ei Virtual House Painter -tilauksia tai tällä käyttäjällä ei ole admin-oikeutta.</div>}
            {orders.map((order) => {
              const projectData = order.paint_projects?.design_data ?? order.design_data ?? {};
              const artifacts = (projectData.artifacts ?? {}) as { beforePath?: string; afterPath?: string; pdfPath?: string };
              const pdfPath = order.summary_pdf_path ?? artifacts.pdfPath;
              const beforePath = order.before_image_path ?? artifacts.beforePath;
              const afterPath = order.after_image_path ?? artifacts.afterPath;
              return (
                <article key={order.id} className="card p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2"><h2 className="font-bold text-navy-950">{order.project_title}</h2><span className="rounded-full bg-orange-50 px-2 py-1 text-xs font-bold text-orange-700">{order.status}</span></div>
                      <p className="mt-2 text-sm text-slate-700">{order.name} · {order.phone} · {order.email}</p>
                      <p className="text-sm text-slate-500">{order.city || 'Sijaintia ei ilmoitettu'} · {new Date(order.created_at).toLocaleString('fi-FI')}</p>
                      {order.message && <pre className="mt-3 whitespace-pre-wrap rounded-xl bg-slate-50 p-3 text-xs text-slate-600">{order.message}</pre>}
                    </div>
                    <div className="flex shrink-0 flex-wrap gap-2">
                      <button className="btn-outline" disabled={!beforePath} onClick={() => void openArtifact(beforePath)}><Download className="size-4" /> Ennen</button>
                      <button className="btn-outline" disabled={!afterPath} onClick={() => void openArtifact(afterPath)}><Download className="size-4" /> Jälkeen</button>
                      <button className="btn-primary" disabled={!pdfPath} onClick={() => void openArtifact(pdfPath)}><FileText className="size-4" /> PDF</button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
