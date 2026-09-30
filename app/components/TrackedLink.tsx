'use client';
import Link from 'next/link';
import { track } from './Analytics';
export default function TrackedLink({ href, children, className, event = 'primary_cta_clicked', location }: { href: string; children: React.ReactNode; className?: string; event?: string; location: string }) {
  return <Link href={href} className={className} onClick={() => track(event, { location })}>{children}</Link>;
}
