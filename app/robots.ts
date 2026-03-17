import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: 'https://devumair.vercel.app/sitemap.xml',
    host: 'https://devumair.vercel.app',
  };
}
