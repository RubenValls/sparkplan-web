import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard', '/plans', '/api'],
    },
    sitemap: 'https://www.sparkplanapp.com/sitemap.xml',
  };
}
