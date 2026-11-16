import supabase from './supabase';

async function authHeaders() {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiGet<T = unknown>(path: string): Promise<T> {
  const res = await fetch(path);
  if (!res.ok) throw new Error((await res.json()).error || 'Request failed');
  return res.json();
}

export async function apiSend<T = unknown>(
  path: string,
  method: 'POST' | 'PUT' | 'DELETE',
  body?: unknown,
  auth = false
): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (auth) Object.assign(headers, await authHeaders());
  const res = await fetch(path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Request failed');
  return res.json();
}
