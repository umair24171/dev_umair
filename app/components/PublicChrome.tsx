'use client';
import { usePathname } from 'next/navigation';
export default function PublicChrome({ children, header, footer, analytics }: {
    children: React.ReactNode;
    header: React.ReactNode;
    footer: React.ReactNode;
    analytics: React.ReactNode;
}) { const privatePage = usePathname().startsWith('/ops'); return <>{!privatePage && header}{children}{!privatePage && footer}{!privatePage && analytics}</>; }
