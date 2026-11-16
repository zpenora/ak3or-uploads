import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, Trash2, Loader2, Save, ImagePlus, X, PackagePlus } from 'lucide-react';
import supabase from '../../lib/supabase';
import type { AppRecord, Category, DownloadType, Platform, AppStatus } from '../../lib/types';
import { formatBytes } from '../../lib/format';
import { useToast } from '../../contexts/ToastContext';

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function authHeaders() {
  const token = (await supabase.auth.getSession()).data.session?.access_token;
  return { Authorization: `Bearer ${token}` } as Record<string, string>;
}

async function uploadFile(file: File, bucket: string): Promise<{ url: string; size: number }> {
  const base64 = await new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve((r.result as string).split(',')[1]);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(await authHeaders()) },
    body: JSON.stringify({ bucket, fileName: file.name, fileBase64: base64, contentType: file.type }),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Upload failed');
  return res.json();
}

interface FormState {
  slug: string; name: string; tagline: string; description: string;
  category_id: number; platform: Platform; developer: string;
  version: string; size: string; logo_url: string; screenshots: string[];
  download_type: DownloadType; store_url: string | null; apk_url: string | null;
  apk_size_bytes: number | null; rating: number; downloads_count: number;
  featured: boolean; trending: boolean; status: AppStatus;
}

