'use client';
import { GoogleAnalytics, sendGAEvent } from '@next/third-parties/google';
import { useEffect, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import { analyticsParameters } from '@/lib/analytics';
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
  if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/ops') && getConsent() === 'accepted')
    sendGAEvent('event', event, analyticsParameters(window.location.pathname, parameters));
}
export default function Analytics() {
  const consent = useSyncExternalStore(subscribe, getConsent, () => 'server');
  const pathname = usePathname();
  useEffect(() => {
    if (consent !== 'accepted' || pathname.startsWith('/ops')) return;
    if (pathname.startsWith('/services/')) track('service_viewed');
    if (pathname.startsWith('/work/')) track('demonstration_viewed');
    if (pathname === '/pricing') track('pricing_view');
    if (pathname === '/security') track('security_view');
  }, [consent, pathname]);
  function choose(value: string) {
    memoryChoice = value;
    try { localStorage.setItem(key, value); } catch { /* Choice still applies for this visit. */ }
    window.dispatchEvent(new Event('buildzn-consent-changed'));
    if (value === 'declined' && document.querySelector('script[src*="googletagmanager"]')) window.location.reload();
  }
  if(pathname.startsWith('/ops')) return null;
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
    if (document.querySelector('script[src*="googletagmanager"]')) window.location.reload();
  }}>Analytics settings</button>;
}
