'use client';
import { GoogleAnalytics, sendGAEvent } from '@next/third-parties/google';
import { useEffect, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
const key = 'buildzn-analytics-consent';
let memoryChoice = 'pending';
function getConsent() {
  try { const value = localStorage.getItem(key); return value === 'accepted' || value === 'declined' ? value : memoryChoice; } catch { return memoryChoice; }
}
function subscribe(callback: () => void) {
  window.addEventListener('buildzn-consent-changed', callback);
  window.addEventListener('storage', callback);
  return () => { window.removeEventListener('buildzn-consent-changed', callback); window.removeEventListener('storage', callback); };
}
export function track(event: string, parameters: Record<string, string> = {}) {
  if (getConsent() === 'accepted') sendGAEvent('event', event, parameters);
}
export default function Analytics() {
  const consent = useSyncExternalStore(subscribe, getConsent, () => 'server');
  const pathname = usePathname();
  useEffect(() => {
    if (consent !== 'accepted') return;
    if (pathname.startsWith('/services/')) track('service_viewed', { service: pathname.split('/').pop()! });
    if (pathname.startsWith('/work/')) track('case_study_viewed', { project: pathname.split('/').pop()! });
  }, [consent, pathname]);
  function choose(value: string) {
    memoryChoice = value;
    try { localStorage.setItem(key, value); } catch { /* Choice still applies for this visit. */ }
    window.dispatchEvent(new Event('buildzn-consent-changed'));
    if (value === 'declined' && document.querySelector('script[src*="googletagmanager"]')) window.location.reload();
  }
  return <>
    {consent === 'accepted' && <GoogleAnalytics gaId="G-FB9PXBHDW9" />}
    {consent === 'pending' && <aside className="consent-banner" aria-label="Analytics preference">
      <p><strong>Your privacy, your choice.</strong> Optional analytics help me understand which pages are useful. Your project details are never sent to analytics. <a href="/privacy">Privacy policy</a></p>
      <div><button type="button" className="button button-small button-secondary" onClick={() => choose('declined')}>No thanks</button><button type="button" className="button button-small" onClick={() => choose('accepted')}>Allow analytics</button></div>
    </aside>}
  </>;
}
export function PrivacySettings() {
  return <button type="button" className="text-link" onClick={() => {
    memoryChoice = 'pending';
    try { localStorage.removeItem(key); } catch { /* Preferences still open for this visit. */ }
    window.dispatchEvent(new Event('buildzn-consent-changed'));
  }}>Analytics settings</button>;
}
