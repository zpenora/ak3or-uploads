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

function attachCategory(rows, categories) {
  const map = new Map(categories.map((c) => [c.id, c]));
  return rows.map((a) => ({
    ...a,
    category_slug: map.get(a.category_id)?.slug,
    category_name: map.get(a.category_id)?.name,
  }));
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const {
        slug,
        id,
        platform,
        category,
        featured,
        trending,
        search,
        sort = 'recent',
        limit = '100',
        includeDrafts,
      } = req.query;

      // Single app by slug or id
      if (slug || id) {
        let q = supabase.from('applications').select('*').limit(1);
        if (slug) q = q.eq('slug', slug);
        if (id) q = q.eq('id', id);
        const { data, error } = await q;
        if (error) throw error;
        const row = data?.[0];
        if (!row) return res.status(404).json({ error: 'Not found' });
        // For public access, only published
        if (row.status !== 'published' && includeDrafts !== 'true') {
          const admin = await requireAdmin(req);
          if (!admin) return res.status(404).json({ error: 'Not found' });
        }
        const { data: cats } = await supabase.from('categories').select('*');
        const [withCat] = attachCategory([row], cats || []);
        return res.status(200).json(withCat);
      }

      // List
      let q = supabase.from('applications').select('*');
      if (includeDrafts === 'true') {
        const admin = await requireAdmin(req);
        if (!admin) return res.status(401).json({ error: 'Unauthorized' });
      } else {
        q = q.eq('status', 'published');
      }
      if (platform) q = q.eq('platform', platform);
      if (featured === 'true') q = q.eq('featured', true);
      if (trending === 'true') q = q.eq('trending', true);
      if (search) {
        const s = search.replace(/[%_]/g, '');
        q = q.or(`name.ilike.%${s}%,tagline.ilike.%${s}%,developer.ilike.%${s}%`);
      }
      if (category) {
        const { data: cat } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', category)
          .maybeSingle();
        if (cat) q = q.eq('category_id', cat.id);
        else return res.status(200).json([]);
      }
      if (sort === 'popular') q = q.order('downloads_count', { ascending: false });
      else if (sort === 'rating') q = q.order('rating', { ascending: false });
      else if (sort === 'name') q = q.order('name', { ascending: true });
      else q = q.order('updated_at', { ascending: false });
      q = q.limit(Math.min(parseInt(limit) || 100, 200));
      const { data, error } = await q;
      if (error) throw error;
      const { data: cats } = await supabase.from('categories').select('*');
      return res.status(200).json(attachCategory(data || [], cats || []));
    }

    const admin = await requireAdmin(req);
    if (!admin) return res.status(401).json({ error: 'Unauthorized' });

    if (req.method === 'POST') {
      const body = req.body || {};
      const row = {
        slug: body.slug,
        name: body.name,
        tagline: body.tagline || '',
        description: body.description || '',
        category_id: body.category_id,
        platform: body.platform,
        developer: body.developer || '',
        version: body.version || '1.0.0',
        size: body.size || '',
        logo_url: body.logo_url || '',
        screenshots: body.screenshots || [],
        download_type: body.download_type,
        store_url: body.store_url || null,
        apk_url: body.apk_url || null,
        apk_size_bytes: body.apk_size_bytes || null,
        rating: body.rating ?? 4.5,
        downloads_count: body.downloads_count ?? 0,
        featured: !!body.featured,
        trending: !!body.trending,
        status: body.status || 'published',
      };
      const { data, error } = await supabase.from('applications').insert(row).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }

    if (req.method === 'PUT') {
      const { id, ...updates } = req.body || {};
      if (!id) return res.status(400).json({ error: 'Missing id' });
      updates.updated_at = new Date().toISOString();
      const { data, error } = await supabase
        .from('applications')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'DELETE') {
      const { id } = req.body || {};
      if (!id) return res.status(400).json({ error: 'Missing id' });
      const { error } = await supabase.from('applications').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('apps error', err);
    res.status(500).json({ error: err.message || String(err) });
  }
}
