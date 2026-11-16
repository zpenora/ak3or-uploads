import { Link } from 'react-router-dom';
import Logo from './Logo';
import TikTokIcon from './TikTokIcon';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-[var(--glass-border)] bg-[color-mix(in_srgb,black_12%,transparent)] pb-24 md:pb-10">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 grid gap-10 md:grid-cols-4">
        <div>
          <Logo />
          <p className="text-sm text-[var(--color-text-muted)] mt-3 leading-relaxed">
            A curated marketplace for discovering premium mobile applications across Android and iOS.
          </p>
          <a
            href="https://www.tiktok.com/@ak3or"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 px-3 py-2 rounded-xl glass hover:border-[var(--color-primary)]/50 text-sm font-semibold text-[var(--color-text)] transition-colors"
            aria-label="Follow Ak3or on TikTok"
          >
            <span className="h-7 w-7 rounded-lg bg-gradient-to-br from-fuchsia-500 via-rose-500 to-cyan-400 grid place-items-center text-white">
              <TikTokIcon size={14} />
            </span>
            <span>Follow on TikTok</span>
            <span className="text-[var(--color-text-muted)] text-xs">@ak3or</span>
          </a>
        </div>
        <div>
          <h4 className="font-display font-semibold text-sm mb-3">Discover</h4>
          <ul className="space-y-2 text-sm text-[var(--color-text-muted)]">
            <li><Link to="/" className="hover:text-[var(--color-text)]">Home</Link></li>
            <li><Link to="/categories" className="hover:text-[var(--color-text)]">Categories</Link></li>
            <li><Link to="/platform/android" className="hover:text-[var(--color-text)]">Android apps</Link></li>
            <li><Link to="/platform/ios" className="hover:text-[var(--color-text)]">iOS apps</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display font-semibold text-sm mb-3">Company</h4>
          <ul className="space-y-2 text-sm text-[var(--color-text-muted)]">
            <li><Link to="/about" className="hover:text-[var(--color-text)]">About</Link></li>
            <li><Link to="/contact" className="hover:text-[var(--color-text)]">Contact</Link></li>
            <li><Link to="/settings" className="hover:text-[var(--color-text)]">Settings</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display font-semibold text-sm mb-3">Follow</h4>
          <ul className="space-y-2 text-sm text-[var(--color-text-muted)]">
            <li>
              <a
                href="https://www.tiktok.com/@ak3or"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-[var(--color-text)]"
              >
                <TikTokIcon size={14} /> TikTok @ak3or
              </a>
            </li>
            <li><Link to="/privacy" className="hover:text-[var(--color-text)]">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-[var(--color-text)]">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[var(--glass-border)]">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 text-xs text-[var(--color-text-dim)] flex flex-wrap items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} Ak3or. All rights reserved.</span>
          <span>Google Play and the Google Play logo are trademarks of Google LLC. App Store is a trademark of Apple Inc.</span>
        </div>
      </div>
    </footer>
  );
}
