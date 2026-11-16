import supabase from './db-client.js';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(200).json({ isAdmin: false });
    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    const { data, error } = await client.auth.getUser(token);
    if (error || !data.user) return res.status(200).json({ isAdmin: false });
    const { data: admin } = await supabase
      .from('admins')
      .select('id')
      .eq('user_id', data.user.id)
      .maybeSingle();
    return res.status(200).json({ isAdmin: !!admin, email: data.user.email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
