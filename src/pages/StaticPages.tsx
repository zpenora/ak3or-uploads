import { useEffect } from 'react';
import TikTokIcon from '../components/TikTokIcon';

function Shell({ title, children }: { title: string; children: React.ReactNode }) {
  useEffect(() => { document.title = `${title} — Ak3or`; }, [title]);
  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-8 py-10 pb-24 md:pb-10">
      <h1 className="font-display font-bold text-3xl md:text-4xl">{title}</h1>
      <div className="mt-6 glass rounded-2xl p-6 text-[var(--color-text-muted)] leading-relaxed space-y-4 text-sm md:text-base">
        {children}
      </div>
    </div>
  );
}

export function PrivacyPage() {
  return (
    <Shell title="Privacy Policy">
      <p><strong className="text-[var(--color-text)]">What we collect.</strong> Ak3or does not require visitor accounts. We log aggregate analytics such as app views and APK download counts to improve our catalogue. We never sell personal data.</p>
      <p><strong className="text-[var(--color-text)]">Cookies & local storage.</strong> We may use browser storage for theme preferences and anonymous session identifiers.</p>
      <p><strong className="text-[var(--color-text)]">Third-party links.</strong> Visiting Google Play or the App Store through our listings is governed by the respective privacy policies of Google and Apple.</p>
      <p><strong className="text-[var(--color-text)]">Contact.</strong> For privacy questions, contact us via the Contact page.</p>
    </Shell>
  );
}

export function TermsPage() {
  return (
    <Shell title="Terms of Service">
      <p>By using Ak3or you agree to these Terms. The service is provided "as is" without warranty of any kind.</p>
      <p><strong className="text-[var(--color-text)]">APK downloads.</strong> Some applications offer direct APK downloads. Install at your own risk and ensure your device permits installs from the source. We scan uploads but cannot guarantee third-party builds.</p>
      <p><strong className="text-[var(--color-text)]">Trademarks.</strong> Google Play and the Google Play logo are trademarks of Google LLC. App Store is a trademark of Apple Inc. All other trademarks are property of their respective owners.</p>
      <p><strong className="text-[var(--color-text)]">Content.</strong> All listed applications belong to their respective publishers. Report misuse via the Contact page.</p>
    </Shell>
  );
}

export function ContactPage() {
  return (
    <Shell title="Contact">
      <p>Questions, partnership requests, or takedown notices?</p>
      <p>Email us at <a className="text-[var(--color-primary-glow)] hover:underline" href="mailto:hello@ak3or.app">hello@ak3or.app</a> and we’ll get back within 2 business days.</p>
      <p>For developers submitting apps for inclusion, please include your store URL, logo, and screenshots.</p>
      <p className="pt-2">
        <strong className="text-[var(--color-text)]">Follow us on TikTok</strong> for daily app picks, launches, and behind-the-scenes updates:
      </p>
      <a
        href="https://www.tiktok.com/@ak3or"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-fuchsia-500/15 via-rose-500/15 to-cyan-400/15 border border-[var(--glass-border)] hover:border-fuchsia-400/60 font-semibold text-[var(--color-text)] transition-colors"
      >
        <span className="h-9 w-9 rounded-lg bg-gradient-to-br from-fuchsia-500 via-rose-500 to-cyan-400 grid place-items-center text-white">
          <TikTokIcon size={18} />
        </span>
        <span className="flex flex-col leading-tight">
          <span className="text-xs text-[var(--color-text-muted)] font-normal">TikTok</span>
          <span>@ak3or</span>
        </span>
      </a>
    </Shell>
  );
}

export function AboutPage() {
  return (
    <Shell title="About Ak3or">
      <p>Ak3or is a premium, curated directory of mobile applications. We surface quality apps across Android and iOS with a mobile-first browsing experience built for speed and clarity.</p>
      <p>No accounts. No clutter. Just a clean path from discovery to download.</p>
    </Shell>
  );
}
