import supabase from './db-client.js';
import { createClient } from '@supabase/supabase-js';

async function requireAdmin(req) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return null;
  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  const { data, error } = await client.auth.getUser(token);
  if (error || !data.user) return null;
  const { data: admin } = await supabase
    .from('admins')
    .select('id')
    .eq('user_id', data.user.id)
    .maybeSingle();
  if (!admin) return null;
  return data.user;
}

const MAX = {
  'app-logos': 3 * 1024 * 1024,
  'app-screenshots': 8 * 1024 * 1024,
  'app-apks': 200 * 1024 * 1024,
};
const ALLOWED = {
  'app-logos': ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'],
  'app-screenshots': ['image/png', 'image/jpeg', 'image/webp'],
  'app-apks': [
    'application/vnd.android.package-archive',
    'application/octet-stream',
    'application/zip',
  ],
};

export const config = {
  api: { bodyParser: { sizeLimit: '250mb' } },
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const admin = await requireAdmin(req);
    if (!admin) return res.status(401).json({ error: 'Unauthorized' });

    const { bucket, fileName, fileBase64, contentType } = req.body || {};
    if (!bucket || !fileName || !fileBase64) return res.status(400).json({ error: 'Missing fields' });
    if (!(bucket in MAX)) return res.status(400).json({ error: 'Invalid bucket' });
    if (contentType && ALLOWED[bucket] && !ALLOWED[bucket].includes(contentType)) {
      return res.status(400).json({ error: `File type ${contentType} not allowed for ${bucket}` });
    }
    const buffer = Buffer.from(fileBase64, 'base64');
    if (buffer.length > MAX[bucket]) {
      return res.status(400).json({ error: `File too large. Max ${Math.round(MAX[bucket] / 1024 / 1024)}MB` });
    }
    const safe = fileName.replace(/[^a-zA-Z0-9_.-]/g, '_');
    const path = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}_${safe}`;
    const { error: upErr } = await supabase.storage.from(bucket).upload(path, buffer, {
      contentType: contentType || 'application/octet-stream',
      upsert: false,
    });
    if (upErr) throw upErr;
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
    return res.status(200).json({ url: urlData.publicUrl, size: buffer.length, path });
  } catch (err) {
    console.error('upload error', err);
    res.status(500).json({ error: err.message || String(err) });
  }
}