export default function AdminAppEdit() {
  const { id } = useParams();
  const nav = useNavigate();
  const { push } = useToast();
  const isNew = !id || id === 'new';
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingShots, setUploadingShots] = useState(false);
  const [uploadingApk, setUploadingApk] = useState(false);
  const logoRef = useRef<HTMLInputElement>(null);
  const shotRef = useRef<HTMLInputElement>(null);
  const apkRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormState>({
    slug: '', name: '', tagline: '', description: '',
    category_id: 0, platform: 'android', developer: '',
    version: '1.0.0', size: '', logo_url: '', screenshots: [],
    download_type: 'play', store_url: '', apk_url: null,
    apk_size_bytes: null, rating: 4.5, downloads_count: 0,
    featured: false, trending: false, status: 'published',
  });

  useEffect(() => {
    document.title = (isNew ? 'New application' : 'Edit application') + ' — Admin';
    (async () => {
      const headers = await authHeaders();
      const cr = await fetch('/api/categories');
      const catData: Category[] = await cr.json();
      setCats(catData);
      if (!isNew) {
        const r = await fetch(`/api/apps?id=${id}&includeDrafts=true`, { headers });
        if (r.ok) {
          const a: AppRecord = await r.json();
          setForm({
            slug: a.slug, name: a.name, tagline: a.tagline || '', description: a.description || '',
            category_id: a.category_id, platform: a.platform, developer: a.developer,
            version: a.version, size: a.size, logo_url: a.logo_url, screenshots: a.screenshots || [],
            download_type: a.download_type, store_url: a.store_url, apk_url: a.apk_url,
            apk_size_bytes: a.apk_size_bytes, rating: a.rating, downloads_count: a.downloads_count,
            featured: a.featured, trending: a.trending, status: a.status,
          });
        }
        setLoading(false);
      } else {
        setForm((f) => ({ ...f, category_id: catData[0]?.id || 0 }));
      }
    })();
  }, [id, isNew]);

  function set<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    setUploadingLogo(true);
    try {
      const { url } = await uploadFile(f, 'app-logos');
      set('logo_url', url);
      push('success', 'Logo uploaded');
    } catch (err) { push('error', (err as Error).message); }
    finally { setUploadingLogo(false); if (logoRef.current) logoRef.current.value = ''; }
  }

  async function onShots(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []); if (!files.length) return;
    setUploadingShots(true);
    try {
      const urls: string[] = [];
      for (const f of files) {
        const { url } = await uploadFile(f, 'app-screenshots');
        urls.push(url);
      }
      set('screenshots', [...form.screenshots, ...urls]);
      push('success', `${urls.length} screenshot${urls.length > 1 ? 's' : ''} added`);
    } catch (err) { push('error', (err as Error).message); }
    finally { setUploadingShots(false); if (shotRef.current) shotRef.current.value = ''; }
  }

  async function onApk(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    if (!f.name.toLowerCase().endsWith('.apk')) {
      push('error', 'Only .apk files are allowed'); return;
    }
    setUploadingApk(true);
    try {
      const { url, size } = await uploadFile(f, 'app-apks');
      setForm((frm) => ({ ...frm, apk_url: url, apk_size_bytes: size, size: formatBytes(size) }));
      push('success', 'APK uploaded');
    } catch (err) { push('error', (err as Error).message); }
    finally { setUploadingApk(false); if (apkRef.current) apkRef.current.value = ''; }
  }

  async function save() {
    if (!form.name || !form.slug) { push('error', 'Name and slug are required'); return; }
    if (!form.category_id) { push('error', 'Select a category'); return; }
    if (!form.logo_url) { push('error', 'Upload a logo'); return; }
    if (form.download_type === 'play' && !form.store_url) { push('error', 'Enter the Play Store URL'); return; }
    if (form.download_type === 'appstore' && !form.store_url) { push('error', 'Enter the App Store URL'); return; }
    if (form.download_type === 'apk' && !form.apk_url) { push('error', 'Upload an APK file'); return; }
    setSaving(true);
    try {
      const headers = { 'Content-Type': 'application/json', ...(await authHeaders()) };
      const payload = {
        ...form,
        store_url: form.download_type === 'apk' ? null : form.store_url,
        apk_url: form.download_type === 'apk' ? form.apk_url : null,
        apk_size_bytes: form.download_type === 'apk' ? form.apk_size_bytes : null,
      };
      const r = isNew
        ? await fetch('/api/apps', { method: 'POST', headers, body: JSON.stringify(payload) })
        : await fetch('/api/apps', { method: 'PUT', headers, body: JSON.stringify({ id: Number(id), ...payload }) });
      if (!r.ok) throw new Error((await r.json()).error || 'Save failed');
      push('success', isNew ? 'Application created' : 'Changes saved');
      nav('/admin/apps');
    } catch (err) { push('error', (err as Error).message); }
    finally { setSaving(false); }
  }

  if (loading) return <div className="grid place-items-center py-20"><Loader2 className="animate-spin text-[var(--color-primary-glow)]" /></div>;

  return (
    <div className="max-w-5xl mx-auto">
      <button onClick={() => nav('/admin/apps')} className="inline-flex items-center gap-1 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] mb-4">
        <ArrowLeft size={14} /> Back to applications
      </button>
      <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <h1 className="font-display font-bold text-2xl md:text-3xl">
          {isNew ? 'New application' : 'Edit application'}
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => setForm((f) => ({ ...f, status: f.status === 'published' ? 'draft' : 'published' }))}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-[var(--input-bg)] border border-[var(--glass-border)] hover:bg-[var(--hover-bg-strong)]"
          >
            {form.status === 'published' ? 'Mark as draft' : 'Mark as published'}
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="btn-primary rounded-xl px-5 py-2.5 inline-flex items-center gap-2 text-white text-sm font-semibold disabled:opacity-60"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Save
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Basics">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Name" required>
                <input
                  value={form.name}
                  onChange={(e) => { const v = e.target.value; set('name', v); if (isNew && !form.slug) set('slug', slugify(v)); }}
                  className="input"
                  placeholder="Ak3or Studio"
                />
              </Field>
              <Field label="Slug" required>
                <input value={form.slug} onChange={(e) => set('slug', slugify(e.target.value))} className="input" placeholder="ak3or-studio" />
              </Field>
              <Field label="Developer">
                <input value={form.developer} onChange={(e) => set('developer', e.target.value)} className="input" placeholder="Pixel Lab" />
              </Field>
              <Field label="Category" required>
                <select value={form.category_id} onChange={(e) => set('category_id', Number(e.target.value))} className="input">
                  <option value="">Select…</option>
                  {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </Field>
              <Field label="Platform" required>
                <select value={form.platform} onChange={(e) => set('platform', e.target.value as Platform)} className="input">
                  <option value="android">Android</option>
                  <option value="ios">iOS</option>
                  <option value="cross">Cross-platform</option>
                </select>
              </Field>
              <Field label="Version">
                <input value={form.version} onChange={(e) => set('version', e.target.value)} className="input" placeholder="1.0.0" />
              </Field>
              <Field label="Size (display)">
                <input value={form.size} onChange={(e) => set('size', e.target.value)} className="input" placeholder="24 MB" />
              </Field>
              <Field label="Rating">
                <input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => set('rating', Number(e.target.value))} className="input" />
              </Field>
            </div>
            <Field label="Tagline">
              <input value={form.tagline} onChange={(e) => set('tagline', e.target.value)} className="input" placeholder="A one-line pitch." />
            </Field>
            <Field label="Full description">
              <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={6} className="input" placeholder="Rich description shown on the app detail page." />
            </Field>
          </Card>

          <Card title="Download">
            <div className="grid grid-cols-3 gap-2 mb-4">
              {(['play', 'appstore', 'apk'] as DownloadType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => set('download_type', t)}
                  className={`p-3 rounded-xl text-sm font-medium border transition-colors text-center ${
                    form.download_type === t
                      ? 'bg-[var(--color-primary)]/15 border-[var(--color-primary)]/40 text-white'
                      : 'bg-[var(--input-bg)] border-[var(--glass-border)] text-[var(--color-text-muted)]'
                  }`}
                >
                  {t === 'play' ? 'Google Play' : t === 'appstore' ? 'App Store' : 'APK file'}
                </button>
              ))}
            </div>
            {form.download_type !== 'apk' && (
              <Field label={form.download_type === 'play' ? 'Google Play URL' : 'App Store URL'} required>
                <input
                  value={form.store_url || ''}
                  onChange={(e) => set('store_url', e.target.value)}
                  className="input"
                  placeholder={form.download_type === 'play' ? 'https://play.google.com/store/apps/details?id=...' : 'https://apps.apple.com/app/...'}
                />
              </Field>
            )}
            {form.download_type === 'apk' && (
              <div>
                <div className="text-xs font-medium text-[var(--color-text-muted)] mb-1.5">APK file <span className="text-rose-300">*</span></div>
                {form.apk_url ? (
                  <div className="glass rounded-xl p-4 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/15 text-emerald-300 grid place-items-center">
                      <PackagePlus size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium truncate">APK ready · {formatBytes(form.apk_size_bytes)}</div>
                      <div className="text-xs text-[var(--color-text-muted)] truncate">{form.apk_url}</div>
                    </div>
                    <button onClick={() => setForm((f) => ({ ...f, apk_url: null, apk_size_bytes: null }))} className="text-xs text-rose-300 hover:underline">Remove</button>
                  </div>
                ) : (
                  <button
                    onClick={() => apkRef.current?.click()}
                    disabled={uploadingApk}
                    className="glass rounded-xl p-6 w-full text-center hover:border-[var(--glass-border)] transition-colors"
                  >
                    {uploadingApk ? (
                      <Loader2 className="animate-spin inline" />
                    ) : (
                      <>
                        <PackagePlus className="inline text-[var(--color-primary-glow)] mb-2" />
                        <div className="text-sm">Upload APK file (max 200 MB)</div>
                      </>
                    )}
                  </button>
                )}
                <input ref={apkRef} type="file" accept=".apk,application/vnd.android.package-archive" onChange={onApk} className="hidden" />
                <p className="text-xs text-amber-200/80 mt-3 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                  APK downloads are Android-only. Visitors see an installation warning on the detail page.
                </p>
              </div>
            )}
          </Card>

          <Card title="Screenshots">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {form.screenshots.map((s, i) => (
                <div key={i} className="relative aspect-[9/16] rounded-xl overflow-hidden ring-1 ring-white/10">
                  <img src={s} alt="" className="h-full w-full object-cover" />
                  <button
                    onClick={() => set('screenshots', form.screenshots.filter((_, j) => j !== i))}
                    className="absolute top-1 right-1 h-7 w-7 grid place-items-center rounded-lg bg-black/60 hover:bg-rose-500/80 text-white"
                  >
                    <X size={13} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => shotRef.current?.click()}
                disabled={uploadingShots}
                className="aspect-[9/16] glass rounded-xl grid place-items-center text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-[var(--glass-border)]"
              >
                {uploadingShots ? <Loader2 className="animate-spin" /> : <div className="text-center"><ImagePlus className="mx-auto mb-1" size={18} /><div className="text-xs">Add</div></div>}
              </button>
              <input ref={shotRef} type="file" accept="image/*" multiple onChange={onShots} className="hidden" />
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Logo">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-2xl overflow-hidden ring-1 ring-white/10 bg-[var(--input-bg)] grid place-items-center">
                {form.logo_url ? <img src={form.logo_url} className="h-full w-full object-cover" alt="" /> : <span className="text-[var(--color-text-dim)] text-xs">No logo</span>}
              </div>
              <div className="flex-1">
                <button
                  onClick={() => logoRef.current?.click()}
                  disabled={uploadingLogo}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--input-bg)] border border-[var(--glass-border)] hover:bg-[var(--hover-bg-strong)] text-sm w-full justify-center"
                >
                  {uploadingLogo ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                  Upload logo
                </button>
                {form.logo_url && (
                  <button onClick={() => set('logo_url', '')} className="mt-2 w-full inline-flex items-center justify-center gap-1 text-xs text-rose-300 hover:underline">
                    <Trash2 size={11} /> Remove
                  </button>
                )}
                <input ref={logoRef} type="file" accept="image/*" onChange={onLogo} className="hidden" />
              </div>
            </div>
          </Card>

          <Card title="Visibility">
            <Toggle label="Featured on homepage" checked={form.featured} onChange={(v) => set('featured', v)} />
            <Toggle label="Mark as trending" checked={form.trending} onChange={(v) => set('trending', v)} />
            <Field label="Status">
              <select value={form.status} onChange={(e) => set('status', e.target.value as AppStatus)} className="input">
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </Field>
            <Field label="Downloads count">
              <input type="number" value={form.downloads_count} onChange={(e) => set('downloads_count', Number(e.target.value))} className="input" />
            </Field>
          </Card>
        </div>
      </div>

      <style>{`
        .input { width: 100%; padding: 0.625rem 0.875rem; border-radius: 0.75rem; background: var(--input-bg); border: 1px solid var(--glass-border); font-size: 0.875rem; color: var(--color-text); outline: none; transition: border-color .15s; }
        .input:focus { border-color: rgba(139,92,246,0.5); }
      `}</style>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="glass rounded-2xl p-5">
      <h3 className="font-display font-semibold text-sm text-[var(--color-text-muted)] uppercase tracking-wider mb-4">{title}</h3>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-[var(--color-text-muted)]">
        {label} {required && <span className="text-rose-300">*</span>}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between gap-3 py-2">
      <span className="text-sm">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition-colors ${checked ? 'bg-[var(--color-primary)]' : 'bg-[var(--hover-bg-strong)]'}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
    </label>
  );
}
