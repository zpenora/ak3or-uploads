export type Platform = 'android' | 'ios' | 'cross';
export type DownloadType = 'play' | 'appstore' | 'apk';
export type AppStatus = 'published' | 'draft';

export interface Category {
  id: number;
  slug: string;
  name: string;
  icon: string;
  color: string;
  description?: string;
}

export interface AppRecord {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category_id: number;
  category_slug?: string;
  category_name?: string;
  platform: Platform;
  developer: string;
  version: string;
  size: string;
  logo_url: string;
  screenshots: string[];
  download_type: DownloadType;
  store_url: string | null;
  apk_url: string | null;
  apk_size_bytes: number | null;
  rating: number;
  downloads_count: number;
  featured: boolean;
  trending: boolean;
  status: AppStatus;
  updated_at: string;
  created_at: string;
}

export interface StatsSummary {
  total: number;
  android: number;
  ios: number;
  downloads: number;
  recent: AppRecord[];
}
