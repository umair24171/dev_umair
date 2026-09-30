'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Logo from './Logo';
import TrackedLink from './TrackedLink';
const links = [['Services', '/services'], ['Work', '/work'], ['Pricing', '/pricing'], ['About', '/about'], ['Insights', '/blog']];
export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    const opener = trigger.current;
    const width = window.matchMedia('(min-width: 801px)');
    const onResize = () => { if (width.matches) setOpen(false); };
    width.addEventListener('change', onResize);
    document.body.style.overflow = 'hidden';
    panel.current?.querySelector<HTMLElement>('button')?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') { event.preventDefault(); setOpen(false); }
      if (event.key === 'Tab') {
        const elements = panel.current?.querySelectorAll<HTMLElement>('a, button');
        if (!elements?.length) return;
        const first = elements[0], last = elements[elements.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    }
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = previous; document.removeEventListener('keydown', onKey); width.removeEventListener('change', onResize); opener?.focus(); };
  }, [open]);
  return <header className="site-header"><div className="shell header-inner">
    <Link href="/" aria-label="BuildZn home"><Logo width={138} height={35} /></Link>
    <nav className="desktop-nav" aria-label="Main navigation">{links.map(([name, href]) => <Link key={name} href={href} aria-current={pathname === href ? 'page' : undefined}>{name}</Link>)}</nav>
    <TrackedLink href="/contact" className="button button-small header-cta" location="header">Discuss your workflow <span aria-hidden="true">↗</span></TrackedLink>
    <button ref={trigger} type="button" className="menu-toggle" aria-label="Open menu" aria-expanded={open} aria-controls={open ? 'mobile-menu' : undefined} onClick={() => setOpen(true)}><span /><span /></button>
    {open && <div className="mobile-menu" id="mobile-menu" ref={panel} role="dialog" aria-modal="true" aria-label="Navigation menu">
      <div className="mobile-menu-top"><Logo width={138} height={35}/><button type="button" className="menu-close" aria-label="Close menu" onClick={() => setOpen(false)}>×</button></div>
      <nav aria-label="Mobile navigation">{links.map(([name, href]) => <Link key={name} href={href} onClick={() => setOpen(false)}>{name}<span aria-hidden="true">↗</span></Link>)}<Link href="/contact" className="button" onClick={() => setOpen(false)}>Discuss your workflow</Link></nav>
      <p className="muted">AI agents. Business automation. Clear review points.</p>
    </div>}
  </div></header>;
}
