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

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();
  try {
    const admin = await requireAdmin(req);
    if (!admin) return res.status(401).json({ error: 'Unauthorized' });

    const { data: all } = await supabase.from('applications').select('*');
    const apps = all || [];
    const totalDownloads = apps.reduce((s, a) => s + (a.downloads_count || 0), 0);
    const recent = [...apps]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 6);
    const { data: cats } = await supabase.from('categories').select('*');
    const catMap = new Map((cats || []).map((c) => [c.id, c]));
    const recentWithCat = recent.map((r) => ({
      ...r,
      category_name: catMap.get(r.category_id)?.name,
      category_slug: catMap.get(r.category_id)?.slug,
    }));
    // Category distribution
    const byCategory = {};
    for (const a of apps) {
      const name = catMap.get(a.category_id)?.name || 'Uncategorized';
      byCategory[name] = (byCategory[name] || 0) + 1;
    }
    const categoryBreakdown = Object.entries(byCategory)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // Top downloaded apps
    const topDownloads = [...apps]
      .sort((a, b) => (b.downloads_count || 0) - (a.downloads_count || 0))
      .slice(0, 5)
      .map((r) => ({
        ...r,
        category_name: catMap.get(r.category_id)?.name,
        category_slug: catMap.get(r.category_id)?.slug,
      }));

    const drafts = apps.filter((a) => a.status === 'draft').length;
    const featured = apps.filter((a) => a.featured).length;

    return res.status(200).json({
      total: apps.length,
      android: apps.filter((a) => a.platform === 'android' || a.platform === 'cross').length,
      ios: apps.filter((a) => a.platform === 'ios' || a.platform === 'cross').length,
      downloads: totalDownloads,
      apkDownloads: apps
        .filter((a) => a.download_type === 'apk')
        .reduce((s, a) => s + (a.downloads_count || 0), 0),
      drafts,
      featured,
      recent: recentWithCat,
      categoryBreakdown,
      topDownloads,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
